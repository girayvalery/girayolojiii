import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })
    const user = session.user as any
    const { storyId, emoji, storyOwnerId } = await req.json()
    if (!storyId || !emoji) return NextResponse.json({ error: 'Eksik veri' }, { status: 400 })
    const db = await getDb()
    await db.collection('story_reactions').updateOne(
      { storyId, userId: user.id },
      { $set: { storyId, userId: user.id, userName: user.name, emoji, createdAt: new Date().toISOString() } },
      { upsert: true }
    )
    if (storyOwnerId && storyOwnerId !== user.id) {
      await db.collection('notifications').insertOne({
        userId: storyOwnerId,
        type: 'storyReaction',
        fromUserId: user.id,
        fromUserName: user.name,
        emoji,
        read: false,
        createdAt: new Date().toISOString(),
      })
    }
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
