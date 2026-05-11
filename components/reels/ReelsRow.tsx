'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { getAllReels, type Reel } from '@/lib/data'
import { formatNum } from '@/lib/utils'
import ProfilePreviewModal from '@/components/modals/ProfilePreviewModal'

function ReelCard({ reel, onProfile }: { reel: Reel; onProfile: () => void }) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(reel.likes)

  function toggleLike(e: React.MouseEvent) {
    e.preventDefault(); e.stopPropagation()
    setLiked(p => !p)
    setLikes(p => liked ? p - 1 : p + 1)
  }

  return (
    <div className="relative rounded-2xl overflow-hidden shrink-0 group cursor-pointer" style={{ width: 160, height: 280, background: '#000' }}>
      <Link href={`/reels/${reel.slug}`} className="absolute inset-0 z-0" />
      <div className={`absolute inset-0 bg-gradient-to-b ${reel.bgGradient} opacity-90`} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-6xl opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all">{reel.emoji}</span>
      </div>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(0,0,0,0.85) 40%,transparent)' }} />
      <div className="absolute top-3 left-3 text-xs font-semibold px-2 py-0.5 rounded-full text-white z-10" style={{ background: 'rgba(0,0,0,0.5)' }}>{reel.duration}</div>
      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onProfile() }}
        className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center text-sm hover:scale-110"
        style={{ background: `${reel.author.avatarColor}44`, border: `1.5px solid ${reel.author.avatarColor}` }}>
        {reel.author.avatar}
      </button>
      <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
        <p className="text-white text-xs font-semibold line-clamp-2 leading-tight mb-2">{reel.title}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-white/60 text-xs"><span>👁</span><span>{formatNum(reel.views)}</span></div>
          <button onClick={toggleLike} className="flex items-center gap-1 text-xs relative z-20" style={{ color: liked ? '#e24b4a' : 'rgba(255,255,255,0.6)' }}>
            <span>{liked ? '❤️' : '🤍'}</span><span>{formatNum(likes)}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ReelsRow() {
  const reels = getAllReels()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)
  const [previewUserId, setPreviewUserId] = useState<string | null>(null)

  function scroll(dir: 'left' | 'right') {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' })
  }

  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 10)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  return (
    <>
      <div className="rounded-2xl p-4 relative" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-1 h-5 rounded-full" style={{ background: '#D4537E' }} />
            <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Kısa Videolar</span>
          </div>
          <Link href="/videolar" className="text-xs font-medium" style={{ color: '#1D9E75' }}>Tümü →</Link>
        </div>
        <div className="relative">
          {canLeft && (
            <button onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-xl"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)' }}>
              ←
            </button>
          )}
          {canRight && (
            <button onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-xl"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)' }}>
              →
            </button>
          )}
          <div ref={scrollRef} onScroll={handleScroll} className="flex gap-3 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
            {reels.map(reel => <ReelCard key={reel.id} reel={reel} onProfile={() => setPreviewUserId(reel.author.id)} />)}
          </div>
        </div>
      </div>
      {previewUserId && <ProfilePreviewModal userId={previewUserId} onClose={() => setPreviewUserId(null)} />}
    </>
  )
}
