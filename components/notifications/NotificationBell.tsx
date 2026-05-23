'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { timeAgo } from '@/lib/utils'

type Notif = {
  _id?: string
  type: string
  emoji?: string
  fromUserName?: string
  fromUserId?: string
  postSlug?: string
  postTitle?: string
  commentPreview?: string
  level?: number
  questTitle?: string
  questIcon?: string
  rejectNote?: string
  read: boolean
  createdAt: string
}

export default function NotificationBell() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Notif[]>([])
  const [unread, setUnread] = useState(0)
  const lastSound = useRef(0)
  const prevUnread = useRef(0)

  useEffect(() => {
    if (status !== 'authenticated') return
    loadNotifications()
    const t = setInterval(loadNotifications, 30000)
    return () => clearInterval(t)
  }, [status])

  function loadNotifications() {
    fetch('/api/notifications', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : { items: [], unread: 0 })
      .then(d => {
        const newItems = d.items || []
        const newUnread = d.unread || 0
        setItems(newItems)
        if (newUnread > prevUnread.current && prevUnread.current > 0) {
          playNotificationSound()
        }
        prevUnread.current = newUnread
        setUnread(newUnread)
      })
      .catch(() => {})
  }

  function playNotificationSound() {
    try {
      const now = Date.now()
      if (now - lastSound.current < 3000) return
      lastSound.current = now
      const customSound = localStorage.getItem('notif_sound_url')
      if (customSound) {
        const audio = new Audio(customSound)
        audio.volume = 0.5
        audio.play().catch(() => playDefaultSound())
        return
      }
      playDefaultSound()
    } catch (e) {}
  }

  function playDefaultSound() {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.3)
    } catch (e) {}
  }

  async function markAllRead() {
    await fetch('/api/notifications', { method: 'PATCH' }).catch(() => {})
    setItems(p => p.map(n => ({ ...n, read: true })))
    setUnread(0)
  }

  async function markOneRead(notif: Notif) {
    if (!notif.read && notif._id) {
      await fetch('/api/notifications', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: notif._id }),
      }).catch(() => {})
    }
  }

  function handleNotifClick(notif: Notif) {
    markOneRead(notif)
    setOpen(false)
    if (notif.postSlug) router.push(`/blog/${notif.postSlug}`)
    else if (notif.fromUserId) router.push(`/profile/${notif.fromUserId}`)
  }

  function getIcon(notif: Notif): string {
    switch (notif.type) {
      case 'comment': return '💬'
      case 'reaction': return notif.emoji || '❤️'
      case 'follow': return '👥'
      case 'mention': return '@'
      case 'postPublished': return '📝'
      case 'postRejected': return '❌'
      case 'storyPublished': return '📸'
      case 'reelPublished': return '⚡'
      case 'levelUp': return '🎖️'
      case 'questDone': return notif.questIcon || '🏆'
      default: return '🔔'
    }
  }

  function getText(notif: Notif): string {
    switch (notif.type) {
      case 'comment': return `${notif.fromUserName || 'Biri'} yazına yorum yaptı`
      case 'reaction': return `${notif.fromUserName || 'Biri'} tepki verdi`
      case 'follow': return `${notif.fromUserName || 'Biri'} seni takip etmeye başladı`
      case 'mention': return `${notif.fromUserName || 'Biri'} senden bahsetti`
      case 'postPublished': return `Yazın yayınlandı: ${notif.postTitle || ''}`
      case 'postRejected': return `Yazın reddedildi: ${notif.rejectNote || ''}`
      case 'storyPublished': return 'Hikayen yayınlandı'
      case 'reelPublished': return `Kısa videon yayınlandı: ${notif.postTitle || ''}`
      case 'levelUp': return `Seviye atladın! Level ${notif.level}`
      case 'questDone': return `Görev tamamlandı: ${notif.questTitle}`
      default: return 'Yeni bildirim'
    }
  }

  if (!session) return null

  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="relative w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition-all"
        style={{ background: 'var(--bg-subtle)' }}>
        <span className="text-base">🔔</span>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
            style={{ background: '#e24b4a' }}>
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 w-80 max-w-[90vw] rounded-2xl shadow-2xl z-50 overflow-hidden"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-semibold" style={{ color: 'var(--text)' }}>🔔 Bildirimler</h3>
              {unread > 0 && (
                <button onClick={markAllRead} className="text-xs hover:underline" style={{ color: '#1D9E75' }}>
                  Tümünü okundu işaretle
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {items.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-2">🔔</div>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Henüz bildirimin yok.</p>
                </div>
              ) : items.map(n => (
                <button key={n._id} onClick={() => handleNotifClick(n)}
                  className="w-full flex gap-3 p-3 text-left hover:bg-opacity-50 transition-colors"
                  style={{
                    background: !n.read ? 'rgba(29,158,117,0.08)' : 'transparent',
                    borderBottom: '1px solid var(--border)',
                  }}>
                  <div className="text-2xl shrink-0">{getIcon(n)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm" style={{ color: 'var(--text)' }}>{getText(n)}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{timeAgo(n.createdAt)}</p>
                  </div>
                  {!n.read && <div className="w-2 h-2 rounded-full mt-2" style={{ background: '#1D9E75' }} />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
