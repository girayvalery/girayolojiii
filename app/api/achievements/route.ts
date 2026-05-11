import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { calculateLevel, QUESTS, type UserStats } from '@/lib/levels'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    if (!userId) return NextResponse.json({ level: 0, badges: [], stats: {}, quests: QUESTS })

    const db = await getDb()

    const userPosts = await db.collection('posts').find({ 'author.id': userId, status: 'PUBLISHED' }).toArray()
    const totalViews = userPosts.reduce((s: number, p: any) => s + (p.viewCount || 0), 0)
    const postIds = userPosts.map((p: any) => p.id || p.slug)

    const commentsReceived = await db.collection('comments').countDocuments({ postId: { $in: postIds } })

    const stats: UserStats = {
      readPosts: await db.collection('reads').countDocuments({ userId }).catch(() => 0),
      reactions: await db.collection('reactions').countDocuments({ userId }),
      comments: await db.collection('comments').countDocuments({ 'author.id': userId }),
      following: await db.collection('follows').countDocuments({ followerId: userId }),
      posts: userPosts.length,
      followers: await db.collection('follows').countDocuments({ targetId: userId }),
      totalViews,
      commentsReceived,
    }

    const { level, current, next, progress } = calculateLevel(stats)

    // Kazanılmış görevler (level <= kullanıcı level)
    const completedQuests = QUESTS.filter(q => q.level <= level)

    return NextResponse.json({ level, current, next, progress, stats, completedQuests, allQuests: QUESTS })
  } catch (err: any) {
    return NextResponse.json({ level: 0, error: err.message }, { status: 500 })
  }
}
