import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })
    const user = session.user as any
    const { storyId } = await req.json()
    if (!storyId) return NextResponse.json({ error: 'storyId gerekli' }, { status: 400 })
    const db = await getDb()
    const existing = await db.collection('story_views').findOne({ storyId, userId: user.id })
    if (!existing) {
      await db.collection('story_views').insertOne({
        storyId, userId: user.id,
        userName: user.name, userUsername: user.username,
        userAvatar: user.avatar, userAvatarColor: user.avatarColor,
        userAvatarConfig: user.avatarConfig, userPhotoUrl: user.photoUrl,
        createdAt: new Date().toISOString(),
      })
    }
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const storyId = searchParams.get('storyId')
    if (!storyId) return NextResponse.json({ viewers: [] })
    const db = await getDb()
    const views = await db.collection('story_views').find({ storyId }).sort({ createdAt: -1 }).toArray()
    const reactions = await db.collection('story_reactions').find({ storyId }).toArray()
    const reactionMap: Record<string, string> = {}
    reactions.forEach((r: any) => { reactionMap[r.userId] = r.emoji })
    const viewers = views.map((v: any) => ({ ...v, reaction: reactionMap[v.userId] || null }))
    return NextResponse.json({ viewers })
  } catch (err: any) {
    return NextResponse.json({ viewers: [], error: err.message }, { status: 500 })
  }
}
