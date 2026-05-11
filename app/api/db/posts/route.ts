import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const db = await getDb()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const filter = status ? { status } : { status: 'PUBLISHED' }
    const posts = await db.collection('posts').find(filter).sort({ publishedAt: -1 }).toArray()
    return NextResponse.json(posts)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Giriş yapmalısın.' }, { status: 401 })

  try {
    const db = await getDb()
    const body = await req.json()
    const user = session.user as any

    const newPost = {
      id: `p_${Date.now()}`,
      slug: body.slug || `post-${Date.now()}`,
      title: body.title,
      excerpt: body.excerpt || body.content.slice(0, 150),
      content: body.content,
      category: body.category,
      tags: body.tags || [],
      readTime: Math.max(2, Math.ceil(body.content.split(' ').length / 200)),
      coverEmoji: body.coverEmoji || '📝',
      bgGradient: body.bgGradient || 'from-green-950 to-emerald-900',
      coverImage: body.coverImage,
      featured: false,
      status: 'PENDING',
      viewCount: 0, likeCount: 0,
      publishedAt: new Date().toISOString(),
      author: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar || '👤',
        avatarColor: user.avatarColor || '#1D9E75',
      },
    }

    await db.collection('posts').insertOne(newPost)
    return NextResponse.json({ message: 'Yazı eklendi (admin onayı bekleniyor).', id: newPost.id }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
