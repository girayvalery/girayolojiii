import { notFound } from 'next/navigation'
import Link from 'next/link'
import RelatedReelBanner from '@/components/blog/RelatedReelBanner'
import type { Metadata } from 'next'
import { getDb } from '@/lib/mongodb'
import { POSTS as fallbackPosts, type Post } from '@/lib/data'
import PostCard from '@/components/PostCard'
import ThreadedComments from '@/components/comments/ThreadedComments'
import ArticleInteractions from '@/components/comments/ArticleInteractions'
import TableOfContents from '@/components/blog/TableOfContents'
import Newsletter from '@/components/Newsletter'
import ReadTracker from '@/components/blog/ReadTracker'
import EditPostButton from '@/components/blog/EditPostButton'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getPost(slug: string): Promise<Post | null> {
  try {
    const db = await getDb()
    const d = await db.collection('posts').findOne({ slug })
    if (d) {
      return {
        id: d.id || d._id?.toString() || '',
        slug: d.slug, title: d.title, excerpt: d.excerpt || '',
        content: d.content || '', category: d.category || 'Bilim',
        tags: d.tags || [], readTime: d.readTime || 5,
        coverEmoji: d.coverEmoji || '📝', bgGradient: d.bgGradient || 'from-gray-800 to-gray-900',
        featured: !!d.featured, status: d.status || 'PUBLISHED',
        viewCount: d.viewCount || 0, likeCount: d.likeCount || 0,
        publishedAt: d.publishedAt || new Date().toISOString(),
        coverImage: d.coverImage, youtubeId: d.youtubeId, relatedReelId: d.relatedReelId,
        author: d.author || { id: 'anon', name: 'Anonim', username: 'anon', avatar: '👤', avatarColor: '#1D9E75' },
      }
    }
  } catch {}
  return fallbackPosts.find(p => p.slug === slug) || null
}

async function getRelated(post: Post, n = 6): Promise<Post[]> {
  try {
    const db = await getDb()
    const same = await db.collection('posts').find({ status: 'PUBLISHED', category: post.category, slug: { $ne: post.slug } }).limit(3).toArray()
    const diff = await db.collection('posts').find({ status: 'PUBLISHED', category: { $ne: post.category }, slug: { $ne: post.slug } }).limit(3).toArray()
    return [...same, ...diff].slice(0, n).map((d: any) => ({
      id: d.id || d._id?.toString() || '',
      slug: d.slug, title: d.title, excerpt: d.excerpt || '', content: d.content || '',
      category: d.category, tags: d.tags || [], readTime: d.readTime || 5,
      coverEmoji: d.coverEmoji || '📝', bgGradient: d.bgGradient || 'from-gray-800 to-gray-900',
      featured: !!d.featured, status: d.status, viewCount: d.viewCount || 0, likeCount: d.likeCount || 0,
      publishedAt: d.publishedAt, coverImage: d.coverImage, youtubeId: d.youtubeId, relatedReelId: d.relatedReelId,
      author: d.author || { id: 'anon', name: 'Anonim', username: 'anon', avatar: '👤', avatarColor: '#1D9E75' },
    }))
  } catch { return [] }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug)
  if (!post) return { title: 'Yazı bulunamadı' }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: 'article', publishedTime: post.publishedAt, authors: [post.author.name], tags: post.tags },
    twitter: { card: 'summary_large_image', title: post.title, description: post.excerpt },
  }
}

