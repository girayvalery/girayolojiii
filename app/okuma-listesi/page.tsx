'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { getPublished } from '@/lib/data'
import PostCard from '@/components/PostCard'

export default function OkumaListesiPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tab, setTab] = useState<'saved'|'completed'|'collections'>('saved')

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/auth/login')
  }, [status, router])

  if (status === 'loading' || !session) {
    return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>
  }

  const allPosts = getPublished()
  const saved = allPosts.slice(0, 4)
  const completed = allPosts.slice(2, 5)

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🔖</div>
        <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--text)' }}>Okuma Listesi</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Kaydettiğin yazılar ve koleksiyonların</p>
      </div>

      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        {([
          { key: 'saved' as const, icon: '🔖', label: `Kaydedilenler (${saved.length})` },
          { key: 'completed' as const, icon: '✅', label: `Okudum (${completed.length})` },
          { key: 'collections' as const, icon: '📚', label: 'Koleksiyonlar' },
        ]).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="px-5 py-2 rounded-full text-sm font-medium"
            style={{
              background: tab === t.key ? '#1D9E75' : 'var(--bg-card)',
              color: tab === t.key ? '#fff' : 'var(--text-muted)',
              border: '1px solid var(--border)',
            }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'saved' && (
        saved.length === 0 ? (
          <div className="text-center py-20 rounded-2xl" style={{ background: 'var(--bg-card)' }}>
            <div className="text-6xl mb-3">📭</div>
            <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>Henüz yazı kaydetmedin</p>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Beğendiğin yazıları kaydet, sonra oku</p>
            <Link href="/blog" className="px-5 py-2.5 rounded-full text-sm font-semibold text-white inline-block" style={{ background: '#1D9E75' }}>
              Yazılara Göz At →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {saved.map(p => <PostCard key={p.id} post={p} size="md" />)}
          </div>
        )
      )}

      {tab === 'completed' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {completed.map(p => <PostCard key={p.id} post={p} size="md" />)}
        </div>
      )}

      {tab === 'collections' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Bilim Klasikleri', emoji: '🔬', count: 12, color: '#1D9E75' },
            { title: 'Felsefe Notları', emoji: '💭', count: 8, color: '#534AB7' },
            { title: 'Teknoloji Trendleri', emoji: '🚀', count: 15, color: '#185fa5' },
          ].map(c => (
            <div key={c.title} className="rounded-2xl p-6 cursor-pointer card-lift" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="text-4xl mb-3">{c.emoji}</div>
              <h3 className="font-semibold mb-1" style={{ color: 'var(--text)' }}>{c.title}</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.count} yazı</p>
            </div>
          ))}
          <button className="rounded-2xl p-6 border-2 border-dashed flex flex-col items-center justify-center gap-2"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', minHeight: 140 }}>
            <span className="text-3xl">+</span>
            <span className="text-sm font-medium">Yeni Koleksiyon</span>
          </button>
        </div>
      )}
    </div>
  )
}
