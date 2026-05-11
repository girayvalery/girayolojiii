'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getPublished } from '@/lib/data'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [period, setPeriod] = useState<'7d'|'30d'|'all'>('30d')

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/auth/login')
  }, [status, router])

  if (status === 'loading' || !session) {
    return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>
  }

  const userId = (session.user as any)?.id
  const userPosts = getPublished().filter(p => p.author.id === userId).slice(0, 5)
  const totalViews = userPosts.reduce((s, p) => s + p.viewCount, 0)
  const totalLikes = userPosts.reduce((s, p) => s + p.likeCount, 0)

  // Mock chart data — son 30 gün
  const chartData = Array.from({ length: 30 }, (_, i) => Math.floor(Math.random() * 200) + 50)
  const maxVal = Math.max(...chartData)

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold mb-1" style={{ color: 'var(--text)' }}>📊 İstatistiklerim</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Yazılarının performansı</p>
        </div>
        <div className="flex gap-2">
          {([
            { key: '7d' as const, label: '7 Gün' },
            { key: '30d' as const, label: '30 Gün' },
            { key: 'all' as const, label: 'Tümü' },
          ]).map(p => (
            <button key={p.key} onClick={() => setPeriod(p.key)}
              className="px-4 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: period === p.key ? '#1D9E75' : 'var(--bg-card)',
                color: period === p.key ? '#fff' : 'var(--text-muted)',
                border: '1px solid var(--border)',
              }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Toplam Görüntülenme', value: totalViews.toLocaleString('tr-TR'), change: '+12%', icon: '👁', color: '#1D9E75' },
          { label: 'Toplam Beğeni', value: totalLikes.toLocaleString('tr-TR'), change: '+8%', icon: '❤️', color: '#e24b4a' },
          { label: 'Yayın Sayısı', value: userPosts.length, change: '+3', icon: '📝', color: '#534AB7' },
          { label: 'Takipçi Artışı', value: '+24', change: '+24%', icon: '👥', color: '#185fa5' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl">{s.icon}</div>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(29,158,117,0.15)', color: '#1D9E75' }}>{s.change}</span>
            </div>
            <div className="text-2xl font-semibold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-6 mb-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 className="text-sm font-semibold mb-5" style={{ color: 'var(--text)' }}>📈 Görüntülenme Grafiği (Son 30 gün)</h2>
        <div className="flex items-end gap-1 h-40">
          {chartData.map((val, i) => (
            <div key={i} className="flex-1 rounded-t transition-all hover:opacity-80 cursor-pointer relative group"
              style={{ background: '#1D9E75', height: `${(val / maxVal) * 100}%` }}>
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] opacity-0 group-hover:opacity-100 px-1.5 py-0.5 rounded whitespace-nowrap" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
                {val}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span>30 gün önce</span>
          <span>Bugün</span>
        </div>
      </div>

      <div className="rounded-2xl p-6 mb-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>🏆 En Çok Okunan Yazılarım</h2>
        {userPosts.length === 0 ? (
          <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
            <p className="text-sm mb-4">Henüz yayınlanmış yazın yok</p>
            <Link href="/katkida-bulun?type=post" className="px-5 py-2 rounded-full text-sm font-semibold text-white inline-block" style={{ background: '#1D9E75' }}>
              İlk Yazını Yaz →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {userPosts.map((post, i) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <div className="flex items-center gap-4 p-3 rounded-xl group cursor-pointer" style={{ background: 'var(--bg-subtle)' }}>
                  <span className="text-lg font-bold tabular-nums w-8" style={{ color: i < 3 ? '#1D9E75' : 'var(--text-muted)' }}>#{i + 1}</span>
                  <span className="text-2xl">{post.coverEmoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold line-clamp-1 group-hover:text-green-500" style={{ color: 'var(--text)' }}>{post.title}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{post.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>👁 {post.viewCount}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>❤️ {post.likeCount}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>💬 Son Yorumlar</h3>
          <div className="space-y-3">
            {[
              { user: 'Ekrem T.', avatar: '🌍', color: '#534AB7', text: 'Harika bir yazı, Çin Odası argümanı...', time: '2 sa önce' },
              { user: 'Selin A.', avatar: '🗣️', color: '#D85A30', text: 'Belki bilinç bir spektrumdur...', time: '5 sa önce' },
            ].map((c, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-subtle)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0" style={{ background: `${c.color}22` }}>{c.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text)' }}>{c.user}</p>
                  <p className="text-xs line-clamp-2" style={{ color: 'var(--text-muted)' }}>{c.text}</p>
                  <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{c.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>🎯 Hedefler</h3>
          <div className="space-y-4">
            {[
              { label: 'Aylık 5 yazı', current: 3, target: 5 },
              { label: '1000 takipçi', current: 720, target: 1000 },
              { label: '10K görüntülenme', current: totalViews, target: 10000 },
            ].map((g, i) => {
              const pct = Math.min(100, (g.current / g.target) * 100)
              return (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span style={{ color: 'var(--text)' }}>{g.label}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{g.current}/{g.target}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-subtle)' }}>
                    <div className="h-full rounded-full transition-all" style={{ background: '#1D9E75', width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
