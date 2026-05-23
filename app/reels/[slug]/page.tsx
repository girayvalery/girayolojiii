'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import UserAvatar from '@/components/avatar/UserAvatar'
import { useToast } from '@/components/ui/Toast'
import { useAuthGate } from '@/components/auth/AuthGate'
import { formatNum, timeAgo } from '@/lib/utils'
import ReelComments from '@/components/reels/ReelComments'

export default function ReelDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const { data: session } = useSession()
  const { show } = useToast()
  const { requireAuth } = useAuthGate()
  const me = session?.user as any

  const [allReels, setAllReels] = useState<any[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  const [rocketed, setRocketed] = useState(false)
  const [rocketCount, setRocketCount] = useState(0)
  const [showComments, setShowComments] = useState(false)
  const touchStartY = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/db/reels', { cache: 'no-store' })
      .then(r => r.json())
      .then((d: any) => {
        if (Array.isArray(d) && d.length > 0) {
          setAllReels(d)
          const idx = d.findIndex((r: any) => r.slug === params.slug || r.id === params.slug || String(r._id) === params.slug)
          setCurrentIdx(idx >= 0 ? idx : 0)
          setRocketCount(d[idx >= 0 ? idx : 0]?.rocketCount || 0)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.slug])

  const current = allReels[currentIdx]
  const isOwn = me && current?.author?.id === me.id

  useEffect(() => {
    if (!current) return
    setRocketCount(current.rocketCount || 0)
    // View artır
    const id = current._id || current.id
    fetch(`/api/db/reels/${id}/view`, { method: 'POST' }).catch(() => {})
    // Mevcut rocket state çek
    fetch(`/api/db/reels/${id}/rocket`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        setRocketed(!!d.rocketed)
        setRocketCount(d.count || 0)
      }).catch(() => {})
  }, [current])

  function goPrev() {
    if (currentIdx > 0) {
      setCurrentIdx(i => i - 1)
      setRocketed(false)
      setShowComments(false)
    }
  }
  function goNext() {
    if (currentIdx < allReels.length - 1) {
      setCurrentIdx(i => i + 1)
      setRocketed(false)
      setShowComments(false)
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (showComments) return
      if (e.key === 'ArrowUp') goPrev()
      else if (e.key === 'ArrowDown') goNext()
      else if (e.key === 'Escape') router.back()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [currentIdx, allReels, showComments])

  function onWheel(e: React.WheelEvent) {
    if (showComments) return
    if (e.deltaY > 30) goNext()
    else if (e.deltaY < -30) goPrev()
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0].clientY
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartY.current === null) return
    const diff = touchStartY.current - e.changedTouches[0].clientY
    if (Math.abs(diff) > 50 && !showComments) {
      if (diff > 0) goNext()
      else goPrev()
    }
    touchStartY.current = null
  }

  function toggleRocket() {
    if (!requireAuth('Roketlemek')) return
    const newState = !rocketed
    setRocketed(newState)
    setRocketCount(cc => newState ? cc + 1 : cc - 1)
    fetch(`/api/db/reels/${current._id || current.id}/rocket`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rocketed: newState })
    })
      .then(r => r.json())
      .then(d => {
        if (typeof d.rocketCount === 'number') setRocketCount(d.rocketCount)
        if (typeof d.rocketed === 'boolean') setRocketed(d.rocketed)
      })
      .catch(() => {})
  }

  async function share() {
    const url = window.location.origin + `/reels/${current.slug || current.id}`
    if (navigator.share) {
      try { await navigator.share({ title: current.title, url }) } catch {}
    } else {
      await navigator.clipboard.writeText(url)
      show('success', '📋 Link kopyalandı')
    }
  }

  async function deleteReel() {
    if (!confirm('Bu kısa videoyu silmek istediğine emin misin?')) return
    try {
      const id = current._id || current.id
      const res = await fetch(`/api/db/reels/${id}`, { method: 'DELETE' })
      if (res.ok) {
        show('success', 'Silindi')
        router.push('/reels')
      } else show('error', 'Silinemedi')
    } catch { show('error', 'Hata oluştu') }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#000' }}><div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin" /></div>

  if (!current) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">🎬</div>
      <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>Video Bulunamadı</h2>
      <Link href="/reels" className="inline-block mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: '#1D9E75' }}>← Tüm Videolar</Link>
    </div>
  )

  return (
    <div className="fixed inset-0 z-[60]" style={{ background: '#000' }} ref={containerRef}
      onWheel={onWheel} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

      {/* KAPAT (X) - üst sağ */}
      <button onClick={() => router.push('/')}
        className="fixed top-4 right-4 z-[70] w-11 h-11 rounded-full flex items-center justify-center text-white text-2xl font-bold"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
        ✕
      </button>

      {/* Geri - üst sol */}
      <button onClick={() => router.back()}
        className="fixed top-4 left-4 z-[70] w-10 h-10 rounded-full flex items-center justify-center text-white text-xl"
        style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>‹</button>

      {/* VIDEO AREA - TikTok tarzı: yorum açıkken üst yarıya küçülür */}
      <div
        className="relative flex items-center justify-center transition-all duration-300 overflow-hidden"
        style={{
          height: showComments ? '50vh' : '100vh',
          background: '#000',
        }}>

        <div className="relative h-full" style={{ aspectRatio: '9/16', maxWidth: '100%' }}>
          {current.mediaUrl ? (
            <video
              key={current.id}
              src={current.mediaUrl}
              className="w-full h-full object-cover"
              autoPlay loop controls playsInline
            />
          ) : (
            <div className={`absolute inset-0 flex items-center justify-center text-9xl bg-gradient-to-b ${current.bgGradient || 'from-purple-900 to-purple-700'}`}>
              {current.emoji || '⚡'}
            </div>
          )}

          {/* Sıra göstergesi */}
          <div className="absolute top-4 right-20 z-20 px-3 py-1 rounded-full text-white text-xs" style={{ background: 'rgba(0,0,0,0.5)' }}>
            {currentIdx + 1} / {allReels.length}
          </div>

          {/* Sol alt: yazar + başlık (yorum kapalı iken) */}
          {!showComments && current.author && (
            <div className="absolute bottom-20 left-4 right-20 z-20 pointer-events-none">
              <Link href={`/profile/${current.author.id}`} className="flex items-center gap-2 mb-3 pointer-events-auto">
                <UserAvatar user={current.author} size={40} />
                <div>
                  <p className="text-white text-sm font-semibold drop-shadow">{current.author.name}</p>
                  <p className="text-white/80 text-xs drop-shadow">@{current.author.username} · {timeAgo(current.publishedAt)}</p>
                </div>
              </Link>
              <p className="text-white text-base font-medium drop-shadow mb-1">{current.title}</p>
              {current.category && <span className="inline-block text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>📁 {current.category}</span>}
            </div>
          )}

          {/* Sağ alt: eylemler */}
          <div className="absolute bottom-6 right-3 z-20 flex flex-col gap-3">
            <button onClick={toggleRocket} className="flex flex-col items-center gap-0.5">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl transition-all"
                style={{
                  background: rocketed ? '#1D9E75' : 'rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(8px)',
                  transform: rocketed ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: rocketed ? '0 0 16px rgba(29,158,117,0.7)' : 'none',
                }}>
                🚀
              </div>
              <span className="text-white text-[10px] drop-shadow">{formatNum(rocketCount)}</span>
            </button>

            <button onClick={() => setShowComments(s => !s)} className="flex flex-col items-center gap-0.5">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl"
                style={{
                  background: showComments ? '#1D9E75' : 'rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(8px)',
                }}>
                💬
              </div>
              <span className="text-white text-[10px] drop-shadow">{formatNum(current.commentCount || 0)}</span>
            </button>

            <button onClick={share} className="flex flex-col items-center gap-0.5">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>📤</div>
              <span className="text-white text-[10px] drop-shadow">Paylaş</span>
            </button>

            {isOwn && (
              <button onClick={deleteReel} className="flex flex-col items-center gap-0.5">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-lg" style={{ background: 'rgba(226,75,74,0.7)', backdropFilter: 'blur(8px)' }}>🗑️</div>
                <span className="text-white text-[10px] drop-shadow">Sil</span>
              </button>
            )}
          </div>

          {/* Üst/Alt geçiş okları */}
          {!showComments && (
            <>
              {currentIdx > 0 && (
                <button onClick={goPrev}
                  className="absolute top-16 left-1/2 -translate-x-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl"
                  style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>↑</button>
              )}
              {currentIdx < allReels.length - 1 && (
                <button onClick={goNext}
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl"
                  style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>↓</button>
              )}
            </>
          )}
        </div>
      </div>

      {/* YORUMLAR - alt yarıya kayar */}
      <div
        className="absolute left-0 right-0 transition-all duration-300 flex flex-col"
        style={{
          bottom: 0,
          height: showComments ? '50vh' : '0',
          background: 'var(--bg-card)',
          borderTop: showComments ? '1px solid var(--border)' : 'none',
          overflow: 'hidden',
        }}>
        {showComments && (
          <>
            <div className="flex items-center justify-between p-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>💬 Yorumlar</h3>
              <button onClick={() => setShowComments(false)} className="text-xl" style={{ color: 'var(--text-muted)' }}>✕</button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ReelComments reelId={current._id || current.id} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
