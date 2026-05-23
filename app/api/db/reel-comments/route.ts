import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const reelId = searchParams.get('reelId')
    if (!reelId) return NextResponse.json([])
    const db = await getDb()
    const docs = await db.collection('reel_comments').find({ reelId }).sort({ createdAt: 1 }).toArray()
    return NextResponse.json(docs)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })
    const user = session.user as any
    const { reelId, content, parentId } = await req.json()
    if (!reelId || !content?.trim()) return NextResponse.json({ error: 'Eksik' }, { status: 400 })

    const db = await getDb()
    const comment = {
      id: 'rc_' + Date.now(),
      reelId,
      parentId: parentId || null,
      author: {
        id: user.id, name: user.name, username: user.username,
        avatar: user.avatar, avatarColor: user.avatarColor,
        avatarConfig: user.avatarConfig, photoUrl: user.photoUrl,
      },
      content: content.trim(),
      likes: [],
      createdAt: new Date().toISOString(),
    }
    await db.collection('reel_comments').insertOne(comment)
    await db.collection('reels').updateOne({ id: reelId }, { $inc: { commentCount: 1 } })
    return NextResponse.json({ comment })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
