'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function RelatedReelBanner({ reelId }: { reelId: string }) {
  const [reel, setReel] = useState<any>(null)
  useEffect(() => {
    fetch('/api/db/reels', { cache: 'no-store' })
      .then(r => r.json())
      .then((d: any) => {
        if (Array.isArray(d)) {
          const found = d.find((r: any) => r.id === reelId || r._id === reelId)
          setReel(found)
        }
      })
      .catch(() => {})
  }, [reelId])

  if (!reel) return null

  return (
    <Link href={`/reels/${reel.slug || reel.id}`}
      className="flex items-center gap-3 rounded-2xl p-3 mb-6 hover:scale-[1.01] transition-all"
      style={{ background: 'linear-gradient(135deg, #1D9E75, #534AB7)', border: '1px solid rgba(255,255,255,0.2)' }}>
      <div className="w-16 h-24 rounded-lg overflow-hidden shrink-0 bg-black">
        {reel.thumbnail ? (
          <img src={reel.thumbnail} alt="" className="w-full h-full object-cover" />
        ) : reel.mediaUrl ? (
          <video src={reel.mediaUrl} muted playsInline className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">⚡</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs font-semibold mb-0.5">⚡ KISA VİDEO</p>
        <p className="text-white text-sm font-medium line-clamp-2">{reel.title}</p>
        <p className="text-white/80 text-xs mt-1">Tıkla, kısa videoyu izle →</p>
      </div>
    </Link>
  )
}
