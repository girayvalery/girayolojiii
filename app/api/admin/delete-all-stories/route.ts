import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function POST(req: Request) {
  try {
    const adminCookie = req.headers.get('cookie')?.includes('admin_auth=true')
    if (!adminCookie) return NextResponse.json({ error: 'Sadece admin' }, { status: 403 })

    const db = await getDb()
    const r = await db.collection('stories').deleteMany({})
    return NextResponse.json({ ok: true, deleted: r.deletedCount })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
