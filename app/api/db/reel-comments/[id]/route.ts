import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })
    const user = session.user as any
    const db = await getDb()
    const c = await db.collection('reel_comments').findOne({ id: params.id })
    if (!c) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
    if (c.author?.id !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
    }
    await db.collection('reel_comments').deleteOne({ id: params.id })
    await db.collection('reel_comments').deleteMany({ parentId: params.id })
    return NextResponse.json({ deleted: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
