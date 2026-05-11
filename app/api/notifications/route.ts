import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'

// GET -> kullanıcının bildirimleri
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ items: [], unread: 0 })
    const userId = (session.user as any).id
    const db = await getDb()
    const items = await db.collection('notifications').find({ userId }).sort({ createdAt: -1 }).limit(50).toArray()
    const unread = items.filter((n: any) => !n.read).length
    return NextResponse.json({ items, unread })
  } catch (err: any) {
    return NextResponse.json({ error: err.message, items: [], unread: 0 }, { status: 500 })
  }
}

// PATCH -> tümünü okundu işaretle
export async function PATCH() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })
    const userId = (session.user as any).id
    const db = await getDb()
    await db.collection('notifications').updateMany({ userId, read: false }, { $set: { read: true } })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
