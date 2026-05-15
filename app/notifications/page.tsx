'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { timeAgo } from '@/lib/utils'

type Notif = {
  _id: string; type: string; emoji?: string;
  fromUserId?: string; fromUserName?: string;
  postSlug?: string; postTitle?: string;
  commentPreview?: string; level?: number;
  questTitle?: string; questIcon?: string;
  rejectNote?: string;
  read: boolean; createdAt: string;
}

export default function NotificationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [filter, setFilter] = useState<'all'|'unread'|'mentions'>('all')
  const [items, setItems] = useState<Notif[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/auth/login')
    if (status === 'authenticated') {
      fetch('/api/notifications', { cache: 'no-store' }).then(r => r.json()).then(d => { setItems(d.items || []); setLoading(false) })
    }
  }, [status, router])

  async function markAll() {
    await fetch('/api/notifications', { method: 'PATCH' })
    const d = await fetch('/api/notifications', { cache: 'no-store' }).then(r => r.json())
    setItems(d.items || [])
  }

  async function markOne(id: string) {
    await fetch('/api/notifications', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    setItems(p => p.map(n => n._id === id ? { ...n, read: true } : n))
  }

  if (status === 'loading' || !session) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>

  const filtered = items.filter(n => filter === 'all' ? true : filter === 'unread' ? !n.read : n.type === 'mention')

  function getMessage(n: Notif): string {
    if (n.type === 'reaction') return `${n.fromUserName} yazına ${n.emoji || '💡'} tepki verdi`
    if (n.type === 'comment') return `${n.fromUserName} yazına yorum yaptı`
    if (n.type === 'follow') return `${n.fromUserName} seni takip etmeye başladı`
    if (n.type === 'mention') return `${n.fromUserName} seni etiketledi`
    if (n.type === 'newPost') return `${n.fromUserName} yeni yazı yayınladı`
    if (n.type === 'rocket') return `${n.fromUserName} yazını 🚀 roketledi`
    if (n.type === 'postPublished') return `🎉 Yazın yayında!`
    if (n.type === 'postRejected') return `❌ Yazın reddedildi${n.rejectNote ? ': ' + n.rejectNote : ''}`
    if (n.type === 'levelUp') return `🏆 Seviye ${n.level} kazandın: ${n.questTitle} ${n.questIcon}`
    return 'Yeni bildirim'
  }

  function getLink(n: Notif): string {
    if (n.postSlug) return `/blog/${n.postSlug}`
    if (n.type === 'follow' && n.fromUserId) return `/profile/${n.fromUserId}`
    if (n.type === 'levelUp' && session?.user) return `/profile/${(session.user as any).id}`
    return '#'
  }

  function getIcon(n: Notif): string {
    if (n.type === 'levelUp') return n.questIcon || '🏆'
    const map: Record<string, string> = {
      reaction: n.emoji || '❤️', comment: '💬', follow: '➕', mention: '@', newPost: '📝',
      rocket: '🚀', postPublished: '🎉', postRejected: '❌',
    }
    return map[n.type] || '🔔'
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>🔔 Bildirimler</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{items.filter(n => !n.read).length} okunmamış</p>
        </div>
        {items.some(n => !n.read) && (
          <button onClick={markAll} className="text-xs font-medium" style={{ color: '#1D9E75' }}>Tümünü oku</button>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        {([
          { key: 'all' as const, label: 'Tümü' },
          { key: 'unread' as const, label: 'Okunmamış' },
          { key: 'mentions' as const, label: 'Bahsetmeler' },
        ]).map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className="px-4 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: filter === f.key ? '#1D9E75' : 'var(--bg-card)',
              color: filter === f.key ? '#fff' : 'var(--text-muted)',
              border: '1px solid var(--border)',
            }}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ background: 'var(--bg-card)' }}>
            <div className="text-5xl mb-3">📭</div>
            <p style={{ color: 'var(--text-muted)' }}>Bildirim yok</p>
          </div>
        ) : filtered.map(n => (
          <Link key={n._id} href={getLink(n)} onClick={() => !n.read && markOne(n._id)}>
            <div className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.005]"
              style={{
                background: !n.read ? 'rgba(29,158,117,0.05)' : 'var(--bg-card)',
                border: '1px solid var(--border)',
              }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                style={{ background: n.type === 'levelUp' ? 'rgba(212,172,42,0.2)' : 'rgba(29,158,117,0.15)' }}>
                {getIcon(n)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm" style={{ color: 'var(--text)' }}>{getMessage(n)}</p>
                {n.postTitle && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>"{n.postTitle}"</p>}
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{timeAgo(n.createdAt)}</p>
              </div>
              {!n.read && <span className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: '#1D9E75' }} />}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
