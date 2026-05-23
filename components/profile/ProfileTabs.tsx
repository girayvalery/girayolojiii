'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { timeAgo } from '@/lib/utils'

type Props = { posts: any[]; userId?: string }

export default function ProfileTabs({ posts, userId }: Props) {
  const [tab, setTab] = useState<'posts' | 'reels'>('posts')
  const [reels, setReels] = useState<any[]>([])

  useEffect(() => {
    if (!userId) return
    fetch('/api/db/reels', { cache: 'no-store' })
      .then(r => r.json())
      .then((d: any) => {
        if (Array.isArray(d)) {
          setReels(d.filter((r: any) => r.author?.id === userId))
        }
      })
      .catch(() => {})
  }, [userId])

  return (
    <div className="rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="flex gap-1 p-2 border-b" style={{ borderColor: 'var(--border)' }}>
        <button onClick={() => setTab('posts')}
          className="flex-1 py-2 rounded-xl text-sm font-medium"
          style={{
            background: tab === 'posts' ? '#1D9E75' : 'transparent',
            color: tab === 'posts' ? '#fff' : 'var(--text-muted)',
          }}>📝 Yazılar ({posts.length})</button>
        <button onClick={() => setTab('reels')}
          className="flex-1 py-2 rounded-xl text-sm font-medium"
          style={{
            background: tab === 'reels' ? '#1D9E75' : 'transparent',
            color: tab === 'reels' ? '#fff' : 'var(--text-muted)',
          }}>⚡ Kısa Videolar ({reels.length})</button>
      </div>

      <div className="p-4">
        {tab === 'posts' && (
          posts.length === 0 ? (
            <p className="text-center py-10 text-sm" style={{ color: 'var(--text-muted)' }}>Henüz yazı yok</p>
          ) : (
            <div className="space-y-3">
              {posts.map((p: any) => (
                <Link key={p.id} href={`/blog/${p.slug}`}
                  className="flex gap-3 p-3 rounded-xl hover:scale-[1.01] transition-all"
                  style={{ background: 'var(--bg-subtle)' }}>
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl shrink-0"
                    style={{ background: 'var(--bg-card)' }}>
                    {p.coverImage ? (
                      <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <span>{p.coverEmoji || '📝'}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold line-clamp-2" style={{ color: 'var(--text)' }}>{p.title}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{timeAgo(p.publishedAt)} · 👁 {p.viewCount || 0} · ❤️ {p.likeCount || 0}</p>
                  </div>
                </Link>
              ))}
            </div>
          )
        )}

        {tab === 'reels' && (
          reels.length === 0 ? (
            <p className="text-center py-10 text-sm" style={{ color: 'var(--text-muted)' }}>Henüz kısa video yok</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {reels.map((r: any) => (
                <Link key={r.id} href={`/reels/${r.slug || r.id}`}
                  className="rounded-lg overflow-hidden hover:scale-[1.02] transition-all"
                  style={{ background: 'var(--bg-subtle)' }}>
                  <div className="relative bg-black" style={{ aspectRatio: '9/16' }}>
                    {r.thumbnail ? (
                      <img src={r.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    ) : r.mediaUrl ? (
                      <video src={r.mediaUrl} className="absolute inset-0 w-full h-full object-cover" muted playsInline preload="metadata" />
                    ) : (
                      <div className={`absolute inset-0 flex items-center justify-center text-4xl bg-gradient-to-b ${r.bgGradient || 'from-purple-900 to-purple-700'}`}>
                        {r.emoji || '⚡'}
                      </div>
                    )}
                    <div className="absolute bottom-1 left-1 right-1 text-[10px] text-white drop-shadow line-clamp-2 leading-tight">{r.title}</div>
                  </div>
                </Link>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
