import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const adminCookie = req.headers.get('cookie')?.includes('admin_auth=true')
    let canDelete = adminCookie
    let userId: string | null = null

    if (!adminCookie) {
      const session = await getServerSession(authOptions)
      if (!session?.user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })
      userId = (session.user as any).id
      if ((session.user as any).role === 'ADMIN') canDelete = true
    }

    const db = await getDb()
    let reel: any = null
    try { reel = await db.collection('reels').findOne({ _id: new ObjectId(params.id) }) }
    catch { reel = await db.collection('reels').findOne({ id: params.id }) }

    if (!reel) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
    if (!canDelete && reel.author?.id !== userId) {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
    }

    await db.collection('reels').deleteOne(reel._id ? { _id: reel._id } : { id: reel.id })
    return NextResponse.json({ deleted: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
