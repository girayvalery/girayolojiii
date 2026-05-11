import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const postId = searchParams.get('postId')
    if (!postId) return NextResponse.json([])
    const db = await getDb()
    const items = await db.collection('comments').find({ postId }).sort({ createdAt: 1 }).toArray()
    return NextResponse.json(items)
  } catch (err: any) {
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })
    const u = session.user as any
    const { postId, parentId, content } = await req.json()
    if (!postId || !content?.trim()) return NextResponse.json({ error: 'postId ve içerik gerekli' }, { status: 400 })

    const db = await getDb()
    const comment = {
      id: 'c_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
      postId, parentId: parentId || null,
      content: content.trim(),
      author: { id: u.id, name: u.name, username: u.username, avatar: u.avatar || '👤', avatarColor: u.avatarColor || '#1D9E75' },
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString(),
    }
    await db.collection('comments').insertOne(comment)

    const post = await db.collection('posts').findOne({ $or: [{ id: postId }, { slug: postId }] })
    if (post && post.author?.id && post.author.id !== u.id) {
      await db.collection('notifications').insertOne({
        userId: post.author.id, type: 'comment',
        fromUserId: u.id, fromUserName: u.name,
        postSlug: post.slug, postTitle: post.title,
        commentPreview: content.slice(0, 100),
        read: false, createdAt: new Date().toISOString(),
      })
    }

    return NextResponse.json(comment, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
