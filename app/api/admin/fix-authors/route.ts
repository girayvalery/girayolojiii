import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function POST(req: Request) {
  try {
    const adminCookie = req.headers.get('cookie')?.includes('admin_auth=true')
    if (!adminCookie) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

    const db = await getDb()
    const posts = await db.collection('posts').find({}).toArray()
    let postsFixed = 0

    for (const post of posts) {
      if (!post.author?.id) continue
      const u = await db.collection('users').findOne({ id: post.author.id })
      if (!u) continue
      const newAuthor = {
        id: u.id, name: u.name, username: u.username,
        avatar: u.avatar || '🧑', avatarColor: u.avatarColor || '#1D9E75',
        avatarConfig: u.avatarConfig || null, photoUrl: u.photoUrl || null,
      }
      await db.collection('posts').updateOne({ _id: post._id }, { $set: { author: newAuthor } })
      postsFixed++
    }

    const stories = await db.collection('stories').find({}).toArray()
    let storiesFixed = 0
    for (const s of stories) {
      if (!s.userId) continue
      const u = await db.collection('users').findOne({ id: s.userId })
      if (!u) continue
      const newUser = {
        id: u.id, name: u.name, username: u.username,
        avatar: u.avatar || '🧑', avatarColor: u.avatarColor || '#1D9E75',
        avatarConfig: u.avatarConfig || null, photoUrl: u.photoUrl || null,
      }
      await db.collection('stories').updateOne({ _id: s._id }, { $set: { user: newUser } })
      storiesFixed++
    }

    return NextResponse.json({ ok: true, postsFixed, storiesFixed })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}