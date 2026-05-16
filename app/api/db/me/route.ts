import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'

// PROFIL GUNCELLE
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Giriş yapmalısın.' }, { status: 401 })

  const body = await req.json()
  const userId = (session.user as any).id

  try {
    const db = await getDb()
    const update: any = {}

    if (body.name !== undefined) update.name = body.name
    if (body.username !== undefined) {
      // username unique kontrolü
      const existing = await db.collection('users').findOne({ username: body.username, id: { $ne: userId } })
      if (existing) return NextResponse.json({ error: 'Bu kullanıcı adı zaten alınmış.' }, { status: 400 })
      update.username = body.username
    }
    if (body.bio !== undefined) update.bio = body.bio
    if (body.avatar !== undefined) update.avatar = body.avatar
    if (body.avatarColor !== undefined) update.avatarColor = body.avatarColor
    if (body.photoUrl !== undefined) update.photoUrl = body.photoUrl
    if (body.avatarConfig !== undefined) update.avatarConfig = body.avatarConfig

    await db.collection('users').updateOne({ id: userId }, { $set: update })

    return NextResponse.json({ message: 'Profil güncellendi.', updates: update })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// SIFRE DEGISTIR
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Giriş yapmalısın.' }, { status: 401 })

  const { currentPassword, newPassword } = await req.json()

  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return NextResponse.json({ error: 'Yeni şifre en az 8 karakter olmalı.' }, { status: 400 })
  }

  const userId = (session.user as any).id

  try {
    const db = await getDb()
    const user = await db.collection('users').findOne({ id: userId })
    if (!user || !user.password) return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 })

    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) return NextResponse.json({ error: 'Mevcut şifre hatalı.' }, { status: 400 })

    const hashed = await bcrypt.hash(newPassword, 12)
    await db.collection('users').updateOne({ id: userId }, { $set: { password: hashed } })

    return NextResponse.json({ message: 'Şifre güncellendi.' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PROFIL OKU
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Giriş yapmalısın.' }, { status: 401 })

  try {
    const db = await getDb()
    const user = await db.collection('users').findOne({ id: (session.user as any).id }, { projection: { password: 0 } })
    return NextResponse.json(user)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
