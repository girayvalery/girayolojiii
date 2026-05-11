import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })
    const userId = (session.user as any).id
    const { action } = await req.json()
    const db = await getDb()
    const comment = await db.collection('comments').findOne({ id: params.id })
    if (!comment) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

    if (action === 'like') {
      const likedBy = comment.likedBy || []
      const hasLiked = likedBy.includes(userId)
      if (hasLiked) {
        await db.collection('comments').updateOne(
          { id: params.id },
          { $pull: { likedBy: userId }, $inc: { likes: -1 } }
        )
        return NextResponse.json({ liked: false, likes: (comment.likes || 1) - 1 })
      } else {
        await db.collection('comments').updateOne(
          { id: params.id },
          { $addToSet: { likedBy: userId }, $inc: { likes: 1 } }
        )
        return NextResponse.json({ liked: true, likes: (comment.likes || 0) + 1 })
      }
    }

    if (action === 'delete') {
      // Sadece sahibi silebilir
      if (comment.author?.id !== userId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
      await db.collection('comments').deleteOne({ id: params.id })
      return NextResponse.json({ deleted: true })
    }

    return NextResponse.json({ error: 'Geçersiz aksiyon' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })
    const userId = (session.user as any).id
    const db = await getDb()
    const comment = await db.collection('comments').findOne({ id: params.id })
    if (!comment) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
    if (comment.author?.id !== userId) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
    await db.collection('comments').deleteOne({ id: params.id })
    return NextResponse.json({ deleted: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