function slugifyHeading(text: string): string {
  return text.toLowerCase()
    .replace(/[ğ]/g, 'g').replace(/[ü]/g, 'u').replace(/[ş]/g, 's')
    .replace(/[ı]/g, 'i').replace(/[ö]/g, 'o').replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function renderContent(content: string) {
  // Önce paragraflara böl (\n\n veya tek \n iki kere ardarda)
  const blocks = content.split(/\n\s*\n/)
  return blocks.map((block, i) => {
    const trimmed = block.trim()
    if (!trimmed) return null

    // Başlık
    if (trimmed.startsWith('### ')) {
      const text = trimmed.slice(4)
      return <h3 key={i} className="text-lg font-semibold mt-6 mb-3" style={{ color: 'var(--text)' }}>{text}</h3>
    }
    if (trimmed.startsWith('## ')) {
      const text = trimmed.slice(3)
      return (
        <h2 key={i} id={slugifyHeading(text)} className="text-2xl font-semibold mt-10 mb-4 scroll-mt-20" style={{ color: '#1D9E75' }}>
          {text}
        </h2>
      )
    }
    if (trimmed.startsWith('# ')) {
      const text = trimmed.slice(2)
      return <h1 key={i} className="text-3xl font-bold mt-12 mb-6" style={{ color: 'var(--text)' }}>{text}</h1>
    }

    // Liste
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items = trimmed.split('\n').filter(l => l.startsWith('- ') || l.startsWith('* '))
      return (
        <ul key={i} className="mb-6 list-disc pl-6 space-y-2" style={{ color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: '1.05rem' }}>
          {items.map((it, j) => <li key={j}>{it.slice(2)}</li>)}
        </ul>
      )
    }

    // Numara listesi
    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split('\n').filter(l => /^\d+\.\s/.test(l))
      return (
        <ol key={i} className="mb-6 list-decimal pl-6 space-y-2" style={{ color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: '1.05rem' }}>
          {items.map((it, j) => <li key={j}>{it.replace(/^\d+\.\s/, '')}</li>)}
        </ol>
      )
    }

    // Bold
    const withBold = trimmed.split(/(\*\*[^*]+\*\*)/).map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j} style={{ color: 'var(--text)' }}>{part.slice(2, -2)}</strong>
      }
      return part
    })

    // Tek \n'leri <br> ile koru
    const lines = trimmed.split('\n')
    return (
      <p key={i} className="mb-6 leading-relaxed whitespace-pre-line" style={{ color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: '1.05rem', lineHeight: '1.9' }}>
        {lines.length > 1 ? lines.join('\n') : withBold}
      </p>
    )
  }).filter(Boolean)
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  const recommended = await getRelated(post, 6)

  return (
    <article className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
      <ReadTracker postId={post.id || post.slug} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
        <div>
          <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            <Link href="/" className="hover:text-green-500">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-green-500">Bloglar</Link>
            <span>/</span>
            <span style={{ color: 'var(--text)' }} className="truncate max-w-xs">{post.title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ background: 'rgba(29,158,117,0.15)', color: '#1D9E75' }}>{post.category}</span>
            {post.tags.map(t => <Link key={t} href={`/blog?tag=${t}`} className="text-xs px-2.5 py-1 rounded-full border" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>#{t}</Link>)}
            <div className="ml-auto"><EditPostButton postId={post.id} authorId={post.author.id} /></div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-6" style={{ color: 'var(--text)' }}>{post.title}</h1>

          <Link href={`/profile/${post.author.id}`}>
            <div className="flex items-center gap-3 mb-6 pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ background: `${post.author.avatarColor}22` }}>{post.author.avatar}</div>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{post.author.name}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatDate(post.publishedAt)} · {post.readTime} dk · 👁 {post.viewCount}</p>
              </div>
            </div>
          </Link>

          <ArticleInteractions postId={post.id} initialLikes={post.likeCount} />

          {/* Kısa video kısayolu */}
          {(post as any).relatedReelId && <RelatedReelBanner reelId={(post as any).relatedReelId} />}

          {post.youtubeId ? (
            <div className="mb-10">
              <div className="relative w-full rounded-2xl overflow-hidden" style={{ paddingBottom: '56.25%', background: '#000' }}>
                <iframe src={`https://www.youtube.com/embed/${post.youtubeId}`} title={post.title}
                  className="absolute inset-0 w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
              <div className="flex items-center justify-between mt-3 px-1">
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>🎬 Bu yazının video versiyonu</p>
                <a href={`https://www.youtube.com/watch?v=${post.youtubeId}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white" style={{ background: '#FF0000' }}>YouTube'da Aç →</a>
              </div>
            </div>
          ) : post.coverImage ? (
            <img src={post.coverImage} alt={post.title} className="w-full h-64 object-cover rounded-2xl mb-10" />
          ) : (
            <div className={`w-full h-64 rounded-2xl flex items-center justify-center text-8xl mb-10 relative overflow-hidden bg-gradient-to-br ${post.bgGradient}`}>
              <span>{post.coverEmoji}</span>
            </div>
          )}

          <div className="mb-10">{renderContent(post.content)}</div>

          <div className="py-6 mb-8" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            <ArticleInteractions postId={post.id} initialLikes={post.likeCount} />
          </div>

          <ThreadedComments postId={post.id} />

          {recommended.length > 0 && (
            <section className="mt-16">
              <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text)' }}>Benzer Makaleler</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {recommended.map(p => <PostCard key={p.id} post={p} size="md" />)}
              </div>
            </section>
          )}

          {/* Newsletter en alta — Footer'ın üstünde */}
          <div className="my-12">
            <Newsletter />
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-4">
            <TableOfContents content={post.content} />

            {post.tags.length > 0 && (
              <div className="rounded-xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Etiketler</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(t => <Link key={t} href={`/blog?tag=${t}`} className="text-xs px-3 py-1.5 rounded-full border" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>#{t}</Link>)}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </article>
  )
}
