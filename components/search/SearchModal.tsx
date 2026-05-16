'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import UserAvatar from '@/components/avatar/UserAvatar'

export default function SearchModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    if (!query.trim()) {
      setUsers([]); setPosts([]); return
    }
    setLoading(true)
    const q = query.trim().toLowerCase()
    Promise.all([
      fetch('/api/db/users', { cache: 'no-store' }).then(r => r.json()).catch(() => []),
      fetch('/api/db/posts', { cache: 'no-store' }).then(r => r.json()).catch(() => []),
    ]).then(([u, p]) => {
      const usersFiltered = (Array.isArray(u) ? u : []).filter((x: any) =>
        (x.name || '').toLowerCase().includes(q) ||
        (x.username || '').toLowerCase().includes(q)
      ).slice(0, 8)
      const postsFiltered = (Array.isArray(p) ? p : []).filter((x: any) =>
        (x.title || '').toLowerCase().includes(q) ||
        (x.excerpt || '').toLowerCase().includes(q) ||
        (x.category || '').toLowerCase().includes(q)
      ).slice(0, 8)
      setUsers(usersFiltered)
      setPosts(postsFiltered)
      setLoading(false)
    })
  }, [query])

  function go(href: string) {
    onClose()
    router.push(href)
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-24 px-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} onClick={e => e.stopPropagation()}>

        <div className="flex items-center gap-3 p-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <span className="text-xl">🔍</span>
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} autoFocus
            placeholder="Yazı, kullanıcı, kategori ara..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: 'var(--text)' }} />
          <button onClick={onClose} className="text-xs px-2 py-1 rounded-md" style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>Esc</button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {!query.trim() ? (
            <div className="p-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
              <div className="text-4xl mb-2 animate-float">🔎</div>
              Aramak için yaz...
            </div>
          ) : loading ? (
            <div className="p-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>Aranıyor...</div>
          ) : users.length === 0 && posts.length === 0 ? (
            <div className="p-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
              "{query}" için sonuç bulunamadı
            </div>
          ) : (
            <div className="p-2">
              {users.length > 0 && (
                <>
                  <p className="text-[10px] font-semibold uppercase tracking-wider px-3 py-2" style={{ color: 'var(--text-muted)' }}>👥 Kullanıcılar</p>
                  {users.map(u => (
                    <button key={u.id} onClick={() => go(`/profile/${u.id}`)}
                      className="w-full flex items-center gap-3 p-2 rounded-xl text-left hover:bg-opacity-50"
                      style={{ background: 'transparent' }}>
                      <UserAvatar user={u} size={36} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{u.name}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>@{u.username}</p>
                      </div>
                    </button>
                  ))}
                </>
              )}

              {posts.length > 0 && (
                <>
                  <p className="text-[10px] font-semibold uppercase tracking-wider px-3 py-2 mt-2" style={{ color: 'var(--text-muted)' }}>📝 Yazılar</p>
                  {posts.map(p => (
                    <button key={p.id || p._id} onClick={() => go(`/blog/${p.slug}`)}
                      className="w-full flex items-center gap-3 p-2 rounded-xl text-left">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0" style={{ background: 'var(--bg-subtle)' }}>
                        {p.coverEmoji || '📝'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold line-clamp-1" style={{ color: 'var(--text)' }}>{p.title}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.category} · @{p.author?.username || p.author?.name}</p>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
