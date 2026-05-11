import Link from 'next/link'
import { getAllVideos, type Video } from '@/lib/data'
import { getDb } from '@/lib/mongodb'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function fetchVideos(): Promise<Video[]> {
  try {
    const db = await getDb()
    const docs = await db.collection('videos').find({}).sort({ publishedAt: -1 }).toArray()
    if (docs.length > 0) {
      return docs.map((d: any) => ({
        id: d.id || d._id?.toString() || '',
        slug: d.slug, title: d.title, description: d.description || '',
        duration: d.duration || '0:00', category: d.category || 'Bilim',
        isShort: !!d.isShort, emoji: d.emoji || '🎬',
        bgGradient: d.bgGradient || 'from-gray-800 to-gray-900',
        views: d.views || 0, publishedAt: d.publishedAt || new Date().toISOString(),
        youtubeId: d.youtubeId,
        author: d.author || { id: 'u1', name: 'Giray', avatar: '🧑‍🚀', avatarColor: '#1D9E75' },
      }))
    }
  } catch {}
  return getAllVideos()
}

export default async function VideolarPage() {
  const videos = await fetchVideos()
  const longVideos = videos.filter(v => !v.isShort)
  const shorts = videos.filter(v => v.isShort)

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-3" style={{ color: 'var(--text)' }}>🎬 Videolar</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{videos.length} video</p>
      </div>

      {longVideos.length > 0 && (
        <section className="mb-12">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Uzun Videolar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {longVideos.map(v => (
              <Link key={v.id} href={`/videolar/${v.slug}`} className="group">
                <div className="rounded-2xl overflow-hidden card-lift" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="relative">
                    {v.youtubeId ? (
                      <img src={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`} alt={v.title} className="w-full h-44 object-cover" />
                    ) : (
                      <div className={`h-44 flex items-center justify-center text-5xl bg-gradient-to-br ${v.bgGradient}`}>{v.emoji}</div>
                    )}
                    <span className="absolute bottom-2 right-2 text-xs text-white px-2 py-0.5 rounded-md" style={{ background: 'rgba(0,0,0,0.8)' }}>{v.duration}</span>
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(29,158,117,0.15)', color: '#1D9E75' }}>{v.category}</span>
                    <h3 className="font-semibold mt-2 line-clamp-2 group-hover:text-green-500" style={{ color: 'var(--text)' }}>{v.title}</h3>
                    <p className="text-xs mt-2 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{v.description}</p>
                    <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>👁 {v.views.toLocaleString('tr-TR')} izlenme</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {shorts.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>⚡ Kısa Videolar</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {shorts.map(v => (
              <Link key={v.id} href={`/videolar/${v.slug}`} className="group">
                <div className="rounded-xl overflow-hidden card-lift" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className={`relative h-56 flex items-center justify-center text-5xl bg-gradient-to-b ${v.bgGradient}`}>
                    {v.emoji}
                  </div>
                  <div className="p-3">
                    <h3 className="text-xs font-semibold line-clamp-2 group-hover:text-green-500" style={{ color: 'var(--text)' }}>{v.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {videos.length === 0 && (
        <div className="text-center py-20 rounded-2xl" style={{ background: 'var(--bg-card)' }}>
          <div className="text-6xl mb-3">🎬</div>
          <p className="font-semibold" style={{ color: 'var(--text)' }}>Henüz video yok</p>
        </div>
      )}
    </div>
  )
}
