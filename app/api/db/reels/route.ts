import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getDb()
    const docs = await db.collection('reels').find({}).sort({ publishedAt: -1 }).toArray()
    return NextResponse.json(docs)
  } catch (err: any) {
    return NextResponse.json([], { status: 500 })
  }
}
