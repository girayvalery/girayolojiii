import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type') || 'followers'  // 'followers' veya 'following'
    if (!userId) return NextResponse.json({ users: [] })

    const db = await getDb()
    let userIds: string[] = []

    if (type === 'followers') {
      const docs = await db.collection('follows').find({ targetId: userId }).toArray()
      userIds = docs.map((d: any) => d.followerId)
    } else {
      const docs = await db.collection('follows').find({ followerId: userId }).toArray()
      userIds = docs.map((d: any) => d.targetId)
    }

    if (userIds.length === 0) return NextResponse.json({ users: [] })

    const users = await db.collection('users').find({ id: { $in: userIds } }).toArray()
    return NextResponse.json({ users })
  } catch (err: any) {
    return NextResponse.json({ users: [], error: err.message }, { status: 500 })
  }
}
