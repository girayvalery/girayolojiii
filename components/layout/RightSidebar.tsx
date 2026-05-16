'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TAGS } from '@/lib/data'
import { formatNum } from '@/lib/utils'
import UserAvatar from '@/components/avatar/UserAvatar'

export default function RightSidebar() {
  const [topPosts, setTopPosts] = useState<any[]>([])
  const [topUsers, setTopUsers] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/db/posts', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d)) {
          const sorted = [...d].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 4)
          setTopPosts(sorted)
        }
      })
      .catch(() => {})

    // Tüm kullanıcıları + post sayılarını çek
    Promise.all([
      fetch('/api/db/users', { cache: 'no-store' }).then(r => r.json()).catch(() => []),
      fetch('/api/db/posts', { cache: 'no-store' }).then(r => r.json()).catch(() => []),
    ]).then(([users, posts]) => {
      if (!Array.isArray(users)) return
      const postCounts: Record<string, number> = {}
      ;(Array.isArray(posts) ? posts : []).forEach((p: any) => {
        if (p.author?.id) postCounts[p.author.id] = (postCounts[p.author.id] || 0) + 1
      })
      const withPosts = users
        .map((u: any) => ({ ...u, postCount: postCounts[u.id] || 0 }))
        .sort((a: any, b: any) => b.postCount - a.postCount)
        .slice(0, 5)
      setTopUsers(withPosts)
    })
  }, [])

  return (
    <aside className="flex flex-col gap-5 lg:sticky lg:top-20">
      <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>🔥 Trend İçerikler</h3>
        {topPosts.length === 0 ? (
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Henüz yazı yok</p>
        ) : (
          <ul className="space-y-3">
            {topPosts.map((post, i) => (
              <li key={post.id || post._id}>
                <Link href={`/blog/${post.slug}`} className="flex gap-3 group">
                  <span className="text-xl font-bold tabular-nums shrink-0 mt-0.5" style={{ color: i === 0 ? '#1D9E75' : 'var(--text-muted)', opacity: i === 0 ? 1 : 0.5 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-green-500 transition-colors" style={{ color: 'var(--text)' }}>{post.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <span>{post.coverEmoji} {post.category}</span>
                      <span>·</span>
                      <span>👁 {formatNum(post.viewCount || 0)}</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>✍️ Yazarlar</h3>
        {topUsers.length === 0 ? (
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Henüz kullanıcı yok</p>
        ) : (
          <ul className="space-y-3">
            {topUsers.map(user => (
              <li key={user.id} className="flex items-center gap-3">
                <Link href={`/profile/${user.id}`} className="shrink-0">
                  <UserAvatar user={user} size={36} />
                </Link>
                <Link href={`/profile/${user.id}`} className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate hover:text-green-500" style={{ color: 'var(--text)' }}>@{user.username || user.name}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user.postCount} yazı</p>
                </Link>
                {user.role === 'ADMIN' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full shrink-0 font-semibold" style={{ background: '#1D9E75', color: '#fff' }}>Admin</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>🏷️ Etiketler</h3>
        <div className="flex flex-wrap gap-2">
          {TAGS.map(tag => (
            <Link key={tag} href={`/blog?tag=${tag}`}
              className="text-xs px-2.5 py-1 rounded-full border hover:border-green-400 hover:text-green-500"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}
