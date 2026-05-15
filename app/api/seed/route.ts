import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { USERS, POSTS, VIDEOS, REELS, STORIES, COMMENTS } from '@/lib/data'

// Sadece BOŞSA seed et - mevcut verileri silme!
export async function POST() {
  try {
    const db = await getDb()

    const usersCount = await db.collection('users').countDocuments()
    const postsCount = await db.collection('posts').countDocuments()
    const videosCount = await db.collection('videos').countDocuments()
    const reelsCount = await db.collection('reels').countDocuments()
    const storiesCount = await db.collection('stories').countDocuments()

    let added: any = { users: 0, posts: 0, videos: 0, reels: 0, stories: 0 }

    if (usersCount === 0 && USERS.length) {
      await db.collection('users').insertMany(USERS as any[])
      added.users = USERS.length
    }
    if (postsCount === 0 && POSTS.length) {
      await db.collection('posts').insertMany(POSTS as any[])
      added.posts = POSTS.length
    }
    if (videosCount === 0 && VIDEOS.length) {
      await db.collection('videos').insertMany(VIDEOS as any[])
      added.videos = VIDEOS.length
    }
    if (reelsCount === 0 && REELS.length) {
      await db.collection('reels').insertMany(REELS as any[])
      added.reels = REELS.length
    }
    if (storiesCount === 0 && STORIES.length) {
      await db.collection('stories').insertMany(STORIES as any[])
      added.stories = STORIES.length
    }

    return NextResponse.json({
      message: 'Seed kontrolü tamamlandı!',
      existing: {
        users: usersCount, posts: postsCount, videos: videosCount,
        reels: reelsCount, stories: storiesCount,
      },
      added,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// Tüm verileri TEMİZLEMEK için ?reset=true&confirm=YES_DELETE_ALL
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('confirm') !== 'YES_DELETE_ALL') {
    return NextResponse.json({ error: 'confirm=YES_DELETE_ALL gerekli' }, { status: 400 })
  }
  try {
    const db = await getDb()
    await db.collection('users').deleteMany({})
    await db.collection('posts').deleteMany({})
    await db.collection('videos').deleteMany({})
    await db.collection('reels').deleteMany({})
    await db.collection('stories').deleteMany({})
    await db.collection('comments').deleteMany({})
    return NextResponse.json({ message: 'Tüm veriler silindi' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ info: 'POST ile eksikleri seedle, DELETE+confirm ile tümünü sil' })
}
