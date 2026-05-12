import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'
import { calculateLevel, QUESTS, type UserStats } from '@/lib/levels'

async function getStats(db: any, userId: string) {
  const userPosts = await db.collection('posts').find({ 'author.id': userId, status: 'PUBLISHED' }).toArray()
  const totalViews = userPosts.reduce((s: number, p: any) => s + (p.viewCount || 0), 0)
  const postIds = userPosts.map((p: any) => p.id || p.slug)
  const commentsReceived = postIds.length > 0
    ? await db.collection('comments').countDocuments({ postId: { $in: postIds } })
    : 0
  const userExists = await db.collection('users').findOne({ id: userId })

  return {
    register: userExists ? 1 : 0,
    readPosts: await db.collection('reads').countDocuments({ userId }).catch(() => 0),
    reactions: await db.collection('reactions').countDocuments({ userId }),
    comments: await db.collection('comments').countDocuments({ 'author.id': userId }),
    following: await db.collection('follows').countDocuments({ followerId: userId }),
    posts: userPosts.length,
    followers: await db.collection('follows').countDocuments({ targetId: userId }),
    totalViews,
    commentsReceived,
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    if (!userId) return NextResponse.json({ level: 0, badges: [], stats: {}, quests: QUESTS })

    const db = await getDb()
    const stats = await getStats(db, userId)
    const { level, current, next, progress } = calculateLevel(stats as UserStats)
    const completedQuests = QUESTS.filter(q => q.level <= level)

    // Level up bildirimi - sadece kendi profili çağırıyorsa
    const session = await getServerSession(authOptions)
    if (session?.user && (session.user as any).id === userId) {
      const user = await db.collection('users').findOne({ id: userId })
      const lastNotifiedLevel = user?.lastLevelNotified || 0
      if (level > lastNotifiedLevel) {
        await db.collection('users').updateOne({ id: userId }, { $set: { lastLevelNotified: level } })
        // Yeni level bildirimi oluştur
        if (current && level > 0) {
          await db.collection('notifications').insertOne({
            userId, type: 'levelUp',
            level, questTitle: current.title, questIcon: current.icon,
            read: false, createdAt: new Date().toISOString(),
          })
        }
      }
    }

    return NextResponse.json({ level, current, next, progress, stats, completedQuests, allQuests: QUESTS })
  } catch (err: any) {
    return NextResponse.json({ level: 0, error: err.message }, { status: 500 })
  }
}
