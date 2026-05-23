'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatNum } from '@/lib/utils'
import UserAvatar from '@/components/avatar/UserAvatar'

function ReelCard({ reel }: { reel: any }) {
  return (
    <Link href={`/reels/${reel.slug || reel.id || reel._id}`}
      className="relative rounded-2xl overflow-hidden shrink-0 group cursor-pointer block"
      style={{ width: 160, height: 280, background: '#000' }}>

      {/* Önce thumbnail, sonra video, sonra emoji */}
      {reel.thumbnail ? (
        <img src={reel.thumbnail} alt={reel.title}
          className="absolute inset-0 w-full h-full object-cover" />
      ) : reel.mediaUrl ? (
        <video
          src={reel.mediaUrl}
          className="absolute inset-0 w-full h-full object-cover"
          muted playsInline preload="metadata"
          onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
          onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0 }}
        />
      ) : (
        <>
          <div className={`absolute inset-0 bg-gradient-to-b ${reel.bgGradient || 'from-purple-900 to-purple-700'} opacity-90`} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">{reel.emoji || '⚡'}</span>
          </div>
        </>
      )}

      {/* Karartma + play */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(0,0,0,0.85) 40%,transparent 60%)', pointerEvents: 'none' }} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl text-white" style={{ background: 'rgba(0,0,0,0.6)' }}>▶</div>
      </div>

      {/* Yazar */}
      {reel.author && (
        <div className="absolute top-3 right-3 z-10">
          <UserAvatar user={reel.author} size={28} />
        </div>
      )}

      {/* Alt */}
      <div className="absolute bottom-0 left-0 right-0 p-3 z-10 pointer-events-none">
        <p className="text-white text-xs font-semibold line-clamp-2 leading-tight mb-2">{reel.title}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-white/60 text-xs">
            <span>👁</span><span>{formatNum(reel.views || 0)}</span>
          </div>
          <div className="flex items-center gap-1 text-white/60 text-xs">
            <span>🚀</span><span>{formatNum(reel.rocketCount || 0)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function ReelsRow({ initialReels = [] }: { initialReels?: any[] } = {}) {
  const [reels, setReels] = useState<any[]>(initialReels)

  useEffect(() => {
    fetch('/api/db/reels', { cache: 'no-store' })
      .then(r => r.json())
      .then((d: any) => { if (Array.isArray(d)) setReels(d) })
      .catch(() => {})
  }, [])

  if (reels.length === 0) return null

  return (
    <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>⚡ Kısa Videolar</span>
        <Link href="/reels" className="text-xs hover:underline" style={{ color: '#1D9E75' }}>Tümü →</Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {reels.slice(0, 10).map((r: any) => (
          <ReelCard key={r.id || r._id} reel={r} />
        ))}
      </div>
    </div>
  )
}
