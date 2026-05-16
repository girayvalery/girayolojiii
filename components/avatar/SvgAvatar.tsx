'use client'
import { AvatarConfig, DEFAULT_AVATAR } from '@/lib/avatar'

type Props = {
  config: AvatarConfig
  size?: number
  showBg?: boolean
}

export default function SvgAvatar({ config, size = 120, showBg = true }: Props) {
  const c = { ...DEFAULT_AVATAR, ...config }

  return (
    <svg viewBox="0 0 200 200" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      {showBg && <rect x="0" y="0" width="200" height="200" fill={c.bg} rx="100" />}

      {/* Boyun */}
      <rect x="80" y="140" width="40" height="30" fill={c.skin} />

      {/* Yüz */}
      <ellipse cx="100" cy="100" rx="50" ry="55" fill={c.skin} />

      {/* Kulaklar */}
      <ellipse cx="50" cy="105" rx="8" ry="14" fill={c.skin} />
      <ellipse cx="150" cy="105" rx="8" ry="14" fill={c.skin} />

      {/* Saç */}
      <Hair style={c.hair} color={c.hairColor} />

      {/* Kaş */}
      <Eyebrows style={c.eyebrows} />

      {/* Göz */}
      <Eyes style={c.eyes} />

      {/* Burun */}
      <path d="M 96 105 Q 100 115 104 105" stroke={shadeColor(c.skin, -15)} strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Ağız */}
      <Mouth style={c.mouth} />

      {/* Sakal/Bıyık */}
      <Facial style={c.facial} color={c.hairColor} />

      {/* Aksesuar */}
      <Accessory style={c.accessory} color={c.hairColor} />
    </svg>
  )
}

function Hair({ style, color }: { style: string; color: string }) {
  if (style === 'bald') return null
  if (style === 'short') return (
    <path d="M 50 80 Q 50 50 100 45 Q 150 50 150 80 L 150 75 Q 100 60 50 75 Z" fill={color} />
  )
  if (style === 'mid') return (
    <path d="M 48 95 Q 45 50 100 40 Q 155 50 152 95 L 152 80 Q 100 55 48 80 Z" fill={color} />
  )
  if (style === 'long') return (
    <>
      <path d="M 45 100 Q 40 45 100 38 Q 160 45 155 100 L 155 80 Q 100 55 45 80 Z" fill={color} />
      <path d="M 45 100 Q 30 130 35 170 L 60 170 Q 55 130 65 105 Z" fill={color} />
      <path d="M 155 100 Q 170 130 165 170 L 140 170 Q 145 130 135 105 Z" fill={color} />
    </>
  )
  if (style === 'curly') return (
    <g fill={color}>
      <circle cx="55" cy="65" r="13" />
      <circle cx="75" cy="50" r="14" />
      <circle cx="100" cy="42" r="15" />
      <circle cx="125" cy="50" r="14" />
      <circle cx="145" cy="65" r="13" />
      <circle cx="60" cy="85" r="10" />
      <circle cx="140" cy="85" r="10" />
    </g>
  )
  if (style === 'wavy') return (
    <path d="M 48 90 Q 55 55 75 50 Q 90 60 100 48 Q 115 60 125 50 Q 145 55 152 90 L 152 75 Q 130 70 100 75 Q 70 70 48 75 Z" fill={color} />
  )
  if (style === 'mohawk') return (
    <path d="M 85 50 L 90 30 L 100 25 L 110 30 L 115 50 Z" fill={color} />
  )
  if (style === 'bun') return (
    <>
      <path d="M 50 90 Q 50 55 100 50 Q 150 55 150 90 L 150 80 Q 100 65 50 80 Z" fill={color} />
      <circle cx="100" cy="35" r="18" fill={color} />
    </>
  )
  if (style === 'ponytail') return (
    <>
      <path d="M 50 90 Q 50 50 100 45 Q 150 50 150 90 L 150 75 Q 100 60 50 75 Z" fill={color} />
      <ellipse cx="155" cy="115" rx="15" ry="30" fill={color} />
    </>
  )
  if (style === 'afro') return (
    <ellipse cx="100" cy="70" rx="65" ry="45" fill={color} />
  )
  return null
}

