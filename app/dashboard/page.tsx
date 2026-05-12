'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState<any[]>([])
  const [stats, setStats] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const user = session?.user as any

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/auth/login?callbackUrl=/dashboard')
    if (status === 'authenticated' && user?.id) {
      Promise.all([
        fetch('/api/db/posts', { cache: 'no-store' }).then(r => r.json()).catch(() => []),
        fetch(`/api/achievements?userId=${user.id}`, { cache: 'no-store' }).then(r => r.json()).catch(() => ({})),
      ]).then(([allPosts, ach]) => {
        const myPosts = Array.isArray(allPosts) ? allPosts.filter((p: any) => p.author?.id === user.id) : []
        setPosts(myPosts)
        setStats(ach.stats || {})
        setLoading(false)
      })
    }
  }, [status, user, router])

  if (status === 'loading' || loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>

  const totalViews = posts.reduce((s, p) => s + (p.viewCount || 0), 0)
  const totalLikes = posts.reduce((s, p) => s + (p.likeCount || 0), 0)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-1" style={{ color: 'var(--text)' }}>📊 İstatistiklerim</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>İçeriklerinin performansı</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Yayında Yazı', value: posts.length, icon: '📝', color: '#1D9E75' },
          { label: 'Toplam Görüntülenme', value: totalViews.toLocaleString('tr-TR'), icon: '👁', color: '#185fa5' },
          { label: 'Toplam Beğeni', value: totalLikes.toLocaleString('tr-TR'), icon: '❤️', color: '#e24b4a' },
          { label: 'Takipçi', value: stats.followers || 0, icon: '👥', color: '#534AB7' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-3xl font-semibold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Yazılarım</h2>
      {posts.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: 'var(--bg-card)' }}>
          <div className="text-5xl mb-3">📝</div>
          <p className="font-semibold mb-2" style={{ color: 'var(--text)' }}>Henüz yazın yok</p>
          <Link href="/katkida-bulun" className="inline-block px-5 py-2 rounded-full text-sm font-semibold text-white mt-2" style={{ background: '#1D9E75' }}>İlk yazını yaz →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(p => (
            <div key={p._id || p.id} className="rounded-xl p-4 flex items-center gap-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: 'var(--bg-subtle)' }}>{p.coverEmoji || '📝'}</div>
              <div className="flex-1 min-w-0">
                <Link href={`/blog/${p.slug}`} className="text-sm font-semibold hover:text-green-500 line-clamp-1" style={{ color: 'var(--text)' }}>{p.title}</Link>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{formatDate(p.publishedAt)} · {p.category}</p>
              </div>
              <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>👁 {p.viewCount || 0}</span>
                <span>❤️ {p.likeCount || 0}</span>
              </div>
              <Link href={`/blog/${p.slug}/edit`} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: 'rgba(29,158,117,0.1)', color: '#1D9E75' }}>Düzenle</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
