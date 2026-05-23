'use client'
import { useState, useRef } from 'react'
import SvgAvatar from '@/components/avatar/SvgAvatar'
import {
  AvatarConfig, DEFAULT_AVATAR, Gender,
  SKIN_TONES, HAIR_COLORS, getHairStyles,
  EYE_STYLES, EYEBROW_STYLES, MOUTH_STYLES,
  FACIAL_STYLES, ACCESSORY_STYLES, BG_COLORS, LIP_COLORS,
} from '@/lib/avatar'

type Props = {
  initial?: AvatarConfig
  initialPhotoUrl?: string
  onSaveBitmoji: (cfg: AvatarConfig) => void
  onSavePhoto: (url: string) => void
  onCancel?: () => void
}

type Tab = 'gender'|'skin'|'hair'|'eyes'|'eyebrows'|'mouth'|'facial'|'accessory'|'bg'|'lips'
type Mode = 'bitmoji'|'photo'

export default function AvatarBuilder({ initial, initialPhotoUrl, onSaveBitmoji, onSavePhoto, onCancel }: Props) {
  const [mode, setMode] = useState<Mode>(initialPhotoUrl ? 'photo' : 'bitmoji')
  const [cfg, setCfg] = useState<AvatarConfig>(initial || DEFAULT_AVATAR)
  const [tab, setTab] = useState<Tab>('gender')
  const [uploading, setUploading] = useState(false)
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function update<K extends keyof AvatarConfig>(k: K, v: AvatarConfig[K]) {
    setCfg(p => ({ ...p, [k]: v }))
  }

  async function handleFileUpload(file: File) {
    if (!file.type.startsWith('image/')) {
      alert('Sadece resim dosyası yükleyebilirsin')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Dosya 5 MB\'dan büyük olamaz')
      return
    }
    setUploading(true)
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      if (!cloudName || !preset) {
        alert('Cloudinary kurulumu yapılmamış. Geliştirici ile iletişime geç.')
        setUploading(false)
        return
      }
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', preset)
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      if (data.secure_url) {
        setPhotoUrl(data.secure_url)
      } else {
        alert('Yükleme başarısız: ' + (data.error?.message || 'Bilinmeyen hata'))
      }
    } catch (e: any) {
      alert('Hata: ' + e.message)
    }
    setUploading(false)
  }

  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: 'gender', icon: '⚧️', label: 'Cinsiyet' },
    { id: 'skin', icon: '✋', label: 'Ten' },
    { id: 'hair', icon: '💇', label: 'Saç' },
    { id: 'eyes', icon: '👁', label: 'Göz' },
    { id: 'eyebrows', icon: '〰️', label: 'Kaş' },
    { id: 'mouth', icon: '👄', label: 'Ağız' },
    ...(cfg.gender === 'female' ? [{ id: 'lips' as const, icon: '💋', label: 'Dudak' }] : [{ id: 'facial' as const, icon: '🧔', label: 'Sakal' }]),
    { id: 'accessory', icon: '🕶', label: 'Aksesuar' },
    { id: 'bg', icon: '🎨', label: 'Arka' },
  ]

  const HAIR_STYLES = getHairStyles(cfg.gender)

  return (
    <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>🎨 Profil Resmin</h3>

      {/* Mode seçimi */}
      <div className="flex gap-2 mb-5 p-1 rounded-xl" style={{ background: 'var(--bg-subtle)' }}>
        <button onClick={() => setMode('bitmoji')}
          className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
          style={{ background: mode === 'bitmoji' ? '#1D9E75' : 'transparent', color: mode === 'bitmoji' ? '#fff' : 'var(--text-muted)' }}>
          🧑‍🎨 Karakter Tasarla
        </button>
        <button onClick={() => setMode('photo')}
          className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
          style={{ background: mode === 'photo' ? '#1D9E75' : 'transparent', color: mode === 'photo' ? '#fff' : 'var(--text-muted)' }}>
          📷 Fotoğraf Yükle
        </button>
      </div>

      {mode === 'bitmoji' ? (
        <>
          {/* Bitmoji preview */}
          <div className="flex justify-center mb-5">
            <div className="rounded-full overflow-hidden shadow-xl" style={{ padding: '8px', background: cfg.bg }}>
              <SvgAvatar config={cfg} size={180} showBg={false} />
            </div>
          </div>

          {/* Tablar */}
          <div className="flex gap-1 overflow-x-auto pb-2 mb-4 scrollbar-none">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all"
                style={{
                  background: tab === t.id ? '#1D9E75' : 'var(--bg-subtle)',
                  color: tab === t.id ? '#fff' : 'var(--text-muted)',
                }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* İçerik */}
          <div className="min-h-[140px]">
            {tab === 'gender' && (
              <div className="grid grid-cols-2 gap-3">
                {([
                  { id: 'male' as Gender, icon: '👨', label: 'Erkek' },
                  { id: 'female' as Gender, icon: '👩', label: 'Kız' },
                ]).map(g => (
                  <button key={g.id} onClick={() => {
                    update('gender', g.id)
                    // gender değişince saç stilini default'la
                    const styles = getHairStyles(g.id)
                    update('hair', styles[1]?.id || styles[0].id)
                    if (g.id === 'female') update('facial', 'none')
                  }}
                    className="py-4 rounded-xl text-base font-semibold flex flex-col items-center gap-1 transition-all hover:scale-105"
                    style={{
                      background: cfg.gender === g.id ? 'rgba(29,158,117,0.2)' : 'var(--bg-subtle)',
                      color: cfg.gender === g.id ? '#1D9E75' : 'var(--text)',
                      border: cfg.gender === g.id ? '2px solid #1D9E75' : '2px solid transparent',
                    }}>
                    <span className="text-3xl">{g.icon}</span>
                    {g.label}
                  </button>
                ))}
              </div>
            )}

            {tab === 'skin' && (
              <div className="grid grid-cols-6 gap-2">
                {SKIN_TONES.map(s => (
                  <button key={s.id} onClick={() => update('skin', s.color)}
                    className="aspect-square rounded-full transition-all hover:scale-110"
                    style={{
                      background: s.color,
                      border: cfg.skin === s.color ? '3px solid #1D9E75' : '2px solid var(--border)',
                    }} title={s.label} />
                ))}
              </div>
            )}

            {tab === 'hair' && (
              <>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Stil</p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {HAIR_STYLES.map(h => (
                    <button key={h.id} onClick={() => update('hair', h.id)}
                      className="py-2.5 rounded-xl text-xs font-medium transition-all hover:scale-105"
                      style={{
                        background: cfg.hair === h.id ? 'rgba(29,158,117,0.2)' : 'var(--bg-subtle)',
                        color: cfg.hair === h.id ? '#1D9E75' : 'var(--text)',
                        border: cfg.hair === h.id ? '2px solid #1D9E75' : '2px solid transparent',
                      }}>{h.label}</button>
                  ))}
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Renk</p>
                <div className="grid grid-cols-6 gap-2">
                  {HAIR_COLORS.map(c2 => (
                    <button key={c2.id} onClick={() => update('hairColor', c2.color)}
                      className="aspect-square rounded-full transition-all hover:scale-110"
                      style={{
                        background: c2.color,
                        border: cfg.hairColor === c2.color ? '3px solid #1D9E75' : '2px solid var(--border)',
                      }} title={c2.label} />
                  ))}
                </div>
              </>
            )}

            {tab === 'eyes' && (
              <div className="grid grid-cols-3 gap-2">
                {EYE_STYLES.map(e => (
                  <button key={e.id} onClick={() => update('eyes', e.id)}
                    className="py-3 rounded-xl text-xs font-medium transition-all hover:scale-105"
                    style={{
                      background: cfg.eyes === e.id ? 'rgba(29,158,117,0.2)' : 'var(--bg-subtle)',
                      color: cfg.eyes === e.id ? '#1D9E75' : 'var(--text)',
                      border: cfg.eyes === e.id ? '2px solid #1D9E75' : '2px solid transparent',
                    }}>{e.label}</button>
                ))}
              </div>
            )}

            {tab === 'eyebrows' && (
              <div className="grid grid-cols-3 gap-2">
                {EYEBROW_STYLES.map(e => (
                  <button key={e.id} onClick={() => update('eyebrows', e.id)}
                    className="py-3 rounded-xl text-xs font-medium transition-all hover:scale-105"
                    style={{
                      background: cfg.eyebrows === e.id ? 'rgba(29,158,117,0.2)' : 'var(--bg-subtle)',
                      color: cfg.eyebrows === e.id ? '#1D9E75' : 'var(--text)',
                      border: cfg.eyebrows === e.id ? '2px solid #1D9E75' : '2px solid transparent',
                    }}>{e.label}</button>
                ))}
              </div>
            )}

            {tab === 'mouth' && (
              <div className="grid grid-cols-3 gap-2">
                {MOUTH_STYLES.map(m => (
                  <button key={m.id} onClick={() => update('mouth', m.id)}
                    className="py-3 rounded-xl text-xs font-medium transition-all hover:scale-105"
                    style={{
                      background: cfg.mouth === m.id ? 'rgba(29,158,117,0.2)' : 'var(--bg-subtle)',
                      color: cfg.mouth === m.id ? '#1D9E75' : 'var(--text)',
                      border: cfg.mouth === m.id ? '2px solid #1D9E75' : '2px solid transparent',
                    }}>{m.label}</button>
                ))}
              </div>
            )}

            {tab === 'facial' && (
              <div className="grid grid-cols-3 gap-2">
                {FACIAL_STYLES.map(f => (
                  <button key={f.id} onClick={() => update('facial', f.id)}
                    className="py-3 rounded-xl text-xs font-medium transition-all hover:scale-105"
                    style={{
                      background: cfg.facial === f.id ? 'rgba(29,158,117,0.2)' : 'var(--bg-subtle)',
                      color: cfg.facial === f.id ? '#1D9E75' : 'var(--text)',
                      border: cfg.facial === f.id ? '2px solid #1D9E75' : '2px solid transparent',
                    }}>{f.label}</button>
                ))}
              </div>
            )}

            {tab === 'lips' && (
              <div className="grid grid-cols-6 gap-2">
                {LIP_COLORS.map(l => (
                  <button key={l.id} onClick={() => update('lipColor', l.color)}
                    className="aspect-square rounded-full transition-all hover:scale-110"
                    style={{
                      background: l.color,
                      border: cfg.lipColor === l.color ? '3px solid #1D9E75' : '2px solid var(--border)',
                    }} title={l.label} />
                ))}
              </div>
            )}

            {tab === 'accessory' && (
              <div className="grid grid-cols-3 gap-2">
                {ACCESSORY_STYLES.map(a => (
                  <button key={a.id} onClick={() => update('accessory', a.id)}
                    className="py-3 rounded-xl text-xs font-medium transition-all hover:scale-105"
                    style={{
                      background: cfg.accessory === a.id ? 'rgba(29,158,117,0.2)' : 'var(--bg-subtle)',
                      color: cfg.accessory === a.id ? '#1D9E75' : 'var(--text)',
                      border: cfg.accessory === a.id ? '2px solid #1D9E75' : '2px solid transparent',
                    }}>{a.label}</button>
                ))}
              </div>
            )}

            {tab === 'bg' && (
              <div className="grid grid-cols-6 gap-2">
                {BG_COLORS.map(b => (
                  <button key={b} onClick={() => update('bg', b)}
                    className="aspect-square rounded-full transition-all hover:scale-110"
                    style={{
                      background: b,
                      border: cfg.bg === b ? '3px solid #fff' : '2px solid var(--border)',
                      boxShadow: cfg.bg === b ? `0 0 0 2px ${b}` : 'none',
                    }} />
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Photo upload */}
          <div className="flex flex-col items-center mb-5">
            {photoUrl ? (
              <img src={photoUrl} alt="Profil" className="w-44 h-44 rounded-full object-cover shadow-xl" style={{ border: '3px solid #1D9E75' }} />
            ) : (
              <div className="w-44 h-44 rounded-full flex items-center justify-center text-5xl" style={{ background: 'var(--bg-subtle)', border: '3px dashed var(--border)' }}>
                📷
              </div>
            )}
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f) }} />

          <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white mb-3"
            style={{ background: uploading ? '#666' : '#1D9E75' }}>
            {uploading ? 'Yükleniyor...' : photoUrl ? '🔄 Fotoğrafı Değiştir' : '📤 Fotoğraf Seç'}
          </button>

          <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            JPG, PNG, GIF · maksimum 5 MB
          </p>
        </>
      )}

      <div className="flex gap-2 mt-5">
        {onCancel && (
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            İptal
          </button>
        )}
        <button onClick={() => mode === 'bitmoji' ? onSaveBitmoji(cfg) : onSavePhoto(photoUrl)}
          disabled={mode === 'photo' && !photoUrl}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: mode === 'photo' && !photoUrl ? '#666' : '#1D9E75' }}>
          ✓ Kaydet
        </button>
      </div>
    </div>
  )
}
