import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ ok: false })
    const userId = (session.user as any).id
    const { postId } = await req.json()
    if (!postId) return NextResponse.json({ ok: false })

    const db = await getDb()
    // Aynı kullanıcı aynı yazıyı tekrar okursa sayma
    const existing = await db.collection('reads').findOne({ userId, postId })
    if (!existing) {
      await db.collection('reads').insertOne({ userId, postId, createdAt: new Date().toISOString() })
      // Post view count artır
      await db.collection('posts').updateOne(
        { $or: [{ id: postId }, { slug: postId }] },
        { $inc: { viewCount: 1 } }
      )
    }
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message })
  }
}
