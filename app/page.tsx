import Link from 'next/link'
import { getDb } from '@/lib/mongodb'
import { POSTS as fallbackPosts, type Post } from '@/lib/data'
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

export default async function Home() {
  const posts = await fetchPosts()
  // Featured üstte, kalan akış olarak — yeniden eskiye sıralı
  const featured = posts.filter(p => p.featured).slice(0, 6)
  const feed = posts // tümü, yeniden eskiye

  return (
    <>
      <HeroSection />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_280px] gap-6">
          <aside className="hidden lg:block"><LeftSidebar /></aside>

          <div className="space-y-6 min-w-0">
            <StoriesBar />

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
