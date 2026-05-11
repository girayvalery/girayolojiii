import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    if (!userId) return NextResponse.json({ days: [] })

    const db = await getDb()

    // Son 365 gün
    const since = new Date()
    since.setDate(since.getDate() - 365)

    // Tüm aktiviteler (yorum, tepki, post, takip)
    const [comments, reactions, posts, follows, reads] = await Promise.all([
      db.collection('comments').find({ 'author.id': userId, createdAt: { $gte: since.toISOString() } }).toArray(),
      db.collection('reactions').find({ userId, createdAt: { $gte: since.toISOString() } }).toArray(),
      db.collection('posts').find({ 'author.id': userId, publishedAt: { $gte: since.toISOString() } }).toArray(),
      db.collection('follows').find({ followerId: userId, createdAt: { $gte: since.toISOString() } }).toArray(),
      db.collection('reads').find({ userId, createdAt: { $gte: since.toISOString() } }).toArray(),
    ])

    // Günlere göre grupla
    const dayMap: Record<string, number> = {}
    function bump(dateStr: string) {
      const d = new Date(dateStr).toISOString().slice(0, 10)
      dayMap[d] = (dayMap[d] || 0) + 1
    }
    comments.forEach((c: any) => bump(c.createdAt))
    reactions.forEach((r: any) => bump(r.createdAt))
    posts.forEach((p: any) => bump(p.publishedAt))
    follows.forEach((f: any) => bump(f.createdAt))
    reads.forEach((r: any) => bump(r.createdAt))

    // 365 günlük diziye dönüştür
    const days = []
    for (let i = 0; i < 365; i++) {
      const d = new Date()
      d.setDate(d.getDate() - (364 - i))
      const key = d.toISOString().slice(0, 10)
      const count = dayMap[key] || 0
      const intensity = count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 10 ? 3 : 4
      days.push({ date: key, count, intensity })
    }

    return NextResponse.json({ days })
  } catch (err: any) {
    return NextResponse.json({ days: [], error: err.message }, { status: 500 })
  }
}
