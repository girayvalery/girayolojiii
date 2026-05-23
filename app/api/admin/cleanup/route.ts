import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

// Bir kerelik: posts'tan akışa girmemesi gereken yazı/test'leri sil
// Kullanım: POST /api/admin/cleanup?confirm=YES_CLEAN
export async function POST(req: Request) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('confirm') !== 'YES_CLEAN') {
    return NextResponse.json({ error: 'confirm=YES_CLEAN gerekli' }, { status: 400 })
  }
  try {
    const db = await getDb()
    const body = await req.json().catch(() => ({}))
    const titles: string[] = body.titles || []
    if (titles.length === 0) return NextResponse.json({ error: 'titles dizisi gerekli' }, { status: 400 })

    const deleted = await db.collection('posts').deleteMany({ title: { $in: titles } })
    return NextResponse.json({ message: 'Silindi', deletedCount: deleted.deletedCount })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
