'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { timeAgo } from '@/lib/utils'

type Notif = {
  _id?: string
  type: string
  emoji?: string
  fromUserName?: string
  postSlug?: string
  postTitle?: string
  commentPreview?: string
  read: boolean
  createdAt: string
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Notif[]>([])
  const [unread, setUnread] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  async function load() {
    try {
      const res = await fetch('/api/notifications')
      const d = await res.json()
      setItems(d.items || [])
      setUnread(d.unread || 0)
    } catch {}
  }

  useEffect(() => {
    load()
    const i = setInterval(load, 30000) // 30 saniyede bir yenile
    return () => clearInterval(i)
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  async function markAllRead() {
    await fetch('/api/notifications', { method: 'PATCH' })
    load()
  }

  function getMessage(n: Notif): string {
    if (n.type === 'reaction') return `${n.fromUserName} yazına ${n.emoji || '💡'} tepki verdi`
    if (n.type === 'comment') return `${n.fromUserName} yazına yorum yaptı`
    if (n.type === 'follow') return `${n.fromUserName} seni takip etmeye başladı`
    if (n.type === 'mention') return `${n.fromUserName} seni etiketledi`
    if (n.type === 'newPost') return `${n.fromUserName} yeni yazı yayınladı`
    return n.commentPreview || 'Yeni bildirim'
  }

  function getLink(n: Notif): string {
    if (n.postSlug) return `/blog/${n.postSlug}`
    if (n.type === 'follow') return '/notifications'
    return '/notifications'
  }

  function getIcon(n: Notif): string {
    const map: Record<string, string> = {
      reaction: n.emoji || '❤️',
      comment: '💬',
      follow: '➕',
      mention: '@',
      newPost: '📝',
    }
    return map[n.type] || '🔔'
  }

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(p => !p)}
        className="relative w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105"
        style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
        <span className="text-base">🔔</span>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1"
            style={{ background: '#e24b4a' }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-up"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Bildirimler</h3>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs" style={{ color: '#1D9E75' }}>Tümünü oku</button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>
                <div className="text-3xl mb-2">🔕</div>
                <p className="text-sm">Henüz bildirim yok</p>
              </div>
            ) : items.map(n => (
              <Link key={n._id} href={getLink(n)} onClick={() => setOpen(false)}
                className="flex items-start gap-3 px-4 py-3 transition-colors"
                style={{ background: !n.read ? 'rgba(29,158,117,0.05)' : 'transparent', borderBottom: '1px solid var(--border)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0" style={{ background: 'rgba(29,158,117,0.15)' }}>
                  {getIcon(n)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs leading-snug" style={{ color: 'var(--text)' }}>{getMessage(n)}</p>
                  {n.postTitle && <p className="text-[10px] mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>"{n.postTitle}"</p>}
                  <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{timeAgo(n.createdAt)}</p>
                </div>
                {!n.read && <span className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: '#1D9E75' }} />}
              </Link>
            ))}
          </div>

          <div className="px-4 py-2 text-center" style={{ borderTop: '1px solid var(--border)' }}>
            <Link href="/notifications" onClick={() => setOpen(false)} className="text-xs font-medium" style={{ color: '#1D9E75' }}>
              Tüm bildirimleri gör →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
