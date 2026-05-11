import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const targetId = searchParams.get('targetId')
    if (!targetId) return NextResponse.json({ following: false })
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ following: false })
    const userId = (session.user as any).id
    const db = await getDb()
    const f = await db.collection('follows').findOne({ followerId: userId, targetId })
    const followerCount = await db.collection('follows').countDocuments({ targetId })
    return NextResponse.json({ following: !!f, followerCount })
  } catch (err: any) {
    return NextResponse.json({ error: err.message, following: false }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })
    const userId = (session.user as any).id
    const userName = (session.user as any).name
    const { targetId } = await req.json()
    if (!targetId) return NextResponse.json({ error: 'targetId gerekli' }, { status: 400 })
    if (targetId === userId) return NextResponse.json({ error: 'Kendini takip edemezsin' }, { status: 400 })

    const db = await getDb()
    const existing = await db.collection('follows').findOne({ followerId: userId, targetId })

    if (existing) {
      await db.collection('follows').deleteOne({ _id: existing._id })
      const followerCount = await db.collection('follows').countDocuments({ targetId })
      return NextResponse.json({ following: false, followerCount })
    } else {
      await db.collection('follows').insertOne({ followerId: userId, followerName: userName, targetId, createdAt: new Date().toISOString() })
      // Bildirim
      await db.collection('notifications').insertOne({
        userId: targetId, type: 'follow',
        fromUserId: userId, fromUserName: userName,
        read: false, createdAt: new Date().toISOString(),
      })
      const followerCount = await db.collection('follows').countDocuments({ targetId })
      return NextResponse.json({ following: true, followerCount })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
