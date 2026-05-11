'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/components/Providers'
import PhotoUpload from '@/components/upload/PhotoUpload'

const AVATAR_OPTIONS = ['🧑‍🚀','🧑‍🔬','🧑‍💻','🧑‍🎨','🌍','🗣️','🩺','🔭','⚙️','🧠','🎯','🌱']

export default function AyarlarPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const [tab, setTab] = useState<'profile'|'photo'|'password'|'preferences'|'notifications'|'privacy'>('profile')
  const [form, setForm] = useState({ name: '', username: '', bio: '', avatar: '👤', photoUrl: '' })
  const [pwd, setPwd] = useState({ current: '', new: '', confirm: '' })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/auth/login')
    if (session?.user) {
      const u = session.user as any
      setForm({
        name: u.name || '', username: u.username || '',
        bio: u.bio || '', avatar: u.avatar || '👤',
        photoUrl: u.photoUrl || '',
      })
    }
  }, [session, status, router])

  if (status === 'loading') return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!session) return null

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setMessage(''); setSaving(true)
    try {
      const res = await fetch('/api/db/me', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await update({ ...form })
      setMessage('Profil güncellendi! ✓')
    } catch (err: any) { setError(err.message) } finally { setSaving(false) }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setMessage(''); setSaving(true)
    if (pwd.new !== pwd.confirm) { setError('Yeni şifreler uyuşmuyor.'); setSaving(false); return }
    if (pwd.new.length < 8) { setError('Şifre en az 8 karakter olmalı.'); setSaving(false); return }
    try {
      const res = await fetch('/api/db/me', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: pwd.current, newPassword: pwd.new }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMessage('Şifre güncellendi! ✓')
      setPwd({ current: '', new: '', confirm: '' })
    } catch (err: any) { setError(err.message) } finally { setSaving(false) }
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        <aside>
          <div className="rounded-2xl p-3 lg:sticky lg:top-20" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-semibold uppercase tracking-wider px-3 mb-2" style={{ color: 'var(--text-muted)' }}>⚙️ Ayarlar</p>
            <ul className="space-y-0.5">
              {([
                { key: 'profile' as const, icon: '👤', label: 'Profil' },
                { key: 'photo' as const, icon: '📸', label: 'Fotoğraf' },
                { key: 'password' as const, icon: '🔒', label: 'Şifre' },
                { key: 'preferences' as const, icon: '🎨', label: 'Görünüm' },
                { key: 'notifications' as const, icon: '🔔', label: 'Bildirimler' },
                { key: 'privacy' as const, icon: '🛡️', label: 'Gizlilik' },
              ]).map(t => (
                <li key={t.key}>
                  <button onClick={() => { setTab(t.key); setError(''); setMessage('') }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left"
                    style={{ background: tab === t.key ? 'rgba(29,158,117,0.1)' : 'transparent', color: tab === t.key ? '#1D9E75' : 'var(--text-muted)' }}>
                    <span className="text-base w-5">{t.icon}</span>
                    {t.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div>
          {message && <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(29,158,117,0.1)', color: '#1D9E75' }}>{message}</div>}
          {error && <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(226,75,74,0.1)', color: '#e24b4a' }}>⚠️ {error}</div>}

          {tab === 'profile' && (
            <>
              <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text)' }}>👤 Profil Bilgileri</h1>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Adın, kullanıcı adın ve bio'n</p>
              <form onSubmit={saveProfile} className="rounded-2xl p-6 space-y-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Ad Soyad</label>
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="auth-input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Kullanıcı Adı</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-sm" style={{ color: 'var(--text-muted)' }}>@</span>
                    <input type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,'')})} required className="auth-input" style={{ paddingLeft: 32 }} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Biyografi</label>
                  <textarea rows={4} value={form.bio} maxLength={160} onChange={e => setForm({...form, bio: e.target.value})}
                    className="auth-input resize-none" style={{ fontFamily: 'var(--font-body)' }} />
                  <p className="text-xs mt-1 text-right" style={{ color: 'var(--text-muted)' }}>{form.bio.length}/160</p>
                </div>
                <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2" style={{ background: '#1D9E75' }}>
                  {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  💾 Kaydet
                </button>
              </form>
            </>
          )}

          {tab === 'photo' && (
            <>
              <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text)' }}>📸 Profil Fotoğrafı</h1>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Avatar veya gerçek fotoğraf</p>
              <form onSubmit={saveProfile} className="rounded-2xl p-6 space-y-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="text-center mb-4">
                  {form.photoUrl ? (
                    <img src={form.photoUrl} alt="Avatar" className="w-32 h-32 rounded-full object-cover mx-auto" style={{ border: '4px solid #1D9E7555' }} />
                  ) : (
                    <div className="w-32 h-32 rounded-full flex items-center justify-center text-7xl mx-auto" style={{ background: 'rgba(29,158,117,0.15)', border: '4px solid #1D9E7555' }}>{form.avatar}</div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>📸 Fotoğraf Yükle</label>
                  <PhotoUpload type="image" currentUrl={form.photoUrl} onUpload={(url) => setForm({...form, photoUrl: url})} maxSizeMB={5} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Veya Emoji</label>
                  <div className="grid grid-cols-6 gap-2">
                    {AVATAR_OPTIONS.map(emoji => (
                      <button key={emoji} type="button" onClick={() => setForm({...form, avatar: emoji, photoUrl: ''})}
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{
                          background: form.avatar === emoji && !form.photoUrl ? 'rgba(29,158,117,0.15)' : 'var(--bg-subtle)',
                          border: form.avatar === emoji && !form.photoUrl ? '2px solid #1D9E75' : '2px solid transparent',
                        }}>
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: '#1D9E75' }}>💾 Kaydet</button>
              </form>
            </>
          )}

          {tab === 'password' && (
            <>
              <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text)' }}>🔒 Şifre Değiştir</h1>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Hesabını güvende tut</p>
              <form onSubmit={savePassword} className="rounded-2xl p-6 space-y-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Mevcut Şifre</label>
                  <input type="password" value={pwd.current} onChange={e => setPwd({...pwd, current: e.target.value})} required className="auth-input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Yeni Şifre</label>
                  <input type="password" value={pwd.new} onChange={e => setPwd({...pwd, new: e.target.value})} required minLength={8} className="auth-input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Yeni Şifre (Tekrar)</label>
                  <input type="password" value={pwd.confirm} onChange={e => setPwd({...pwd, confirm: e.target.value})} required minLength={8} className="auth-input" />
                </div>
                <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2" style={{ background: '#1D9E75' }}>
                  {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  🔒 Güncelle
                </button>
              </form>
            </>
          )}

          {tab === 'preferences' && (
            <>
              <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text)' }}>🎨 Görünüm</h1>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Tema ve dil</p>
              <div className="rounded-2xl p-6 space-y-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div>
                  <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>🌓 Tema</p>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { key: 'light' as const, icon: '☀️', label: 'Aydınlık' },
                      { key: 'dark' as const, icon: '🌙', label: 'Karanlık' },
                      { key: 'auto' as const, icon: '🔄', label: 'Otomatik' },
                    ]).map(t => (
                      <button key={t.key} onClick={() => setTheme(t.key)}
                        className="px-4 py-3 rounded-xl text-sm font-medium"
                        style={{
                          background: theme === t.key ? 'rgba(29,158,117,0.15)' : 'var(--bg-subtle)',
                          color: theme === t.key ? '#1D9E75' : 'var(--text)',
                          border: theme === t.key ? '2px solid #1D9E75' : '2px solid transparent',
                        }}>
                        <div className="text-2xl mb-1">{t.icon}</div>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {tab === 'notifications' && (
            <>
              <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text)' }}>🔔 Bildirimler</h1>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Hangi bildirimleri almak istersin?</p>
              <div className="rounded-2xl p-6 space-y-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                {[
                  { label: 'Beğeniler', icon: '❤️' },
                  { label: 'Yorumlar', icon: '💬' },
                  { label: 'Yeni takipçiler', icon: '👥' },
                  { label: 'Bahsetmeler (@)', icon: '@' },
                  { label: 'Haftalık bülten', icon: '📧' },
                  { label: 'E-posta bildirimleri', icon: '✉️' },
                ].map((n, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-subtle)' }}>
                    <span className="text-sm flex items-center gap-2" style={{ color: 'var(--text)' }}><span>{n.icon}</span>{n.label}</span>
                    <div className="w-10 h-6 rounded-full relative cursor-pointer" style={{ background: '#1D9E75' }}>
                      <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white" style={{ left: '18px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'privacy' && (
            <>
              <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text)' }}>🛡️ Gizlilik</h1>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Kim ne görsün?</p>
              <div className="rounded-2xl p-6 space-y-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                {[
                  { label: 'Profilim herkese açık', enabled: true },
                  { label: 'Aktivite haritamı göster', enabled: true },
                  { label: 'E-postamı gizle', enabled: true },
                  { label: 'Beni arama sonuçlarında göster', enabled: true },
                ].map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-subtle)' }}>
                    <span className="text-sm" style={{ color: 'var(--text)' }}>{p.label}</span>
                    <div className="w-10 h-6 rounded-full relative cursor-pointer" style={{ background: p.enabled ? '#1D9E75' : 'var(--border)' }}>
                      <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all" style={{ left: p.enabled ? '18px' : '2px' }} />
                    </div>
                  </div>
                ))}
                <div className="pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                  <button className="w-full py-2.5 rounded-xl text-sm font-semibold" style={{ background: 'rgba(226,75,74,0.1)', color: '#e24b4a' }}>
                    Hesabımı Sil
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
