import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    if (!userId) return NextResponse.json({ days: [] })

    const db = await getDb()
    const since = new Date()
    since.setDate(since.getDate() - 365)
    const sinceISO = since.toISOString()

    // Tüm aktiviteleri topla - hangileri varsa onları kullan
    const queries = await Promise.all([
      db.collection('comments').find({ 'author.id': userId, createdAt: { $gte: sinceISO } }).toArray().catch(() => []),
      db.collection('reactions').find({ userId, createdAt: { $gte: sinceISO } }).toArray().catch(() => []),
      db.collection('posts').find({ 'author.id': userId, publishedAt: { $gte: sinceISO } }).toArray().catch(() => []),
      db.collection('follows').find({ followerId: userId, createdAt: { $gte: sinceISO } }).toArray().catch(() => []),
      db.collection('reels').find({ 'author.id': userId, publishedAt: { $gte: sinceISO } }).toArray().catch(() => []),
      db.collection('stories').find({ userId, createdAt: { $gte: sinceISO } }).toArray().catch(() => []),
      db.collection('reel_comments').find({ 'author.id': userId, createdAt: { $gte: sinceISO } }).toArray().catch(() => []),
    ])

    const [comments, reactions, posts, follows, reels, stories, reelComments] = queries

    const dayMap: Record<string, number> = {}
    function bump(dateStr: string | undefined) {
      if (!dateStr) return
      const d = new Date(dateStr).toISOString().slice(0, 10)
      dayMap[d] = (dayMap[d] || 0) + 1
    }

    comments.forEach((c: any) => bump(c.createdAt))
    reactions.forEach((r: any) => bump(r.createdAt))
    posts.forEach((p: any) => bump(p.publishedAt))
    follows.forEach((f: any) => bump(f.createdAt))
    reels.forEach((r: any) => bump(r.publishedAt))
    stories.forEach((s: any) => bump(s.createdAt))
    reelComments.forEach((c: any) => bump(c.createdAt))

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
