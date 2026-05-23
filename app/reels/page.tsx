'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import UserAvatar from '@/components/avatar/UserAvatar'

export default function ReelsPage() {
  const [reels, setReels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/db/reels', { cache: 'no-store' })
      .then(r => r.json())
      .then((d: any) => {
        if (Array.isArray(d)) setReels(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--text)' }}>⚡ Kısa Videolar</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Hızlı bilgi, kısa içerik · Tıkla, kaydır, izle</p>
      </div>

      {reels.length === 0 ? (
        <div className="text-center py-20 rounded-2xl" style={{ background: 'var(--bg-card)' }}>
          <div className="text-6xl mb-3 animate-float">🎬</div>
          <p style={{ color: 'var(--text-muted)' }}>Henüz kısa video yok</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {reels.map(r => (
            <Link key={r.id || r._id} href={`/reels/${r.slug || r.id}`}
              className="rounded-xl overflow-hidden hover:scale-105 transition-all group"
              style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
              <div className="relative bg-black" style={{ aspectRatio: '9/16' }}>
                {r.thumbnail ? (
                  <img src={r.thumbnail} alt={r.title} className="absolute inset-0 w-full h-full object-cover" />
                ) : r.mediaUrl ? (
                  <video src={r.mediaUrl} className="absolute inset-0 w-full h-full object-cover" muted playsInline preload="metadata" />
                ) : (
                  <div className={`absolute inset-0 flex items-center justify-center text-6xl bg-gradient-to-b ${r.bgGradient || 'from-purple-900 to-purple-700'}`}>
                    {r.emoji || '⚡'}
                  </div>
                )}

                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl text-white" style={{ background: 'rgba(0,0,0,0.6)' }}>▶</div>
                </div>

                {/* Yazar avatar - sol alt */}
                {r.author && (
                  <div className="absolute bottom-2 left-2 z-10">
                    <UserAvatar user={r.author} size={28} />
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs font-medium line-clamp-2" style={{ color: 'var(--text)' }}>{r.title}</p>
                <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                  👁 {r.views || 0} · ❤️ {r.likeCount || 0}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
