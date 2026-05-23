import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })
    const userId = (session.user as any).id
    const db = await getDb()
    const c = await db.collection('reel_comments').findOne({ id: params.id })
    if (!c) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
    const likes = c.likes || []
    const hasLiked = likes.includes(userId)
    const newLikes = hasLiked ? likes.filter((id: string) => id !== userId) : [...likes, userId]
    await db.collection('reel_comments').updateOne({ id: params.id }, { $set: { likes: newLikes } })
    return NextResponse.json({ likes: newLikes })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
