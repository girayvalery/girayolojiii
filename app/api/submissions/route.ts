import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'

const submissionSchema = z.object({
  type: z.enum(['post', 'story', 'reel', 'video']).default('post'),
  title: z.string().optional(),
  content: z.string().optional(),
  category: z.string().optional(),
  mediaUrl: z.string().optional(),
  mediaType: z.string().optional(),
  thumbnail: z.string().optional(),
  youtubeId: z.string().optional(),
  emoji: z.string().optional(),
  excerpt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  relatedReelId: z.string().nullable().optional(),
  userId: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })
    const user = session.user as any

    const body = await req.json()
    const result = submissionSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || 'Geçersiz veri' }, { status: 400 })
    }

    const type = result.data.type

    // Tip bazlı zorunlu alan kontrolü
    if (type === 'post') {
      if (!result.data.title || result.data.title.length < 3) {
        return NextResponse.json({ error: 'Blog başlığı en az 3 karakter olmalı' }, { status: 400 })
      }
      if (!result.data.content || result.data.content.length < 10) {
        return NextResponse.json({ error: 'İçerik en az 10 karakter olmalı' }, { status: 400 })
      }
    }
    if (type === 'reel') {
      if (!result.data.title || result.data.title.length < 3) {
        return NextResponse.json({ error: 'Kısa video başlığı en az 3 karakter olmalı' }, { status: 400 })
      }
      if (!result.data.mediaUrl) {
        return NextResponse.json({ error: 'Video gerekli' }, { status: 400 })
      }
    }
    if (type === 'story') {
      if (!result.data.mediaUrl) {
        return NextResponse.json({ error: 'Görsel veya video gerekli' }, { status: 400 })
      }
    }

    const db = await getDb()
    const submission = {
      ...result.data,
      userId: user.id,
      userName: user.name,
      userUsername: user.username,
      userAvatar: user.avatar,
      userAvatarColor: user.avatarColor,
      userAvatarConfig: user.avatarConfig,
      userPhotoUrl: user.photoUrl,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    }
    const r = await db.collection('submissions').insertOne(submission)
    return NextResponse.json({ ok: true, id: r.insertedId })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const db = await getDb()
    const docs = await db.collection('submissions').find({
      status: { $nin: ['PUBLISHED', 'REJECTED', 'APPROVED'] }
    }).sort({ createdAt: -1 }).toArray()
    return NextResponse.json(docs)
  } catch (err: any) {
    return NextResponse.json([], { status: 500 })
  }
}
