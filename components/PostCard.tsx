import Link from 'next/link'
import type { Post } from '@/lib/data'
import { timeAgo, formatNum } from '@/lib/utils'
import UserAvatar from '@/components/avatar/UserAvatar'

type Props = { post: Post; size?: 'sm' | 'md' | 'lg' }

const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  'Yapay Zeka': { bg: 'rgba(83,74,183,0.15)', text: '#7F77DD' },
  'Fizik': { bg: 'rgba(29,158,117,0.15)', text: '#1D9E75' },
  'Çevre': { bg: 'rgba(99,153,34,0.15)', text: '#639922' },
  'Dilbilim': { bg: 'rgba(186,117,23,0.15)', text: '#ba7517' },
  'Astronomi': { bg: 'rgba(68,68,65,0.15)', text: '#888780' },
  'Tıp': { bg: 'rgba(212,83,126,0.15)', text: '#D4537E' },
  'Biyoloji': { bg: 'rgba(29,158,117,0.15)', text: '#1D9E75' },
  'Matematik': { bg: 'rgba(226,75,74,0.15)', text: '#e24b4a' },
  'Felsefe': { bg: 'rgba(83,74,183,0.15)', text: '#7F77DD' },
  'Teknoloji': { bg: 'rgba(24,95,165,0.15)', text: '#185fa5' },
  'Tarih': { bg: 'rgba(83,74,183,0.15)', text: '#7F77DD' },
  default: { bg: 'rgba(29,158,117,0.15)', text: '#1D9E75' },
}

function getColor(cat: string) { return CAT_COLORS[cat] || CAT_COLORS.default }

function Badge({ category }: { category: string }) {
  const c = getColor(category)
  return (
    <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: c.bg, color: c.text }}>
      {category}
    </span>
  )
}

function CoverArea({ post, height }: { post: Post; height: string }) {
  if (post.youtubeId) {
    return (
      <div className={`${height} relative overflow-hidden`}>
        <img src={`https://img.youtube.com/vi/${post.youtubeId}/hqdefault.jpg`}
          alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(0,0,0,0.4),transparent 50%)' }} />
        <div className="absolute top-3 right-3 z-10">
          <span className="text-xs font-semibold px-2 py-1 rounded-md text-white" style={{ background: 'rgba(255,0,0,0.9)' }}>
            📺 YouTube
          </span>
        </div>
        <div className="absolute top-3 left-3 z-10"><Badge category={post.category} /></div>
      </div>
    )
  }
  if (post.coverImage) {
    return (
      <div className={`${height} relative overflow-hidden`}>
        <img src={post.coverImage} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute top-3 left-3 z-10"><Badge category={post.category} /></div>
      </div>
    )
  }
  const color = getColor(post.category)
  return (
    <div className={`${height} flex items-center justify-center text-7xl relative overflow-hidden bg-gradient-to-br ${post.bgGradient}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 rounded-full blur-3xl opacity-30" style={{ background: color.text }} />
      </div>
      <span className="relative z-10 transition-transform duration-500 group-hover:scale-110">{post.coverEmoji}</span>
      <div className="absolute top-3 left-3 z-10"><Badge category={post.category} /></div>
    </div>
  )
}

export default function PostCard({ post, size = 'md' }: Props) {
  if (size === 'lg') {
    return (
      <Link href={`/blog/${post.slug}`}>
        <article className="card-lift rounded-2xl overflow-hidden group cursor-pointer h-full flex flex-col" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <CoverArea post={post} height="h-48" />
          <div className="p-6 flex-1 flex flex-col">
            <h2 className="text-xl font-semibold leading-snug mb-3 group-hover:text-green-500 transition-colors line-clamp-2" style={{ color: 'var(--text)' }}>
              {post.title}
            </h2>
            <p className="text-sm leading-relaxed mb-4 line-clamp-2 flex-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
              {post.excerpt}
            </p>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <UserAvatar user={post.author as any} size={24} />
              <span className="font-medium" style={{ color: 'var(--text)' }}>@{(post.author as any).username || post.author.name}</span>
              <span>·</span><span>{timeAgo(post.publishedAt)}</span>
              {post.readTime && <><span>·</span><span>{post.readTime} dk</span></>}
            </div>
          </div>
        </article>
      </Link>
    )
  }

  if (size === 'sm') {
    return (
      <Link href={`/blog/${post.slug}`}>
        <article className="card-lift rounded-xl overflow-hidden flex group cursor-pointer" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="w-20 min-w-20 relative">
            {post.youtubeId ? (
              <img src={`https://img.youtube.com/vi/${post.youtubeId}/default.jpg`} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className={`absolute inset-0 flex items-center justify-center text-3xl bg-gradient-to-br ${post.bgGradient}`}>
                {post.coverEmoji}
              </div>
            )}
          </div>
          <div className="p-4 flex-1 min-w-0">
            <Badge category={post.category} />
            <h3 className="text-sm font-semibold leading-snug mt-1.5 mb-1 line-clamp-2 group-hover:text-green-500 transition-colors" style={{ color: 'var(--text)' }}>
              {post.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              <UserAvatar user={post.author as any} size={18} />
              <span>@{(post.author as any).username || post.author.name}</span>
              <span className="ml-auto">👁 {formatNum(post.viewCount)}</span>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="card-lift rounded-xl overflow-hidden group cursor-pointer h-full flex flex-col" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <CoverArea post={post} height="h-36" />
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="font-semibold leading-snug mb-2 line-clamp-2 group-hover:text-green-500 transition-colors" style={{ color: 'var(--text)' }}>
            {post.title}
          </h3>
          <p className="text-sm leading-relaxed line-clamp-2 flex-1 mb-4" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
            {post.excerpt}
          </p>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <UserAvatar user={post.author as any} size={20} />
            <span>@{(post.author as any).username || post.author.name}</span>
            {post.readTime && <><span>·</span><span>{post.readTime} dk</span></>}
          </div>
        </div>
      </article>
    </Link>
  )
}
