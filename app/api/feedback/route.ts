import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function POST(req: Request) {
  try {
    const { type, subject, message, email } = await req.json()
    if (!subject || !message) return NextResponse.json({ error: 'Konu ve mesaj gerekli' }, { status: 400 })
    const db = await getDb()
    await db.collection('feedback').insertOne({
      type, subject, message, email,
      createdAt: new Date().toISOString(),
      read: false,
    })
    return NextResponse.json({ message: 'Alındı' }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const db = await getDb()
    const items = await db.collection('feedback').find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json(items)
  } catch (err: any) {
    return NextResponse.json([], { status: 500 })
  }
}
