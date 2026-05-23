import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await getDb()
    let reel: any = null
    try { reel = await db.collection('reels').findOne({ _id: new ObjectId(params.id) }) } catch {}
    if (!reel) reel = await db.collection('reels').findOne({ id: params.id })
    if (!reel) return NextResponse.json({ ok: false })
    const filter = reel._id ? { _id: reel._id } : { id: reel.id }

    // Hem $inc hem default değer ekle
    await db.collection('reels').updateOne(
      filter,
      { $inc: { views: 1 } },
      { upsert: false }
    )

    return NextResponse.json({ ok: true, views: (reel.views || 0) + 1 })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message })
  }
}
