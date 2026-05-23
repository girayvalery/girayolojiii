import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })
    const userId = (session.user as any).id
    const userName = (session.user as any).name
    const { rocketed } = await req.json()
    const db = await getDb()

    let reel: any = null
    try { reel = await db.collection('reels').findOne({ _id: new ObjectId(params.id) }) } catch {}
    if (!reel) reel = await db.collection('reels').findOne({ id: params.id })
    if (!reel) return NextResponse.json({ error: 'Reel bulunamadı' }, { status: 404 })

    const filter = reel._id ? { _id: reel._id } : { id: reel.id }

    const rockets = reel.rockets || []
    const has = rockets.includes(userId)

    let newRockets: string[]
    if (rocketed && !has) {
      newRockets = [...rockets, userId]
      // Sahibine bildirim
      if (reel.author?.id && reel.author.id !== userId) {
        await db.collection('notifications').insertOne({
          userId: reel.author.id,
          type: 'reaction',
          emoji: '🚀',
          fromUserId: userId,
          fromUserName: userName,
          postSlug: reel.slug,
          postTitle: reel.title,
          read: false,
          createdAt: new Date().toISOString(),
        })
      }
    } else if (!rocketed && has) {
      newRockets = rockets.filter((id: string) => id !== userId)
    } else {
      newRockets = rockets
    }

    const newCount = newRockets.length
    await db.collection('reels').updateOne(filter, { $set: { rockets: newRockets, rocketCount: newCount } })

    // Reactions koleksiyonu için de log - activity için
    if (rocketed && !has) {
      await db.collection('reactions').insertOne({
        userId,
        targetType: 'reel',
        targetId: reel.id || String(reel._id),
        emoji: '🚀',
        createdAt: new Date().toISOString(),
      })
    }

    return NextResponse.json({ ok: true, rocketCount: newCount, rocketed: newRockets.includes(userId) })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id || null
    const db = await getDb()
    let reel: any = null
    try { reel = await db.collection('reels').findOne({ _id: new ObjectId(params.id) }) } catch {}
    if (!reel) reel = await db.collection('reels').findOne({ id: params.id })
    if (!reel) return NextResponse.json({ rocketed: false, count: 0 })
    const rockets = reel.rockets || []
    return NextResponse.json({
      rocketed: userId ? rockets.includes(userId) : false,
      count: rockets.length,
    })
  } catch {
    return NextResponse.json({ rocketed: false, count: 0 })
  }
}
