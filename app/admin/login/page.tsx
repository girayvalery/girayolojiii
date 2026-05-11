'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)
    setTimeout(() => {
      if (username === 'admin' && password === '1234') {
        document.cookie = 'admin_auth=true; path=/; max-age=86400'
        router.push('/admin')
      } else {
        setError('Kullanıcı adı veya şifre hatalı.')
        setLoading(false)
      }
    }, 500)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">⚡</div>
          <h1 className="text-2xl font-semibold" style={{ color: '#1D9E75' }}>Admin Paneli</h1>
        </div>
        <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <p className="text-xs mb-4 px-3 py-2 rounded-lg" style={{ background: 'rgba(29,158,117,0.1)', color: '#1D9E75' }}>
            💡 Kullanıcı: <strong>admin</strong> · Şifre: <strong>1234</strong>
          </p>
          {error && <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(226,75,74,0.1)', color: '#e24b4a' }}>⚠️ {error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Kullanıcı Adı</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="auth-input" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Şifre</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="auth-input" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2" style={{ background: '#1D9E75' }}>
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Doğrulanıyor...' : 'Giriş Yap →'}
            </button>
          </form>
        </div>
        <Link href="/" className="block text-center mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>← Ana Sayfaya Dön</Link>
      </div>
    </div>
  )
}
