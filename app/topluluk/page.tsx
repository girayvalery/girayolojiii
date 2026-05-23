'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useToast } from '@/components/ui/Toast'
import UserAvatar from '@/components/avatar/UserAvatar'

export default function ToplulukPage() {
  const { show } = useToast()
  const [tab, setTab] = useState<'members'|'feedback'|'guidelines'>('members')
  const [form, setForm] = useState({ type: 'oneri', subject: '', message: '', email: '' })
  const [submitting, setSubmitting] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/db/users', { cache: 'no-store' }).then(r => r.json()).catch(() => []),
      fetch('/api/db/posts', { cache: 'no-store' }).then(r => r.json()).catch(() => []),
    ]).then(([u, p]) => {
      if (Array.isArray(u)) setUsers(u)
      if (Array.isArray(p)) setPosts(p)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        show('success', 'Geri bildirimin alındı, teşekkürler!')
        setForm({ type: 'oneri', subject: '', message: '', email: '' })
      } else show('error', 'Gönderilemedi')
    } catch { show('error', 'Bağlantı hatası') }
    setSubmitting(false)
  }

  // Kullanıcılar - post sayısı ile zenginleştir
  const postCount: Record<string, number> = {}
  posts.forEach((p: any) => { if (p.author?.id) postCount[p.author.id] = (postCount[p.author.id] || 0) + 1 })
  const enriched = users.map(u => ({ ...u, postCount: postCount[u.id] || 0 }))
  const filtered = search.trim()
    ? enriched.filter(u =>
        (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.username || '').toLowerCase().includes(search.toLowerCase()))
    : enriched
  const sorted = filtered.sort((a, b) => b.postCount - a.postCount)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--text)' }}>👥 Topluluk</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Üyeler, kurallar ve geri bildirimler</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { key: 'members' as const, icon: '👥', label: `Üyeler (${users.length})` },
          { key: 'feedback' as const, icon: '💌', label: 'Geri Bildirim' },
          { key: 'guidelines' as const, icon: '📋', label: 'Topluluk Kuralları' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap"
            style={{
              background: tab === t.key ? '#1D9E75' : 'var(--bg-subtle)',
              color: tab === t.key ? '#fff' : 'var(--text-muted)',
            }}>{t.icon} {t.label}</button>
        ))}
      </div>

      {tab === 'members' && (
        <>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Üye ara..."
            className="auth-input mb-6 max-w-md" />

          {sorted.length === 0 ? (
            <p className="text-center py-10" style={{ color: 'var(--text-muted)' }}>Üye bulunamadı</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sorted.map(u => (
                <Link key={u.id} href={`/profile/${u.id}`}
                  className="flex items-center gap-3 p-4 rounded-2xl hover:scale-[1.02] transition-all"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <UserAvatar user={u} size={48} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{u.name}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>@{u.username}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>📝 {u.postCount} yazı</p>
                  </div>
                  {u.role === 'ADMIN' && <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0" style={{ background: '#1D9E75', color: '#fff' }}>Admin</span>}
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'feedback' && (
        <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>💌 Geri Bildirim Gönder</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Tür</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="auth-input">
                <option value="oneri">💡 Öneri</option>
                <option value="hata">🐛 Hata bildirimi</option>
                <option value="sikayet">⚠️ Şikayet</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Konu</label>
              <input type="text" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required className="auth-input" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Mesajın</label>
              <textarea rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})} required className="auth-input resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>E-posta (cevap için)</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="auth-input" />
            </div>
            <button type="submit" disabled={submitting} className="w-full py-3 rounded-xl text-sm font-semibold text-white" style={{ background: '#1D9E75' }}>
              {submitting ? 'Gönderiliyor...' : 'Gönder'}
            </button>
          </form>
        </div>
      )}

      {tab === 'guidelines' && (
        <div className="rounded-2xl p-8 space-y-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>📋 Topluluk Kuralları</h2>
          <ul className="space-y-3 text-sm" style={{ color: 'var(--text-muted)' }}>
            <li>✓ <strong style={{ color: 'var(--text)' }}>Saygılı ol:</strong> Yapıcı eleştiri her zaman hoş karşılanır, hakaret değil.</li>
            <li>✓ <strong style={{ color: 'var(--text)' }}>Telif hakkına saygı:</strong> Başkasının içeriğini kaynak göstermeden paylaşma.</li>
            <li>✓ <strong style={{ color: 'var(--text)' }}>Doğru bilgi:</strong> Bilim ve gerçekleri öne çıkar, manipülasyon değil.</li>
            <li>✓ <strong style={{ color: 'var(--text)' }}>Topluluk için:</strong> İçeriğin başkalarına değer katsın.</li>
            <li>✓ <strong style={{ color: 'var(--text)' }}>Spam yapma:</strong> Tekrarlayan içerik veya reklam paylaşımı yasak.</li>
          </ul>
        </div>
      )}
    </div>
  )
}
