'use client'
import { useState } from 'react'
import Link from 'next/link'
import { getPublished, getAllUsers, TAGS } from '@/lib/data'
import { formatNum } from '@/lib/utils'
import ProfilePreviewModal from '@/components/modals/ProfilePreviewModal'

export default function RightSidebar() {
  const topPosts = getPublished().sort((a, b) => b.viewCount - a.viewCount).slice(0, 4)
  const topUsers = getAllUsers().filter(u => u.role !== 'UYE').slice(0, 4)
  const [previewUserId, setPreviewUserId] = useState<string | null>(null)

  return (
    <>
      <aside className="flex flex-col gap-5">
        <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>🔥 Trend İçerikler</h3>
          <ul className="space-y-3">
            {topPosts.map((post, i) => (
              <li key={post.id}>
                <Link href={`/blog/${post.slug}`} className="flex gap-3 group">
                  <span className="text-xl font-bold tabular-nums shrink-0 mt-0.5" style={{ color: i === 0 ? '#1D9E75' : 'var(--text-muted)', opacity: i === 0 ? 1 : 0.5 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-green-500 transition-colors" style={{ color: 'var(--text)' }}>{post.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <span>{post.coverEmoji} {post.category}</span>
                      <span>·</span>
                      <span>👁 {formatNum(post.viewCount)}</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>✍️ Yazarlar</h3>
          <ul className="space-y-3">
            {topUsers.map(user => (
              <li key={user.id} className="flex items-center gap-3">
                <button onClick={() => setPreviewUserId(user.id)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0 transition-transform hover:scale-110"
                  style={{ background: `${user.avatarColor}22`, border: `2px solid ${user.avatarColor}55` }}>
                  {user.avatar}
                </button>
                <button onClick={() => setPreviewUserId(user.id)} className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium truncate hover:text-green-500" style={{ color: 'var(--text)' }}>{user.name}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user.postCount} yazı · {formatNum(user.followerCount)}</p>
                </button>
                <span className="text-xs px-2 py-0.5 rounded-full shrink-0" style={{ background: `${user.avatarColor}22`, color: user.avatarColor }}>
                  {user.role === 'ADMIN' ? 'Admin' : 'Yazar'}
                </span>
              </li>
            ))}
          </ul>
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

      {previewUserId && <ProfilePreviewModal userId={previewUserId} onClose={() => setPreviewUserId(null)} />}
    </>
  )
}
