'use client'
import { useState } from 'react'

// Genişletilmiş emoji setleri
const FACE_TYPES = ['😀','😎','🤓','🥸','😇','🤗','🤩','🥰','😋','🧐','🤠','🥳','😴','🤖','👽','🤡']
const HAIR_STYLES = ['👨','👩','🧔','👱','👲','🧕','👨‍🦰','👩‍🦰','👨‍🦱','👩‍🦱','👨‍🦳','👩‍🦳','👨‍🦲','👩‍🦲']
const PROFESSIONS = ['🧑‍🚀','🧑‍🔬','🧑‍💻','🧑‍🎨','🧑‍🍳','🧑‍🏫','🧑‍🌾','🧑‍🎤','🧑‍✈️','🧑‍⚕️','👩‍🎓','🧑‍🚒','🧑‍🏭','🧑‍🔧','🧑‍💼','🧑‍🎓']
const FANTASY = ['🧙','🧚','🧛','🧜','🧝','🦸','🦹','🥷','🧞','👻','🤴','👸','🧌','🤺','🧙‍♀️','🧝‍♂️']
const ANIMALS = ['🦊','🦁','🐯','🐼','🐨','🐸','🐙','🦄','🐢','🦋','🐝','🐬','🐺','🦝','🐧','🦉']
const SYMBOLS = ['⭐','🌙','☀️','🔥','💎','🌈','🌸','🍀','💫','⚡','🌊','🎯','🌺','🎭','🎪','🌻']

const COLORS = [
  '#1D9E75', '#534AB7', '#185fa5', '#D4537E', '#D85A30', '#ba7517',
  '#e24b4a', '#1AAE9F', '#7F77DD', '#639922', '#D85A30', '#D4537E',
  '#a32d2d', '#0F6E56', '#7D5BA6', '#FF6B35',
]

const PATTERNS = [
  { name: 'Düz', value: 'solid' },
  { name: 'Gradient', value: 'gradient' },
  { name: 'Yıldızlı', value: 'stars' },
  { name: 'Çizgili', value: 'stripes' },
  { name: 'Noktalı', value: 'dots' },
  { name: 'Dalga', value: 'waves' },
]

const TABS = [
  { key: 'professions', label: '🧑 Meslek', items: PROFESSIONS },
  { key: 'faces', label: '😀 Yüzler', items: FACE_TYPES },
  { key: 'hair', label: '💇 Saç', items: HAIR_STYLES },
  { key: 'fantasy', label: '🧙 Fantastik', items: FANTASY },
  { key: 'animals', label: '🦊 Hayvanlar', items: ANIMALS },
  { key: 'symbols', label: '⭐ Semboller', items: SYMBOLS },
]

type Props = {
  initialAvatar?: string
  initialColor?: string
  onSave: (avatar: string, color: string, pattern: string) => void
}

export default function AvatarBuilder({ initialAvatar = '🧑‍🚀', initialColor = '#1D9E75', onSave }: Props) {
  const [avatar, setAvatar] = useState(initialAvatar)
  const [color, setColor] = useState(initialColor)
  const [pattern, setPattern] = useState('solid')
  const [tab, setTab] = useState('professions')

  function getBackground() {
    const c = color
    switch (pattern) {
      case 'gradient': return `linear-gradient(135deg, ${c} 0%, ${c}77 100%)`
      case 'stars': return `radial-gradient(circle at 25% 25%, ${c}88 0%, ${c} 50%), radial-gradient(circle at 75% 75%, ${c}cc 0%, transparent 50%)`
      case 'stripes': return `repeating-linear-gradient(45deg, ${c}, ${c} 10px, ${c}cc 10px, ${c}cc 20px)`
      case 'dots': return `radial-gradient(${c}cc 25%, transparent 26%), radial-gradient(${c}cc 25%, transparent 26%) 12px 12px, ${c}`
      case 'waves': return `repeating-radial-gradient(circle at 50% 0%, ${c}, ${c} 12px, ${c}cc 12px, ${c}cc 24px)`
      default: return c
    }
  }

  const activeTab = TABS.find(t => t.key === tab)

  return (
    <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text)' }}>🎨 Karakterini Oluştur</h3>

      <div className="flex justify-center mb-6">
        <div className="w-32 h-32 rounded-full flex items-center justify-center text-7xl shadow-2xl"
          style={{ background: getBackground(), border: `4px solid ${color}55`, backgroundSize: pattern === 'dots' ? '24px 24px' : 'auto' }}>
          {avatar}
        </div>
      </div>

      <div className="flex gap-1 mb-3 p-1 rounded-xl overflow-x-auto" style={{ background: 'var(--bg-subtle)' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap"
            style={{
              background: tab === t.key ? 'var(--bg-card)' : 'transparent',
              color: tab === t.key ? '#1D9E75' : 'var(--text-muted)',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-8 gap-1.5 mb-6">
        {activeTab?.items.map(emoji => (
          <button key={emoji} type="button" onClick={() => setAvatar(emoji)}
            className="aspect-square rounded-lg flex items-center justify-center text-xl"
            style={{
              background: avatar === emoji ? `${color}33` : 'var(--bg-subtle)',
              border: avatar === emoji ? `2px solid ${color}` : '2px solid transparent',
            }}>
            {emoji}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Renk</p>
        <div className="grid grid-cols-8 gap-1.5">
          {COLORS.map(c => (
            <button key={c} type="button" onClick={() => setColor(c)}
              className="aspect-square rounded-full"
              style={{
                background: c,
                border: color === c ? '3px solid #f5f5f5' : '3px solid transparent',
                boxShadow: color === c ? `0 0 12px ${c}` : 'none',
              }}
            />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Arka Plan Stili</p>
        <div className="grid grid-cols-3 gap-2">
          {PATTERNS.map(p => (
            <button key={p.value} type="button" onClick={() => setPattern(p.value)}
              className="py-2 rounded-xl text-xs font-medium"
              style={{
                background: pattern === p.value ? 'rgba(29,158,117,0.15)' : 'var(--bg-subtle)',
                color: pattern === p.value ? '#1D9E75' : 'var(--text-muted)',
                border: pattern === p.value ? '2px solid #1D9E75' : '2px solid transparent',
              }}>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <button type="button" onClick={() => onSave(avatar, color, pattern)}
        className="w-full py-3 rounded-xl text-sm font-semibold text-white"
        style={{ background: '#1D9E75' }}>
        ✨ Karakteri Kaydet
      </button>
    </div>
  )
}
