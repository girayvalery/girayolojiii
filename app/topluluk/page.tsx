'use client'
import { useState } from 'react'
import { useToast } from '@/components/ui/Toast'

export default function ToplulukPage() {
  const { show } = useToast()
  const [tab, setTab] = useState<'feedback'|'guidelines'|'community'>('feedback')
  const [form, setForm] = useState({ type: 'oneri', subject: '', message: '', email: '' })
  const [submitting, setSubmitting] = useState(false)

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
      } else show('error', 'Gönderilemedi, tekrar dene')
    } catch { show('error', 'Bağlantı hatası') }
    setSubmitting(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold mb-3" style={{ color: 'var(--text)' }}>👥 Topluluk</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Birlikte daha iyi olalım</p>
      </div>

      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        {([
          { key: 'feedback' as const, icon: '💌', label: 'İstek & Şikayet' },
          { key: 'guidelines' as const, icon: '📜', label: 'Kurallar' },
          { key: 'community' as const, icon: '🌐', label: 'Topluluk' },
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

      {tab === 'feedback' && (
        <form onSubmit={handleSubmit} className="rounded-2xl p-6 space-y-4 max-w-2xl mx-auto" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Tür</label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { key: 'oneri', icon: '💡', label: 'Öneri' },
                { key: 'sikayet', icon: '⚠️', label: 'Şikayet' },
                { key: 'hata', icon: '🐛', label: 'Hata' },
              ]).map(t => (
                <button key={t.key} type="button" onClick={() => setForm({...form, type: t.key})}
                  className="py-3 rounded-xl text-sm font-medium"
                  style={{
                    background: form.type === t.key ? 'rgba(29,158,117,0.15)' : 'var(--bg-subtle)',
                    color: form.type === t.key ? '#1D9E75' : 'var(--text-muted)',
                    border: form.type === t.key ? '2px solid #1D9E75' : '2px solid transparent',
                  }}>
                  <div className="text-2xl mb-1">{t.icon}</div>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Konu *</label>
            <input type="text" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required maxLength={100}
              placeholder="Kısa başlık" className="auth-input" />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Mesaj *</label>
            <textarea rows={6} value={form.message} onChange={e => setForm({...form, message: e.target.value})} required minLength={10}
              placeholder="Detaylarını yaz..." className="auth-input resize-none" style={{ fontFamily: 'var(--font-body)' }} />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>E-posta (opsiyonel)</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
              placeholder="Cevap istiyorsan e-posta bırak" className="auth-input" />
          </div>

          <button type="submit" disabled={submitting} className="w-full py-3 rounded-xl text-sm font-semibold text-white" style={{ background: '#1D9E75' }}>
            {submitting ? 'Gönderiliyor...' : 'Gönder'}
          </button>
        </form>
      )}

      {tab === 'guidelines' && (
        <div className="rounded-2xl p-8 max-w-2xl mx-auto" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text)' }}>📜 Topluluk Kuralları</h2>
          <ul className="space-y-3 text-sm" style={{ color: 'var(--text-muted)' }}>
            <li>✅ Saygılı ol — herkes farklı bakış açılarına sahip</li>
            <li>✅ Bilimsel kaynaklar göster — iddialarını destekle</li>
            <li>✅ Yapıcı ol — eleştiri eleştiri için olmasın</li>
            <li>❌ Hakaret, ayrımcılık, nefret söylemi yasak</li>
            <li>❌ Spam ve reklam yasak</li>
            <li>❌ Telif ihlali yasak — kaynaklara saygı</li>
          </ul>
        </div>
      )}

      {tab === 'community' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {[
            { icon: '📺', title: 'YouTube', desc: '@Girayoloji', link: 'https://youtube.com/@Girayoloji' },
            { icon: '💌', title: 'E-posta', desc: 'iletisim@girayoloji.com', link: 'mailto:iletisim@girayoloji.com' },
            { icon: '📱', title: 'Instagram', desc: '@girayoloji', link: '#' },
            { icon: '🐦', title: 'Twitter', desc: '@girayoloji', link: '#' },
          ].map(c => (
            <a key={c.title} href={c.link} target="_blank" rel="noopener noreferrer"
              className="rounded-2xl p-5 hover:scale-[1.02] transition-all"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="text-3xl mb-2">{c.icon}</div>
              <div className="font-semibold" style={{ color: 'var(--text)' }}>{c.title}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{c.desc}</div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
