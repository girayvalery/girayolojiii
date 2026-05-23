import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function POST(req: Request) {
  try {
    const adminCookie = req.headers.get('cookie')?.includes('admin_auth=true')
    if (!adminCookie) return NextResponse.json({ error: 'Sadece admin' }, { status: 403 })

    const db = await getDb()
    const users = await db.collection('users').find({}).toArray()
    const userMap: Record<string, any> = {}
    for (const u of users) {
      userMap[u.id] = {
        id: u.id, name: u.name, username: u.username,
        avatar: u.avatar, avatarColor: u.avatarColor,
        avatarConfig: u.avatarConfig || null,
        photoUrl: u.photoUrl || '',
      }
    }

    // Hikayelerdeki user'ı güncelle
    const stories = await db.collection('stories').find({}).toArray()
    let storiesFixed = 0
    for (const s of stories) {
      if (userMap[s.userId]) {
        await db.collection('stories').updateOne({ _id: s._id }, { $set: { user: userMap[s.userId] } })
        storiesFixed++
      }
    }

    // Postlardaki author'ı güncelle
    const posts = await db.collection('posts').find({}).toArray()
    let postsFixed = 0
    for (const p of posts) {
      const aid = p.author?.id
      if (aid && userMap[aid]) {
        await db.collection('posts').updateOne({ _id: p._id }, { $set: { author: userMap[aid] } })
        postsFixed++
      }
    }

    // Reels'lardaki author'ı güncelle
    const reels = await db.collection('reels').find({}).toArray()
    let reelsFixed = 0
    for (const r of reels) {
      const aid = r.author?.id
      if (aid && userMap[aid]) {
        await db.collection('reels').updateOne({ _id: r._id }, { $set: { author: userMap[aid] } })
        reelsFixed++
      }
    }

    return NextResponse.json({ ok: true, storiesFixed, postsFixed, reelsFixed })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
