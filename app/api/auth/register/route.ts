import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { getDb } from '@/lib/mongodb'

const schema = z.object({
  name: z.string().min(2, 'Ad en az 2 karakter olmalı'),
  username: z.string().min(3, 'Kullanıcı adı en az 3 karakter olmalı').regex(/^[a-z0-9_]+$/, 'Sadece küçük harf, rakam ve _ kullan'),
  email: z.string().email('Geçersiz e-posta'),
  password: z.string().min(8, 'Şifre en az 8 karakter olmalı'),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = schema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 })
    }
    const { name, username, email, password } = result.data
    const db = await getDb()

    const existingEmail = await db.collection('users').findOne({ email })
    if (existingEmail) return NextResponse.json({ error: 'Bu e-posta zaten kayıtlı.' }, { status: 400 })

    const existingUsername = await db.collection('users').findOne({ username })
    if (existingUsername) return NextResponse.json({ error: 'Bu kullanıcı adı zaten alınmış.' }, { status: 400 })

    const hashed = await bcrypt.hash(password, 12)
    const adminEmail = process.env.ADMIN_EMAIL || 'giray@girayoloji.com'
    const userId = `u_${Date.now()}`

    await db.collection('users').insertOne({
      id: userId,
      name, username, email, password: hashed,
      avatar: '🧑‍🚀', avatarColor: '#1D9E75', bio: '',
      avatarConfig: {
        gender: 'male',
        skin: '#F5C9A1',
        hair: 'short',
        hairColor: '#3D2914',
        eyes: 'normal',
        eyebrows: 'normal',
        mouth: 'smile',
        facial: 'none',
        accessory: 'none',
        bg: '#1D9E75',
        lipColor: '#C16060',
      },
      role: email === adminEmail ? 'ADMIN' : 'UYE',
      postCount: 0, followerCount: 0,
      joinedAt: new Date().toISOString(),
    })

    return NextResponse.json({ message: 'Kayıt başarılı.', userId }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Sunucu hatası.' }, { status: 500 })
  }
}
