'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/components/ui/Toast'
import { formatDate } from '@/lib/utils'

export default function OkumaListesiPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { show } = useToast()
  const [saves, setSaves] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/auth/login?callbackUrl=/okuma-listesi')
    if (status === 'authenticated') {
      fetch('/api/saves', { cache: 'no-store' })
        .then(r => r.json())
        .then(d => { setSaves(d.saves || []); setLoading(false) })
        .catch(() => setLoading(false))
    }
  }, [status, router])

  async function removeSave(postId: string) {
    try {
      await fetch('/api/saves', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      })
      setSaves(p => p.filter(s => s.postId !== postId))
      show('success', 'Kayıt listesinden çıkarıldı')
    } catch { show('error', 'İşlem başarısız') }
  }

  if (status === 'loading' || loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--text)' }}>🔖 Okuma Listem</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{saves.length} kaydedilmiş yazı</p>
      </div>

      {saves.length === 0 ? (
        <div className="text-center py-20 rounded-2xl" style={{ background: 'var(--bg-card)' }}>
          <div className="text-6xl mb-3">📭</div>
          <p className="font-semibold mb-2" style={{ color: 'var(--text)' }}>Henüz hiç yazı kaydetmedin</p>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Beğendiğin yazıları "📑 Kaydet" butonu ile buraya ekleyebilirsin</p>
          <Link href="/blog" className="inline-block px-5 py-2 rounded-full text-sm font-semibold text-white" style={{ background: '#1D9E75' }}>Yazılara Göz At →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {saves.map(s => (
            <div key={s._id} className="rounded-xl p-4 flex items-center gap-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: 'var(--bg-subtle)' }}>
                {s.coverEmoji || '📝'}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/blog/${s.postSlug}`} className="text-sm font-semibold hover:text-green-500 line-clamp-1" style={{ color: 'var(--text)' }}>
                  {s.postTitle}
                </Link>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{formatDate(s.createdAt)} tarihinde kaydedildi</p>
              </div>
              <button onClick={() => removeSave(s.postId)} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: 'rgba(226,75,74,0.1)', color: '#e24b4a' }}>Kaldır</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
