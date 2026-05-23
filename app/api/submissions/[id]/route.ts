import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { action, note } = await req.json()
    const db = await getDb()

    let sub: any = null
    try {
      sub = await db.collection('submissions').findOne({ _id: new ObjectId(params.id) })
    } catch {
      sub = await db.collection('submissions').findOne({ id: params.id })
    }
    if (!sub) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

    if (action === 'approve') {
      const type = sub.type || 'post'
      const dbUser = sub.userId ? await db.collection('users').findOne({ id: sub.userId }) : null

      const author = {
        id: sub.userId || 'anon',
        name: dbUser?.name || sub.userName || 'Anonim',
        username: dbUser?.username || sub.userUsername || 'anon',
        avatar: dbUser?.avatar || sub.userAvatar || '👤',
        avatarColor: dbUser?.avatarColor || sub.userAvatarColor || '#1D9E75',
        avatarConfig: dbUser?.avatarConfig || sub.userAvatarConfig || null,
        photoUrl: dbUser?.photoUrl || sub.userPhotoUrl || '',
      }

      // HİKAYE → stories koleksiyonu
      if (type === 'story') {
        const story = {
          id: 's_' + Date.now(),
          userId: sub.userId,
          user: author,
          mediaUrl: sub.mediaUrl || null,
          mediaType: sub.mediaType || 'image', // 'image' veya 'video'
          createdAt: new Date().toISOString(),
        }
        await db.collection('stories').insertOne(story)
        if (sub.userId) {
          await db.collection('notifications').insertOne({
            userId: sub.userId, type: 'storyPublished',
            read: false, createdAt: new Date().toISOString(),
          })
        }
        try { await db.collection('submissions').deleteOne({ _id: new ObjectId(params.id) }) }
        catch { await db.collection('submissions').deleteOne({ id: params.id }) }
        return NextResponse.json({ message: 'Hikaye onaylandı', story })
      }

      // KISA VİDEO → reels
      if (type === 'reel') {
        const reel = {
          id: 'r_' + Date.now(),
          slug: 'reel-' + Date.now().toString(36),
          title: sub.title,
          emoji: sub.emoji || '⚡',
          bgGradient: 'from-purple-900 to-purple-700',
          mediaUrl: sub.mediaUrl || null,
          thumbnail: sub.thumbnail || null, // videodan alınan kare
          category: sub.category || 'Bilim',
          author,
          views: 0,
          likeCount: 0,
          rocketCount: 0,
          commentCount: 0,
          publishedAt: new Date().toISOString(),
        }
        await db.collection('reels').insertOne(reel)
        if (sub.userId) {
          await db.collection('notifications').insertOne({
            userId: sub.userId, type: 'reelPublished',
            postTitle: reel.title, postSlug: reel.slug,
            read: false, createdAt: new Date().toISOString(),
          })
        }
        try { await db.collection('submissions').deleteOne({ _id: new ObjectId(params.id) }) }
        catch { await db.collection('submissions').deleteOne({ id: params.id }) }
        return NextResponse.json({ message: 'Reel onaylandı', reel })
      }

      // YAZI → posts
      const slug = (sub.title || 'yazi').toLowerCase()
        .replace(/[ğ]/g, 'g').replace(/[ü]/g, 'u').replace(/[ş]/g, 's')
        .replace(/[ı]/g, 'i').replace(/[ö]/g, 'o').replace(/[ç]/g, 'c')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'yazi'

      const post = {
        id: 'p_' + Date.now(),
        slug: slug + '-' + Date.now().toString(36),
        title: sub.title,
        excerpt: sub.excerpt || (sub.content || '').slice(0, 150),
        content: sub.content || '',
        category: sub.category || 'Bilim',
        tags: sub.tags || [],
        readTime: Math.max(1, Math.round((sub.content || '').split(' ').length / 200)),
        coverEmoji: sub.emoji || sub.coverEmoji || '📝',
        bgGradient: 'from-gray-800 to-gray-900',
        coverImage: sub.mediaUrl || null,
        youtubeId: sub.youtubeId || null,
        relatedReelId: sub.relatedReelId || null,
        featured: false,
        status: 'PUBLISHED',
        viewCount: 0,
        likeCount: 0,
        rocketCount: 0,
        publishedAt: new Date().toISOString(),
        author,
      }
      await db.collection('posts').insertOne(post)
      if (sub.userId) {
        await db.collection('notifications').insertOne({
          userId: sub.userId, type: 'postPublished',
          postSlug: post.slug, postTitle: post.title,
          read: false, createdAt: new Date().toISOString(),
        })
      }
      try { await db.collection('submissions').deleteOne({ _id: new ObjectId(params.id) }) }
      catch { await db.collection('submissions').deleteOne({ id: params.id }) }
      return NextResponse.json({ message: 'Yazı onaylandı', post })
    }

    if (action === 'reject') {
      if (sub.userId) {
        await db.collection('notifications').insertOne({
          userId: sub.userId, type: 'postRejected',
          postTitle: sub.title, rejectNote: note || '',
          read: false, createdAt: new Date().toISOString(),
        })
      }
      try { await db.collection('submissions').deleteOne({ _id: new ObjectId(params.id) }) }
      catch { await db.collection('submissions').deleteOne({ id: params.id }) }
      return NextResponse.json({ message: 'Reddedildi', note })
    }

    return NextResponse.json({ error: 'Geçersiz aksiyon' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
