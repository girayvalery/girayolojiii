'use client'
import Link from 'next/link'
import { timeAgo } from '@/lib/utils'
import type { Post } from '@/lib/data'
import UserAvatar from '@/components/avatar/UserAvatar'

export default function FeedItem({ post }: { post: Post }) {
  const a = post.author as any

  return (
    <article className="rounded-2xl overflow-hidden card-lift transition-all" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      {/* Yazar */}
      <div className="flex items-center gap-3 px-5 pt-4 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <Link href={`/profile/${a.id}`} className="shrink-0">
          <UserAvatar user={a} size={40} />
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/profile/${a.id}`} className="text-sm font-semibold hover:text-green-500" style={{ color: 'var(--text)' }}>
            @{a.username || a.name}
          </Link>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{timeAgo(post.publishedAt)}</p>
        </div>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(29,158,117,0.15)', color: '#1D9E75' }}>
          {post.category}
        </span>
      </div>

      <Link href={`/blog/${post.slug}`}>
        {post.youtubeId ? (
          <div className="relative h-52 sm:h-64">
            <img src={`https://img.youtube.com/vi/${post.youtubeId}/maxresdefault.jpg`}
              onError={(e) => (e.currentTarget.src = `https://img.youtube.com/vi/${post.youtubeId}/hqdefault.jpg`)}
              alt={post.title} className="w-full h-full object-cover" />
            <span className="absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-md text-white" style={{ background: '#FF0000' }}>📺 YouTube</span>
          </div>
        ) : post.coverImage ? (
          <img src={post.coverImage} alt={post.title} className="w-full h-52 sm:h-64 object-cover" />
        ) : (
          <div className={`relative h-52 sm:h-64 flex items-center justify-center bg-gradient-to-br ${post.bgGradient}`}>
            <span className="text-7xl">{post.coverEmoji}</span>
          </div>
        )}

        <div className="p-5">
          <h2 className="text-xl font-semibold mb-2 leading-tight" style={{ color: 'var(--text)' }}>{post.title}</h2>
          <p className="text-sm line-clamp-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>{post.excerpt}</p>

          <div className="flex items-center gap-3 mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>👁 {post.viewCount}</span>
            <span>🚀 {(post as any).rocketCount || 0}</span>
            <span>❤️ {post.likeCount}</span>
            <span className="ml-auto">{post.readTime} dk okuma</span>
          </div>
        </div>
      </Link>
    </article>
  )
}
