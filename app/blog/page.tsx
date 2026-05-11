import Link from 'next/link'
import PostCard from '@/components/PostCard'
import { getDb } from '@/lib/mongodb'
import { POSTS as fallbackPosts, type Post } from '@/lib/data'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function fetchPosts(): Promise<Post[]> {
  try {
    const db = await getDb()
    const docs = await db.collection('posts').find({ status: 'PUBLISHED' }).sort({ publishedAt: -1 }).toArray()
    if (docs.length === 0) return fallbackPosts.filter(p => p.status === 'PUBLISHED')
    return docs.map((d: any) => ({
      id: d.id || d._id?.toString() || '',
      slug: d.slug,
      title: d.title,
      excerpt: d.excerpt || '',
      content: d.content || '',
      category: d.category || 'Bilim',
      tags: d.tags || [],
      readTime: d.readTime || 5,
      coverEmoji: d.coverEmoji || '📝',
      bgGradient: d.bgGradient || 'from-gray-800 to-gray-900',
      featured: !!d.featured,
      status: d.status || 'PUBLISHED',
      viewCount: d.viewCount || 0,
      likeCount: d.likeCount || 0,
      publishedAt: d.publishedAt || new Date().toISOString(),
      coverImage: d.coverImage,
      youtubeId: d.youtubeId,
      author: d.author || { id: 'anon', name: 'Anonim', username: 'anon', avatar: '👤', avatarColor: '#1D9E75' },
    }))
  } catch (e) {
    console.error('Blog fetch error:', e)
    return fallbackPosts.filter(p => p.status === 'PUBLISHED')
  }
}

export default async function BlogPage() {
  const posts = await fetchPosts()

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-3" style={{ color: 'var(--text)' }}>📚 Tüm Yazılar</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{posts.length} makale</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 rounded-2xl" style={{ background: 'var(--bg-card)' }}>
          <div className="text-6xl mb-3">📭</div>
          <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>Henüz yazı yok</p>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>İlk yazıyı sen ekle!</p>
          <Link href="/katkida-bulun?type=post" className="px-5 py-2.5 rounded-full text-sm font-semibold text-white inline-block" style={{ background: '#1D9E75' }}>
            Yazı Ekle →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map(post => <PostCard key={post.id} post={post} size="md" />)}
        </div>
      )}
    </div>
  )
}
