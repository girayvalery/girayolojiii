import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'

// GET ?postId=xxx -> reaksyon sayıları + kullanıcının verdiği tepki
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const postId = searchParams.get('postId')
    if (!postId) return NextResponse.json({ error: 'postId gerekli' }, { status: 400 })

    const db = await getDb()
    const all = await db.collection('reactions').find({ postId }).toArray()
    const counts: Record<string, number> = {}
    all.forEach((r: any) => { counts[r.emoji] = (counts[r.emoji] || 0) + 1 })

    const session = await getServerSession(authOptions)
    let mine: string | null = null
    if (session?.user) {
      const userId = (session.user as any).id
      const my = all.find((r: any) => r.userId === userId)
      mine = my ? my.emoji : null
    }
    return NextResponse.json({ counts, mine, total: all.length })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST { postId, emoji } -> tepki ekle/güncelle/kaldır
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })
    const userId = (session.user as any).id
    const userName = (session.user as any).name
    const { postId, emoji } = await req.json()
    if (!postId || !emoji) return NextResponse.json({ error: 'postId ve emoji gerekli' }, { status: 400 })

    const db = await getDb()
    const existing = await db.collection('reactions').findOne({ postId, userId })

    if (existing) {
      if (existing.emoji === emoji) {
        // aynı tepki -> kaldır
        await db.collection('reactions').deleteOne({ _id: existing._id })
      } else {
        // farklı tepki -> güncelle
        await db.collection('reactions').updateOne({ _id: existing._id }, { $set: { emoji, updatedAt: new Date().toISOString() } })
      }
    } else {
      await db.collection('reactions').insertOne({ postId, userId, userName, emoji, createdAt: new Date().toISOString() })

      // Yazı sahibine bildirim gönder (kendine değilse)
      const post = await db.collection('posts').findOne({ $or: [{ id: postId }, { slug: postId }] })
      if (post && post.author?.id && post.author.id !== userId) {
        await db.collection('notifications').insertOne({
          userId: post.author.id, type: 'reaction', emoji,
          fromUserId: userId, fromUserName: userName,
          postSlug: post.slug, postTitle: post.title,
          read: false, createdAt: new Date().toISOString(),
        })
      }
    }

    const all = await db.collection('reactions').find({ postId }).toArray()
    const counts: Record<string, number> = {}
    all.forEach((r: any) => { counts[r.emoji] = (counts[r.emoji] || 0) + 1 })
    const my = await db.collection('reactions').findOne({ postId, userId })
    return NextResponse.json({ counts, mine: my?.emoji || null, total: all.length })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
