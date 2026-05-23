'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, getSession } from 'next-auth/react'
import Link from 'next/link'
import AvatarBuilder from '@/components/profile/AvatarBuilder'
import { AvatarConfig, DEFAULT_AVATAR } from '@/lib/avatar'

type Step = 'form' | 'avatar'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('form')
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [newUserId, setNewUserId] = useState<string | null>(null)

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Kayıt başarısız')

      // Otomatik giriş
      const loginRes = await signIn('credentials', { email: form.email, password: form.password, redirect: false })
      if (loginRes?.ok) {
        const newSession = await getSession()
        const userId = (newSession?.user as any)?.id
        setNewUserId(userId)
        setStep('avatar')
        setLoading(false)
      } else {
        setError('Giriş yapılamadı.')
        setLoading(false)
      }
    } catch (err: any) {
      setError(err.message); setLoading(false)
    }
  }

  async function handleSaveAvatar(cfg: AvatarConfig) {
    try {
      await fetch('/api/db/me', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarConfig: cfg, photoUrl: '' }),
      })
      router.push(newUserId ? `/profile/${newUserId}` : '/')
      router.refresh()
    } catch {}
  }

  async function handleSavePhoto(url: string) {
    try {
      await fetch('/api/db/me', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoUrl: url }),
      })
      router.push(newUserId ? `/profile/${newUserId}` : '/')
      router.refresh()
    } catch {}
  }

  if (step === 'avatar') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--text)' }}>🎨 Karakterini Tasarla</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Kendine benzer bir karakter oluştur veya fotoğraf yükle</p>
          </div>
          <AvatarBuilder
            initial={DEFAULT_AVATAR}
            onSaveBitmoji={handleSaveAvatar}
            onSavePhoto={handleSavePhoto}
          />
          <div className="text-center mt-4">
            <button onClick={() => router.push(newUserId ? `/profile/${newUserId}` : '/')}
              className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Sonra Tasarlarım →
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--text)' }}>Üye Ol</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Topluluğa katıl, karakterini özelleştir</p>
        </div>
        <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          {error && <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(226,75,74,0.1)', color: '#e24b4a' }}>⚠️ {error}</div>}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Ad Soyad</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required minLength={2} placeholder="Adın Soyadın" className="auth-input" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Kullanıcı Adı</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-sm" style={{ color: 'var(--text-muted)' }}>@</span>
                <input type="text" value={form.username}
                  onChange={e => setForm({...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,'')})}
                  required minLength={3} placeholder="kullanici_adi" className="auth-input" style={{ paddingLeft: 32 }} />
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Sadece küçük harf, rakam ve _</p>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>E-posta</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required placeholder="ornek@email.com" className="auth-input" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Şifre</label>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required minLength={8} placeholder="En az 8 karakter" className="auth-input" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2" style={{ background: '#1D9E75' }}>
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Kayıt yapılıyor...' : 'Devam → Karakter Tasarla'}
            </button>
          </form>
        </div>
        <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
          Hesabın var mı? <Link href="/auth/login" className="font-semibold hover:underline" style={{ color: '#1D9E75' }}>Giriş yap</Link>
        </p>
      </div>
    </div>
  )
}
