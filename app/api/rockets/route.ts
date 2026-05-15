import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const postId = searchParams.get('postId')
    if (!postId) return NextResponse.json({ count: 0, rocketed: false })
    const db = await getDb()
    const count = await db.collection('rockets').countDocuments({ postId })
    const session = await getServerSession(authOptions)
    let rocketed = false
    if (session?.user) {
      const userId = (session.user as any).id
      const my = await db.collection('rockets').findOne({ postId, userId })
      rocketed = !!my
    }
    return NextResponse.json({ count, rocketed })
  } catch (err: any) {
    return NextResponse.json({ count: 0, rocketed: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })
    const userId = (session.user as any).id
    const userName = (session.user as any).name
    const { postId } = await req.json()
    if (!postId) return NextResponse.json({ error: 'postId gerekli' }, { status: 400 })

    const db = await getDb()
    const existing = await db.collection('rockets').findOne({ postId, userId })
    if (existing) {
      await db.collection('rockets').deleteOne({ _id: existing._id })
    } else {
      await db.collection('rockets').insertOne({ postId, userId, userName, createdAt: new Date().toISOString() })
      // yazara bildirim
      const post = await db.collection('posts').findOne({ $or: [{ id: postId }, { slug: postId }] })
      if (post && post.author?.id && post.author.id !== userId) {
        await db.collection('notifications').insertOne({
          userId: post.author.id, type: 'rocket',
          fromUserId: userId, fromUserName: userName,
          postSlug: post.slug, postTitle: post.title,
          read: false, createdAt: new Date().toISOString(),
        })
      }
    }

    const count = await db.collection('rockets').countDocuments({ postId })
    const my = await db.collection('rockets').findOne({ postId, userId })
    return NextResponse.json({ rocketed: !!my, count })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
