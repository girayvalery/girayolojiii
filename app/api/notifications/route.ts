import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

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

// Mark all read or specific
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })
    const userId = (session.user as any).id
    const db = await getDb()

    // body varsa specific id, yoksa tümü
    let body: any = null
    try { body = await req.json() } catch {}

    if (body?.id) {
      try {
        await db.collection('notifications').updateOne(
          { _id: new ObjectId(body.id), userId },
          { $set: { read: true } }
        )
      } catch {
        await db.collection('notifications').updateOne(
          { id: body.id, userId },
          { $set: { read: true } }
        )
      }
    } else {
      await db.collection('notifications').updateMany({ userId, read: false }, { $set: { read: true } })
    }
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
