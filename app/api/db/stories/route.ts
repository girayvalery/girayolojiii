import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getDb()
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    // 24 saat geçen hikayeleri sil
    await db.collection('stories').deleteMany({ createdAt: { $lt: cutoff } })

    // Geri kalan aktif hikayeleri al, en yenilerden eskiye
    const docs = await db.collection('stories').find({}).sort({ createdAt: -1 }).limit(100).toArray()
    return NextResponse.json(docs)
  } catch (err: any) {
    return NextResponse.json([], { status: 500 })
  }
}
