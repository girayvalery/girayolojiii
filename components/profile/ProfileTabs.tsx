'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Post } from '@/lib/data'

export default function ProfileTabs({ posts }: { posts: Post[] }) {
  const [tab, setTab] = useState<'posts'|'saved'>('posts')
  const saved = posts.slice(0, 2)

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="flex" style={{ borderBottom: '1px solid var(--border)' }}>
        {([
          { key: 'posts' as const, label: `📝 Yazılar (${posts.length})` },
          { key: 'saved' as const, label: `🔖 Kaydedilenler (${saved.length})` },
        ]).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="flex-1 py-3 text-sm font-medium"
            style={{ color: tab === t.key ? '#1D9E75' : 'var(--text-muted)', borderBottom: tab === t.key ? '2px solid #1D9E75' : '2px solid transparent' }}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="p-4">
        {tab === 'posts' && (
          posts.length === 0 ? (
            <div className="text-center py-10" style={{ color: 'var(--text-muted)' }}>
              <div className="text-4xl mb-2">📝</div>
              <p className="text-sm">Henüz yazı yok.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <div className="flex gap-3 p-3 rounded-xl group cursor-pointer" style={{ background: 'var(--bg-subtle)' }}>
                    <span className="text-2xl">{post.coverEmoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold line-clamp-1 group-hover:text-green-500" style={{ color: 'var(--text)' }}>{post.title}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>👁 {post.viewCount} · ❤️ {post.likeCount}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )
        )}
        {tab === 'saved' && (
          <div className="text-center py-10" style={{ color: 'var(--text-muted)' }}>
            <div className="text-4xl mb-2">🔖</div>
            <p className="text-sm">Okuma listesi boş.</p>
          </div>
        )}
      </div>
    </div>
  )
}
