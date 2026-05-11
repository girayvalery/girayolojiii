'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import type { User } from '@/lib/data'
import { useBodyLock } from '@/lib/useBodyLock'
import PhotoUpload from '@/components/upload/PhotoUpload'

const AVATAR_OPTIONS = ['🧑‍🚀','🧑‍🔬','🧑‍💻','🧑‍🎨','🌍','🗣️','🩺','🔭','⚙️','🧠','🎯','🌱']

type Props = {
  user: User
  onClose: () => void
  onSave: (updates: Partial<User>) => void
}

export default function EditProfileModal({ user, onClose, onSave }: Props) {
  useBodyLock(true)
  const { update } = useSession()

  const [form, setForm] = useState({
    name: user.name,
    username: user.username,
    bio: user.bio,
    avatar: user.avatar,
    photoUrl: user.photoUrl || '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'info'|'photo'>('info')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const res = await fetch('/api/db/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Güncelleme başarısız')

      await update({ ...form })
      onSave(form)
    } catch (err: any) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl shadow-2xl animate-fade-up max-h-[90vh] overflow-y-auto"
        style={{ background: '#161616', border: '1px solid #2a2a2a' }}
        onClick={e => e.stopPropagation()}>

        <div className="px-6 py-4 flex items-center justify-between sticky top-0 z-10"
          style={{ background: '#161616', borderBottom: '1px solid #2a2a2a' }}>
          <h2 className="text-lg font-semibold" style={{ color: '#f5f5f5' }}>✏️ Profili Düzenle</h2>
          <button onClick={onClose} style={{ color: '#999' }}>✕</button>
        </div>

        <div className="flex border-b" style={{ borderColor: '#2a2a2a' }}>
          {([
            { key: 'info' as const, label: '📝 Bilgiler' },
            { key: 'photo' as const, label: '📸 Fotoğraf' },
          ]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex-1 py-3 text-sm font-medium"
              style={{
                color: tab === t.key ? '#1D9E75' : '#999',
                borderBottom: tab === t.key ? '2px solid #1D9E75' : '2px solid transparent',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(226,75,74,0.1)', color: '#e24b4a' }}>
              ⚠️ {error}
            </div>
          )}

          {tab === 'info' && (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#999' }}>Ad Soyad</label>
                <input type="text" value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  required minLength={2} className="auth-input" />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#999' }}>Kullanıcı Adı</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-sm" style={{ color: '#999' }}>@</span>
                  <input type="text" value={form.username}
                    onChange={e => setForm({...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,'')})}
                    required minLength={3} className="auth-input" style={{ paddingLeft: 32 }} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#999' }}>Biyografi</label>
                <textarea rows={4} value={form.bio} maxLength={160}
                  onChange={e => setForm({...form, bio: e.target.value})}
                  className="auth-input resize-none" style={{ fontFamily: 'var(--font-body)' }} />
                <p className="text-xs mt-1 text-right" style={{ color: '#999' }}>{form.bio.length}/160</p>
              </div>
            </>
          )}

          {tab === 'photo' && (
            <>
              <div className="text-center">
                {form.photoUrl ? (
                  <img src={form.photoUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover mx-auto mb-3" style={{ border: `3px solid ${user.avatarColor}55` }} />
                ) : (
                  <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto mb-3"
                    style={{ background: `${user.avatarColor}22`, border: `3px solid ${user.avatarColor}55` }}>
                    {form.avatar}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#999' }}>Fotoğraf Yükle</label>
                <PhotoUpload type="image" currentUrl={form.photoUrl} onUpload={(url) => setForm({...form, photoUrl: url})} maxSizeMB={5} />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#999' }}>Veya Emoji</label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATAR_OPTIONS.map(emoji => (
                    <button key={emoji} type="button"
                      onClick={() => setForm({...form, avatar: emoji, photoUrl: ''})}
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl hover:scale-110 transition-all"
                      style={{
                        background: form.avatar === emoji && !form.photoUrl ? 'rgba(29,158,117,0.15)' : '#1f1f1f',
                        border: form.avatar === emoji && !form.photoUrl ? '2px solid #1D9E75' : '2px solid transparent',
                      }}>
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {form.photoUrl && (
                <button type="button" onClick={() => setForm({...form, photoUrl: ''})}
                  className="w-full py-2 rounded-xl text-sm border"
                  style={{ borderColor: '#2a2a2a', color: '#999' }}>
                  Fotoğrafı Kaldır
                </button>
              )}
            </>
          )}

          <div className="flex gap-3 pt-3" style={{ borderTop: '1px solid #2a2a2a' }}>
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold border"
              style={{ borderColor: '#2a2a2a', color: '#999' }}>
              İptal
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
              style={{ background: '#1D9E75' }}>
              {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {saving ? 'Kaydediliyor...' : '💾 Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
