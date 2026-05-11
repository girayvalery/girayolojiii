import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { USERS, POSTS, VIDEOS, REELS, STORIES, COMMENTS } from '@/lib/data'

export async function POST() {
  try {
    const db = await getDb()
    await db.collection('users').deleteMany({})
    await db.collection('posts').deleteMany({})
    await db.collection('videos').deleteMany({})
    await db.collection('reels').deleteMany({})
    await db.collection('stories').deleteMany({})
    await db.collection('comments').deleteMany({})

    if (USERS.length) await db.collection('users').insertMany(USERS as any[])
    if (POSTS.length) await db.collection('posts').insertMany(POSTS as any[])
    if (VIDEOS.length) await db.collection('videos').insertMany(VIDEOS as any[])
    if (REELS.length) await db.collection('reels').insertMany(REELS as any[])
    if (STORIES.length) await db.collection('stories').insertMany(STORIES as any[])
    if (COMMENTS.length) await db.collection('comments').insertMany(COMMENTS as any[])

    return NextResponse.json({
      message: 'Seed başarılı!',
      counts: {
        users: USERS.length, posts: POSTS.length, videos: VIDEOS.length,
        reels: REELS.length, stories: STORIES.length, comments: COMMENTS.length,
      }
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ info: 'POST ile seed çalıştır' })
}
