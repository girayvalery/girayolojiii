'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)
    const res = await signIn('credentials', { email, password, redirect: false })
    if (res?.error) { setError('E-posta veya şifre hatalı.'); setLoading(false) }
    else router.push('/')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--text)' }}>Girayoloji'ye Giriş</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Hoş geldin, devam edelim.</p>
        </div>
        <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          {error && <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(226,75,74,0.1)', color: '#e24b4a' }}>⚠️ {error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>E-posta</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="auth-input" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Şifre</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="auth-input" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2" style={{ background: '#1D9E75' }}>
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap →'}
            </button>
          </form>
          <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-muted)' }}>
            Hesabın yok mu? <Link href="/auth/register" style={{ color: '#1D9E75' }}>Üye ol</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
