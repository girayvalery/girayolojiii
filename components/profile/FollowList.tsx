'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type Props = {
  userId: string
  type: 'followers' | 'following'
  onClose: () => void
}

export default function FollowList({ userId, type, onClose }: Props) {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/follow/list?userId=${userId}&type=${type}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { setUsers(d.users || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [userId, type])

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }} onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} onClick={e => e.stopPropagation()}>
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <h3 className="font-semibold" style={{ color: 'var(--text)' }}>
            {type === 'followers' ? '👥 Takipçiler' : '🤝 Takip Edilenler'}
            <span className="text-xs ml-2 px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>{users.length}</span>
          </h3>
          <button onClick={onClose} className="text-lg" style={{ color: 'var(--text-muted)' }}>✕</button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {loading ? (
            <p className="text-center py-8 text-sm" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</p>
          ) : users.length === 0 ? (
            <p className="text-center py-8 text-sm" style={{ color: 'var(--text-muted)' }}>
              {type === 'followers' ? 'Henüz takipçi yok' : 'Henüz takip etmiyor'}
            </p>
          ) : users.map(u => (
            <Link key={u.id} href={`/profile/${u.id}`} onClick={onClose}
              className="flex items-center gap-3 p-3 rounded-xl">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
                style={{ background: `${u.avatarColor || '#1D9E75'}22` }}>
                {u.avatar || '👤'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{u.name}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>@{u.username}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