function Eyes({ style }: { style: string }) {
  if (style === 'normal') return (
    <>
      <ellipse cx="80" cy="95" rx="5" ry="6" fill="#fff" />
      <circle cx="80" cy="96" r="3" fill="#1a1a1a" />
      <ellipse cx="120" cy="95" rx="5" ry="6" fill="#fff" />
      <circle cx="120" cy="96" r="3" fill="#1a1a1a" />
    </>
  )
  if (style === 'smiling' || style === 'happy') return (
    <>
      <path d="M 73 95 Q 80 88 87 95" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 113 95 Q 120 88 127 95" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  )
  if (style === 'wink') return (
    <>
      <ellipse cx="80" cy="95" rx="5" ry="6" fill="#fff" />
      <circle cx="80" cy="96" r="3" fill="#1a1a1a" />
      <path d="M 113 95 Q 120 88 127 95" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  )
  if (style === 'shocked') return (
    <>
      <circle cx="80" cy="95" r="7" fill="#fff" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="80" cy="95" r="3" fill="#1a1a1a" />
      <circle cx="120" cy="95" r="7" fill="#fff" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="120" cy="95" r="3" fill="#1a1a1a" />
    </>
  )
  if (style === 'sleepy') return (
    <>
      <path d="M 73 97 Q 80 100 87 97" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 113 97 Q 120 100 127 97" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  )
  return null
}

function Eyebrows({ style }: { style: string }) {
  if (style === 'normal') return (
    <>
      <path d="M 72 85 Q 80 81 88 85" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 112 85 Q 120 81 128 85" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </>
  )
  if (style === 'raised') return (
    <>
      <path d="M 72 82 Q 80 76 88 80" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 112 80 Q 120 76 128 82" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </>
  )
  if (style === 'angry') return (
    <>
      <path d="M 72 80 L 88 86" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 128 80 L 112 86" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  )
  if (style === 'sad') return (
    <>
      <path d="M 72 86 L 88 80" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 128 86 L 112 80" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  )
  return null
}

function Mouth({ style }: { style: string }) {
  if (style === 'smile') return (
    <path d="M 85 130 Q 100 142 115 130" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
  )
  if (style === 'big_smile') return (
    <path d="M 80 128 Q 100 150 120 128 L 115 132 Q 100 142 85 132 Z" fill="#a32d2d" stroke="#1a1a1a" strokeWidth="2" />
  )
  if (style === 'neutral') return (
    <line x1="88" y1="135" x2="112" y2="135" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
  )
  if (style === 'sad') return (
    <path d="M 85 140 Q 100 130 115 140" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
  )
  if (style === 'shock') return (
    <ellipse cx="100" cy="135" rx="6" ry="8" fill="#1a1a1a" />
  )
  if (style === 'tongue') return (
    <>
      <path d="M 85 130 Q 100 142 115 130" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="100" cy="140" rx="6" ry="4" fill="#E48BB6" />
    </>
  )
  return null
}

function Facial({ style, color }: { style: string; color: string }) {
  if (style === 'mustache') return (
    <path d="M 85 125 Q 100 130 115 125 L 110 128 Q 100 127 90 128 Z" fill={color} />
  )
  if (style === 'goatee') return (
    <ellipse cx="100" cy="150" rx="8" ry="10" fill={color} />
  )
  if (style === 'full_beard') return (
    <path d="M 60 120 Q 60 150 100 160 Q 140 150 140 120 Q 130 140 100 140 Q 70 140 60 120 Z" fill={color} />
  )
  if (style === 'soul_patch') return (
    <rect x="98" y="142" width="4" height="6" fill={color} />
  )
  return null
}

function Accessory({ style, color }: { style: string; color: string }) {
  if (style === 'glasses') return (
    <>
      <circle cx="80" cy="95" r="11" fill="none" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="120" cy="95" r="11" fill="none" stroke="#1a1a1a" strokeWidth="2" />
      <line x1="91" y1="95" x2="109" y2="95" stroke="#1a1a1a" strokeWidth="2" />
    </>
  )
  if (style === 'sunglasses') return (
    <>
      <rect x="68" y="88" width="24" height="14" rx="3" fill="#1a1a1a" />
      <rect x="108" y="88" width="24" height="14" rx="3" fill="#1a1a1a" />
      <line x1="92" y1="95" x2="108" y2="95" stroke="#1a1a1a" strokeWidth="2" />
    </>
  )
  if (style === 'round_glasses') return (
    <>
      <circle cx="80" cy="95" r="9" fill="none" stroke="#FFB800" strokeWidth="2.5" />
      <circle cx="120" cy="95" r="9" fill="none" stroke="#FFB800" strokeWidth="2.5" />
      <line x1="89" y1="95" x2="111" y2="95" stroke="#FFB800" strokeWidth="2" />
    </>
  )
  if (style === 'hat') return (
    <>
      <ellipse cx="100" cy="50" rx="60" ry="8" fill="#5C2E1A" />
      <path d="M 65 50 L 75 25 L 125 25 L 135 50 Z" fill="#5C2E1A" />
    </>
  )
  if (style === 'cap') return (
    <>
      <path d="M 50 55 Q 100 30 150 55 L 150 65 L 50 65 Z" fill="#1D9E75" />
      <ellipse cx="100" cy="65" rx="55" ry="5" fill="#1D9E75" />
    </>
  )
  return null
}

function shadeColor(color: string, percent: number): string {
  const f = parseInt(color.slice(1), 16)
  const t = percent < 0 ? 0 : 255
  const p = Math.abs(percent) / 100
  const R = f >> 16
  const G = (f >> 8) & 0xff
  const B = f & 0xff
  const newR = Math.round((t - R) * p) + R
  const newG = Math.round((t - G) * p) + G
  const newB = Math.round((t - B) * p) + B
  return '#' + ((newR << 16) | (newG << 8) | newB).toString(16).padStart(6, '0')
}
