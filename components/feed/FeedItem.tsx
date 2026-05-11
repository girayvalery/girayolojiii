'use client'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { Post } from '@/lib/data'

export default function FeedItem({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="rounded-2xl overflow-hidden card-lift transition-all"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

        {/* Kapak resmi/youtube/emoji */}
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
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(29,158,117,0.15)', color: '#1D9E75' }}>
              {post.category}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{post.readTime} dk okuma</span>
          </div>

          <h2 className="text-xl font-semibold mb-2 leading-tight" style={{ color: 'var(--text)' }}>{post.title}</h2>
          <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>{post.excerpt}</p>

          {/* Yazar + tarih + stats */}
          <div className="flex items-center gap-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm" style={{ background: `${post.author.avatarColor}22` }}>
              {post.author.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--text)' }}>{post.author.name}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{formatDate(post.publishedAt)}</p>
            </div>
            <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span>👁 {post.viewCount}</span>
              <span>❤️ {post.likeCount}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
