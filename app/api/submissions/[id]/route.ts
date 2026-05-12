import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { action, adminNote } = await req.json()
  if (!['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Geçersiz işlem.' }, { status: 400 })
  }
  try {
    const db = await getDb()
    const status = action === 'approve' ? 'PUBLISHED' : 'REJECTED'
    let result = await db.collection('submissions').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { status, adminNote } }
    )
    if (result.matchedCount === 0) {
      result = await db.collection('submissions').updateOne({ id: params.id }, { $set: { status, adminNote } })
    }
    return NextResponse.json({ message: action === 'approve' ? 'Onaylandı.' : 'Reddedildi.' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
