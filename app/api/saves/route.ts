import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ saves: [], saved: false })
    const userId = (session.user as any).id
    const { searchParams } = new URL(req.url)
    const postId = searchParams.get('postId')

    const db = await getDb()
    if (postId) {
      const found = await db.collection('saves').findOne({ userId, postId })
      return NextResponse.json({ saved: !!found })
    }
    const saves = await db.collection('saves').find({ userId }).sort({ createdAt: -1 }).toArray()
    return NextResponse.json({ saves })
  } catch (err: any) {
    return NextResponse.json({ saves: [], error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })
    const userId = (session.user as any).id
    const { postId, postTitle, postSlug, coverEmoji } = await req.json()
    if (!postId) return NextResponse.json({ error: 'postId gerekli' }, { status: 400 })

    const db = await getDb()
    const existing = await db.collection('saves').findOne({ userId, postId })
    if (existing) {
      await db.collection('saves').deleteOne({ _id: existing._id })
      return NextResponse.json({ saved: false })
    } else {
      await db.collection('saves').insertOne({
        userId, postId, postTitle, postSlug, coverEmoji,
        createdAt: new Date().toISOString(),
      })
      return NextResponse.json({ saved: true })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
