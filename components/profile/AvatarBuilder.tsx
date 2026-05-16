'use client'
import { useState } from 'react'
import SvgAvatar from '@/components/avatar/SvgAvatar'
import {
  AvatarConfig, DEFAULT_AVATAR,
  SKIN_TONES, HAIR_COLORS, HAIR_STYLES,
  EYE_STYLES, EYEBROW_STYLES, MOUTH_STYLES,
  FACIAL_STYLES, ACCESSORY_STYLES, BG_COLORS,
} from '@/lib/avatar'

type Props = {
  initial?: AvatarConfig
  onSave: (cfg: AvatarConfig) => void
  onCancel?: () => void
}

type Tab = 'skin'|'hair'|'eyes'|'eyebrows'|'mouth'|'facial'|'accessory'|'bg'

export default function AvatarBuilder({ initial, onSave, onCancel }: Props) {
  const [cfg, setCfg] = useState<AvatarConfig>(initial || DEFAULT_AVATAR)
  const [tab, setTab] = useState<Tab>('skin')

  function update(k: keyof AvatarConfig, v: string) {
    setCfg(p => ({ ...p, [k]: v }))
  }

  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: 'skin', icon: '✋', label: 'Ten' },
    { id: 'hair', icon: '💇', label: 'Saç' },
    { id: 'eyes', icon: '👁', label: 'Göz' },
    { id: 'eyebrows', icon: '〰️', label: 'Kaş' },
    { id: 'mouth', icon: '👄', label: 'Ağız' },
    { id: 'facial', icon: '🧔', label: 'Sakal' },
    { id: 'accessory', icon: '🕶', label: 'Aksesuar' },
    { id: 'bg', icon: '🎨', label: 'Arka' },
  ]

  return (
    <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
        🎨 Karakter Tasarla
      </h3>

      {/* Büyük önizleme */}
      <div className="flex flex-col items-center mb-5">
        <div className="rounded-full overflow-hidden" style={{ background: cfg.bg, padding: '8px' }}>
          <SvgAvatar config={cfg} size={180} showBg={false} />
        </div>
      </div>

      {/* Sekmeler */}
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

      {/* Sekme içeriği */}
      <div className="min-h-[140px]">
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
            <div className="grid grid-cols-5 gap-2 mb-4">
              {HAIR_STYLES.map(h => (
                <button key={h.id} onClick={() => update('hair', h.id)}
                  className="aspect-square rounded-xl text-2xl flex items-center justify-center transition-all hover:scale-105"
                  style={{
                    background: cfg.hair === h.id ? 'rgba(29,158,117,0.2)' : 'var(--bg-subtle)',
                    border: cfg.hair === h.id ? '2px solid #1D9E75' : '2px solid transparent',
                  }} title={h.label}>{h.emoji}</button>
              ))}
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Renk</p>
            <div className="grid grid-cols-6 gap-2">
              {HAIR_COLORS.map(c => (
                <button key={c.id} onClick={() => update('hairColor', c.color)}
                  className="aspect-square rounded-full transition-all hover:scale-110"
                  style={{
                    background: c.color,
                    border: cfg.hairColor === c.color ? '3px solid #1D9E75' : '2px solid var(--border)',
                  }} title={c.label} />
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
          <div className="grid grid-cols-2 gap-2">
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
            {BG_COLORS.map(c => (
              <button key={c} onClick={() => update('bg', c)}
                className="aspect-square rounded-full transition-all hover:scale-110"
                style={{
                  background: c,
                  border: cfg.bg === c ? '3px solid #fff' : '2px solid var(--border)',
                  boxShadow: cfg.bg === c ? `0 0 0 2px ${c}` : 'none',
                }} />
            ))}
          </div>
        )}
      </div>

      {/* Aksiyon butonları */}
      <div className="flex gap-2 mt-5">
        {onCancel && (
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            İptal
          </button>
        )}
        <button onClick={() => onSave(cfg)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: '#1D9E75' }}>
          ✓ Kaydet
        </button>
      </div>
    </div>
  )
}
