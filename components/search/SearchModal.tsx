'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { searchAll } from '@/lib/data'
import { useBodyLock } from '@/lib/useBodyLock'

export default function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ReturnType<typeof searchAll> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  useBodyLock(true)

  useEffect(() => { inputRef.current?.focus() }, [])
  useEffect(() => {
    if (!query.trim()) { setResults(null); return }
    const t = setTimeout(() => setResults(searchAll(query)), 150)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const totalCount = results ? results.posts.length + results.videos.length + results.users.length : 0

  return (
    <div className="fixed inset-0 z-[200] flex flex-col sm:items-center sm:justify-start sm:pt-20 px-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', maxHeight: '80vh' }}
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <span className="text-xl">🔍</span>
          <input ref={inputRef} type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Makale, video veya kullanıcı ara..."
            className="flex-1 bg-transparent text-base outline-none" style={{ color: 'var(--text)' }} />
          {query && <button onClick={() => setQuery('')} style={{ color: 'var(--text-muted)' }}>✕</button>}
          <kbd className="hidden sm:flex text-xs px-2 py-1 rounded" style={{ background: 'var(--bg-subtle)' }}>Esc</kbd>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: '55vh' }}>
          {!query && (
            <div className="px-5 py-8 text-center" style={{ color: 'var(--text-muted)' }}>
              <div className="text-4xl mb-2">🔭</div>
              <p className="text-sm">Aramaya başla...</p>
            </div>
          )}

          {results && totalCount === 0 && (
            <div className="px-5 py-8 text-center" style={{ color: 'var(--text-muted)' }}>
              <p className="text-sm">"{query}" için sonuç bulunamadı</p>
            </div>
          )}

          {results && totalCount > 0 && (
            <div className="p-3 space-y-1">
              {results.posts.length > 0 && (
                <>
                  <p className="text-xs font-semibold uppercase px-3 py-2" style={{ color: 'var(--text-muted)' }}>📝 Makaleler</p>
                  {results.posts.map(post => (
                    <Link key={post.id} href={`/blog/${post.slug}`} onClick={onClose}>
                      <div className="flex items-start gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-opacity-50" onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-subtle)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <span className="text-2xl">{post.coverEmoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1" style={{ color: 'var(--text)' }}>{post.title}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{post.category} · {post.readTime}dk</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </>
              )}

              {results.videos.length > 0 && (
                <>
                  <p className="text-xs font-semibold uppercase px-3 py-2 mt-2" style={{ color: 'var(--text-muted)' }}>🎬 Videolar</p>
                  {results.videos.map(v => (
                    <Link key={v.id} href={`/videolar/${v.slug}`} onClick={onClose}>
                      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer" onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-subtle)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <span className="text-2xl">{v.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{v.title}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{v.duration}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </>
              )}

              {results.users.length > 0 && (
                <>
                  <p className="text-xs font-semibold uppercase px-3 py-2 mt-2" style={{ color: 'var(--text-muted)' }}>👥 Kullanıcılar</p>
                  {results.users.map(u => (
                    <Link key={u.id} href={`/profile/${u.id}`} onClick={onClose}>
                      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer" onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-subtle)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xl" style={{ background: `${u.avatarColor}22` }}>{u.avatar}</div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{u.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>@{u.username}</p>
                        </div>
                      </div>
                    </Link>
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
