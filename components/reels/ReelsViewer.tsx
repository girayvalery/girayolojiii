'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { getAllReels } from '@/lib/data'
import { formatNum } from '@/lib/utils'

export default function ReelsViewer() {
  const router = useRouter()
  const params = useParams<{ slug: string }>()
  const reels = getAllReels()
  const startIdx = Math.max(0, reels.findIndex(r => r.slug === params.slug))
  const [idx, setIdx] = useState(startIdx)
  const [liked, setLiked] = useState<Record<string, boolean>>({})
  const [likes, setLikes] = useState<Record<string, number>>(Object.fromEntries(reels.map(r => [r.id, r.likes])))
  const [pullDistance, setPullDistance] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const touchStartY = useRef(0)
  const touchCurY = useRef(0)
  const current = reels[idx]

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const goNext = useCallback(() => {
    if (idx < reels.length - 1) setIdx(i => i + 1)
  }, [idx, reels.length])

  const goPrev = useCallback(() => {
    if (idx === 0) {
      setRefreshing(true)
      setTimeout(() => window.location.reload(), 600)
      return
    }
    setIdx(i => i - 1)
  }, [idx])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); goNext() }
      if (e.key === 'ArrowUp') { e.preventDefault(); goPrev() }
      if (e.key === 'Escape') router.back()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goNext, goPrev, router])

  function onTouchStart(e: React.TouchEvent) { touchStartY.current = e.touches[0].clientY; touchCurY.current = touchStartY.current }
  function onTouchMove(e: React.TouchEvent) {
    touchCurY.current = e.touches[0].clientY
    const diff = touchCurY.current - touchStartY.current
    if (idx === 0 && diff > 0) setPullDistance(Math.min(diff, 120))
  }
  function onTouchEnd() {
    const diff = touchCurY.current - touchStartY.current
    if (Math.abs(diff) > 80) {
      if (diff < 0) goNext(); else goPrev()
    }
    setPullDistance(0)
  }

  function toggleLike() {
    const isLiked = liked[current.id]
    setLiked(p => ({ ...p, [current.id]: !isLiked }))
    setLikes(p => ({ ...p, [current.id]: (p[current.id] || 0) + (isLiked ? -1 : 1) }))
  }

  if (!current) return <div className="min-h-screen flex items-center justify-center text-white" style={{ background: '#000' }}>Reel bulunamadı</div>

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden select-none"
      style={{ background: '#000', touchAction: 'none' }}
      onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>

      {idx === 0 && (pullDistance > 0 || refreshing) && (
        <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-center" style={{ height: `${Math.max(60, pullDistance)}px`, background: 'linear-gradient(to bottom,rgba(0,0,0,0.5),transparent)' }}>
          <div className="text-center">
            <div className="text-3xl">{refreshing ? '⏳' : '↓'}</div>
            <p className="text-xs text-white/70">{refreshing ? 'Yenileniyor...' : pullDistance > 80 ? 'Bırak ve yenile' : 'Yenilemek için çek'}</p>
          </div>
        </div>
      )}

      <button onClick={() => router.back()} className="absolute top-5 left-4 z-40 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl" style={{ background: 'rgba(0,0,0,0.4)' }}>←</button>
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-40 text-white/70 text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.4)' }}>{idx + 1} / {reels.length}</div>

      <div className="h-full flex items-center justify-center">
        <div className="relative w-full max-w-sm mx-auto flex flex-col justify-center items-center" style={{ height: '100vh' }}>
          <div className={`absolute inset-0 bg-gradient-to-b ${current.bgGradient}`} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(0,0,0,0.7),transparent 50%,rgba(0,0,0,0.3))' }} />
          <span className="relative z-10 text-[10rem] drop-shadow-2xl">{current.emoji}</span>

          <div className="absolute right-3 bottom-28 z-20 flex flex-col items-center gap-4">
            <button onClick={toggleLike} className="flex flex-col items-center gap-1 hover:scale-110">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ background: 'rgba(0,0,0,0.5)' }}>
                {liked[current.id] ? '❤️' : '🤍'}
              </div>
              <span className="text-white text-xs">{formatNum(likes[current.id] || 0)}</span>
            </button>
            <button className="flex flex-col items-center gap-1 hover:scale-110">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ background: 'rgba(0,0,0,0.5)' }}>💬</div>
              <span className="text-white text-xs">24</span>
            </button>
            <button className="flex flex-col items-center gap-1 hover:scale-110">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ background: 'rgba(0,0,0,0.5)' }}>🔖</div>
              <span className="text-white text-xs">Kaydet</span>
            </button>
          </div>

          <div className="absolute bottom-6 left-0 right-20 z-20 px-5">
            <Link href={`/profile/${current.author.id}`}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg" style={{ background: `${current.author.avatarColor}33`, border: `2px solid ${current.author.avatarColor}` }}>
                  {current.author.avatar}
                </div>
                <span className="text-white text-sm font-semibold">{current.author.name}</span>
              </div>
            </Link>
            <p className="text-white text-sm font-semibold mb-1">{current.title}</p>
            <p className="text-white/80 text-xs leading-relaxed">{current.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
