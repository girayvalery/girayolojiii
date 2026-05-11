import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getVideoBySlug, getAllVideos } from '@/lib/data'
import { formatNum, formatDate } from '@/lib/utils'
import YouTubeEmbed from '@/components/video/YouTubeEmbed'

export function generateStaticParams() {
  return getAllVideos().map(v => ({ slug: v.slug }))
}

export default function VideoDetailPage({ params }: { params: { slug: string } }) {
  const video = getVideoBySlug(params.slug)
  if (!video) notFound()

  const related = getAllVideos().filter(v => v.id !== video.id).slice(0, 4)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <nav className="flex items-center gap-2 text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            <Link href="/">Ana Sayfa</Link><span>/</span>
            <Link href="/videolar">Videolar</Link><span>/</span>
            <span className="truncate" style={{ color: 'var(--text)' }}>{video.title}</span>
          </nav>

          {video.youtubeId ? (
            <YouTubeEmbed videoId={video.youtubeId} title={video.title} />
          ) : (
            <div className={`w-full h-96 rounded-2xl flex items-center justify-center text-9xl bg-gradient-to-br ${video.bgGradient}`}>
              {video.emoji}
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ background: 'rgba(83,74,183,0.15)', color: '#7F77DD' }}>{video.category}</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{video.duration}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold mt-3 mb-4" style={{ color: 'var(--text)' }}>{video.title}</h1>

          <div className="flex items-center gap-3 mb-6 pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
            <Link href={`/profile/${video.author.id}`}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ background: `${video.author.avatarColor}22` }}>{video.author.avatar}</div>
            </Link>
            <div>
              <Link href={`/profile/${video.author.id}`}>
                <p className="font-semibold text-sm hover:text-green-500" style={{ color: 'var(--text)' }}>{video.author.name}</p>
              </Link>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatNum(video.views)} izlenme · {formatDate(video.publishedAt)}</p>
            </div>
          </div>

          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>{video.description}</p>
        </div>

        <aside>
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>İlgili Videolar</h3>
          <div className="space-y-3">
            {related.map(r => (
              <Link key={r.id} href={`/videolar/${r.slug}`}>
                <div className="flex gap-3 p-2 rounded-lg group cursor-pointer" style={{ background: 'var(--bg-subtle)' }}>
                  <div className={`w-24 h-16 rounded-lg flex items-center justify-center text-2xl shrink-0 bg-gradient-to-br ${r.bgGradient}`}>{r.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium line-clamp-2 group-hover:text-green-500" style={{ color: 'var(--text)' }}>{r.title}</p>
                    <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{r.duration} · {formatNum(r.views)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
