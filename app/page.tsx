import Link from 'next/link'
import { getDb } from '@/lib/mongodb'
import { POSTS as fallbackPosts, getAllReels, type Post } from '@/lib/data'
import StoriesBar from '@/components/stories/StoriesBar'
import FeaturedCarousel from '@/components/feed/FeaturedCarousel'
import FeedItem from '@/components/feed/FeedItem'
import LeftSidebar from '@/components/layout/LeftSidebar'
import RightSidebar from '@/components/layout/RightSidebar'
import HeroSection from '@/components/home/HeroSection'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function fetchPosts(): Promise<Post[]> {
  try {
    const db = await getDb()
    const docs = await db.collection('posts').find({ status: 'PUBLISHED' }).sort({ publishedAt: -1 }).toArray()
    if (docs.length === 0) return fallbackPosts
    return docs.map((d: any) => ({
      id: d.id || d._id?.toString() || '',
      slug: d.slug, title: d.title, excerpt: d.excerpt || '',
      content: d.content || '', category: d.category || 'Bilim',
      tags: d.tags || [], readTime: d.readTime || 5,
      coverEmoji: d.coverEmoji || '📝', bgGradient: d.bgGradient || 'from-gray-800 to-gray-900',
      featured: !!d.featured, status: d.status || 'PUBLISHED',
      viewCount: d.viewCount || 0, likeCount: d.likeCount || 0,
      publishedAt: d.publishedAt || new Date().toISOString(),
      coverImage: d.coverImage, youtubeId: d.youtubeId,
      author: d.author || { id: 'anon', name: 'Anonim', username: 'anon', avatar: '👤', avatarColor: '#1D9E75' },
    }))
  } catch {
    return fallbackPosts
  }
}

async function fetchReels() {
  try {
    const db = await getDb()
    const docs = await db.collection('reels').find({}).sort({ publishedAt: -1 }).limit(8).toArray()
    if (docs.length > 0) return docs
  } catch {}
  return getAllReels().slice(0, 8)
}

export default async function Home() {
  const posts = await fetchPosts()
  const reels = await fetchReels()
  const featured = posts.filter(p => p.featured).slice(0, 6)
  const feed = posts

  return (
    <>
      <HeroSection />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_280px] gap-6">
          <aside className="hidden lg:block"><LeftSidebar /></aside>

          <div className="space-y-6 min-w-0">
            {/* Hikayeler - kendi paneli */}
            <StoriesBar />

            {/* Kısa Videolar - kendi paneli */}
            {reels.length > 0 && (
              <section className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-semibold flex items-center gap-2" style={{ color: 'var(--text)' }}>
                    <span style={{ color: '#1D9E75' }}>|</span> ⚡ Kısa Videolar
                  </h2>
                  <Link href="/reels" className="text-xs font-medium" style={{ color: '#1D9E75' }}>Tümü →</Link>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                  {reels.map((r: any) => (
                    <Link key={r.id || r._id} href={`/reels?id=${r.id || r._id}`} className="shrink-0 w-32 rounded-xl overflow-hidden hover:scale-105 transition-all" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                      <div className={`relative h-44 flex items-center justify-center text-5xl bg-gradient-to-b ${r.bgGradient || 'from-purple-900 to-purple-700'}`}>
                        {r.emoji || '⚡'}
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-medium line-clamp-2" style={{ color: 'var(--text)' }}>{r.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Featured - öne çıkanlar */}
            {featured.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-semibold flex items-center gap-2" style={{ color: 'var(--text)' }}>
                    <span style={{ color: '#1D9E75' }}>|</span> Öne Çıkan
                  </h2>
                  <Link href="/blog" className="text-xs font-medium" style={{ color: '#1D9E75' }}>Tümü →</Link>
                </div>
                <FeaturedCarousel posts={featured} />
              </section>
            )}

            {/* Akış - SADECE blog yazıları */}
            <section>
              <h2 className="text-base font-semibold flex items-center gap-2 mb-3" style={{ color: 'var(--text)' }}>
                <span style={{ color: '#1D9E75' }}>|</span> Akış
              </h2>
              <div className="space-y-4">
                {feed.length === 0 ? (
                  <div className="rounded-2xl p-10 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <div className="text-5xl mb-3">📭</div>
                    <p style={{ color: 'var(--text-muted)' }}>Henüz yazı yok</p>
                  </div>
                ) : feed.map(p => <FeedItem key={p.id} post={p} />)}
              </div>
            </section>
          </div>

          <aside className="hidden lg:block"><RightSidebar /></aside>
        </div>
      </div>
    </>
  )
}
