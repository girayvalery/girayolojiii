import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getDb()

    // Paralel olarak 3 koleksiyondan çek
    const [posts, reels, stories] = await Promise.all([
      db.collection('posts').find({ status: 'PUBLISHED' }).sort({ publishedAt: -1 }).limit(50).toArray(),
      db.collection('reels').find({}).sort({ publishedAt: -1 }).limit(30).toArray(),
      db.collection('stories').find({
        createdAt: { $gte: new Date(Date.now() - 24*60*60*1000).toISOString() }
      }).sort({ createdAt: -1 }).limit(50).toArray()
    ])

    return NextResponse.json({ posts, reels, stories }, {
      headers: {
        // 30 saniye edge cache - kısa süre ama hızlandırır
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      }
    })
  } catch (err: any) {
    return NextResponse.json({ posts: [], reels: [], stories: [], error: err.message }, { status: 500 })
  }
}
