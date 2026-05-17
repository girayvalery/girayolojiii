'use client'
import { AvatarConfig, DEFAULT_AVATAR } from '@/lib/avatar'

type Props = {
  config: AvatarConfig
  size?: number
  showBg?: boolean
}

export default function SvgAvatar({ config, size = 120, showBg = true }: Props) {
  const c = { ...DEFAULT_AVATAR, ...config }
  const skinShadow = shadeColor(c.skin, -18)
  const skinLight = shadeColor(c.skin, 8)
  const hairShadow = shadeColor(c.hairColor, -25)
  const hairLight = shadeColor(c.hairColor, 15)

  return (
    <svg viewBox="0 0 200 200" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`bg-${c.bg.slice(1)}`} cx="50%" cy="40%">
          <stop offset="0%" stopColor={shadeColor(c.bg, 15)} />
          <stop offset="100%" stopColor={c.bg} />
        </radialGradient>
        <radialGradient id={`skin-${c.skin.slice(1)}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={skinLight} />
          <stop offset="80%" stopColor={c.skin} />
          <stop offset="100%" stopColor={skinShadow} />
        </radialGradient>
        <radialGradient id={`hair-${c.hairColor.slice(1)}`} cx="50%" cy="30%">
          <stop offset="0%" stopColor={hairLight} />
          <stop offset="100%" stopColor={c.hairColor} />
        </radialGradient>
      </defs>

      {showBg && <rect x="0" y="0" width="200" height="200" fill={`url(#bg-${c.bg.slice(1)})`} rx="100" />}

      {/* Boyun */}
      <path d="M 78 138 Q 78 160 100 168 Q 122 160 122 138 L 122 145 L 78 145 Z" fill={skinShadow} />
      <rect x="80" y="138" width="40" height="22" fill={c.skin} />

      {/* Boyun gölgesi (çene altı) */}
      <ellipse cx="100" cy="138" rx="22" ry="4" fill={skinShadow} opacity="0.4" />

      {/* Yüz - oval, daha doğal */}
      <ellipse cx="100" cy="100" rx="52" ry="58" fill={`url(#skin-${c.skin.slice(1)})`} />

      {/* Yüz konturu (3D etkisi) */}
      <path d="M 50 100 Q 53 130 100 155 Q 147 130 150 100" fill="none" stroke={skinShadow} strokeWidth="1.5" opacity="0.3" />

      {/* Kulaklar */}
      <ellipse cx="50" cy="105" rx="8" ry="14" fill={c.skin} />
      <ellipse cx="50" cy="105" rx="4" ry="9" fill={skinShadow} opacity="0.5" />
      <ellipse cx="150" cy="105" rx="8" ry="14" fill={c.skin} />
      <ellipse cx="150" cy="105" rx="4" ry="9" fill={skinShadow} opacity="0.5" />

      {/* Yanak kızarması */}
      <ellipse cx="72" cy="115" rx="9" ry="5" fill="#FF8FA3" opacity="0.35" />
      <ellipse cx="128" cy="115" rx="9" ry="5" fill="#FF8FA3" opacity="0.35" />

      {/* Saç (yüzün arkası katmanı) */}
      <HairBack style={c.hair} color={c.hairColor} hairLight={hairLight} hairShadow={hairShadow} />

      {/* Kaş */}
      <Eyebrows style={c.eyebrows} color={hairShadow} />

      {/* Göz */}
      <Eyes style={c.eyes} />

      {/* Burun (delikli) */}
      <path d="M 95 110 Q 100 122 105 110" stroke={skinShadow} strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="97" cy="119" r="0.8" fill={skinShadow} opacity="0.6" />
      <circle cx="103" cy="119" r="0.8" fill={skinShadow} opacity="0.6" />

      {/* Ağız */}
      <Mouth style={c.mouth} />

      {/* Sakal/Bıyık */}
      <Facial style={c.facial} color={c.hairColor} shadow={hairShadow} />

      {/* Saç (yüzün önü katmanı - kakül vs.) */}
      <HairFront style={c.hair} color={c.hairColor} hairLight={hairLight} hairShadow={hairShadow} />

      {/* Aksesuar */}
      <Accessory style={c.accessory} />
    </svg>
  )
}

function HairBack({ style, color, hairLight, hairShadow }: { style: string; color: string; hairLight: string; hairShadow: string }) {
  if (style === 'bald') return null
  const gradId = `hair-${color.slice(1)}`

  if (style === 'long') return (
    <>
      <path d="M 40 105 Q 35 50 100 38 Q 165 50 160 105 L 160 95 Q 100 65 40 95 Z" fill={`url(#${gradId})`} />
      {/* Yan saçlar */}
      <path d="M 40 105 Q 25 145 30 178 L 58 178 Q 52 140 62 110 Z" fill={`url(#${gradId})`} />
      <path d="M 160 105 Q 175 145 170 178 L 142 178 Q 148 140 138 110 Z" fill={`url(#${gradId})`} />
      {/* Gölge */}
      <path d="M 40 105 Q 35 50 100 38 Q 165 50 160 105" stroke={hairShadow} strokeWidth="1" fill="none" opacity="0.4" />
    </>
  )

  if (style === 'ponytail') return (
    <ellipse cx="158" cy="118" rx="14" ry="32" fill={`url(#${gradId})`} />
  )

  if (style === 'bun') return (
    <>
      <circle cx="100" cy="38" r="18" fill={`url(#${gradId})`} />
      <circle cx="95" cy="34" r="6" fill={hairLight} opacity="0.5" />
    </>
  )

  if (style === 'afro') return (
    <>
      <circle cx="100" cy="70" r="58" fill={`url(#${gradId})`} />
      <circle cx="75" cy="55" r="14" fill={hairLight} opacity="0.4" />
      <circle cx="120" cy="60" r="12" fill={hairLight} opacity="0.4" />
    </>
  )

  return null
}

function HairFront({ style, color, hairLight, hairShadow }: { style: string; color: string; hairLight: string; hairShadow: string }) {
  if (style === 'bald') return null
  const gradId = `hair-${color.slice(1)}`

  if (style === 'short') return (
    <>
      <path d="M 48 92 Q 50 50 100 42 Q 150 50 152 92 Q 145 70 130 75 Q 100 60 70 75 Q 55 70 48 92 Z" fill={`url(#${gradId})`} />
      {/* Saç parlaklığı */}
      <path d="M 65 65 Q 80 55 95 60" stroke={hairLight} strokeWidth="2" fill="none" opacity="0.6" />
    </>
  )

  if (style === 'mid') return (
    <>
      <path d="M 45 100 Q 42 48 100 40 Q 158 48 155 100 L 152 75 Q 130 65 100 70 Q 70 65 48 75 Z" fill={`url(#${gradId})`} />
      <path d="M 60 60 Q 80 50 100 55" stroke={hairLight} strokeWidth="2.5" fill="none" opacity="0.5" />
    </>
  )

  if (style === 'long') return (
    <>
      {/* Kakül */}
      <path d="M 48 80 Q 50 45 100 38 Q 150 45 152 80 L 145 70 Q 120 75 100 72 Q 80 75 55 70 Z" fill={`url(#${gradId})`} />
      <path d="M 65 60 Q 90 50 110 55" stroke={hairLight} strokeWidth="2" fill="none" opacity="0.55" />
    </>
  )

  if (style === 'curly') return (
    <g fill={`url(#${gradId})`}>
      <circle cx="52" cy="70" r="13" />
      <circle cx="68" cy="55" r="14" />
      <circle cx="85" cy="48" r="13" />
      <circle cx="100" cy="44" r="15" />
      <circle cx="115" cy="48" r="13" />
      <circle cx="132" cy="55" r="14" />
      <circle cx="148" cy="70" r="13" />
      <circle cx="58" cy="88" r="10" />
      <circle cx="142" cy="88" r="10" />
      <circle cx="78" cy="40" r="7" fill={hairLight} opacity="0.5" />
    </g>
  )

  if (style === 'wavy') return (
    <>
      <path d="M 48 88 Q 55 50 75 50 Q 90 62 100 50 Q 110 62 125 50 Q 145 50 152 88 L 145 72 Q 125 75 100 78 Q 75 75 55 72 Z" fill={`url(#${gradId})`} />
      <path d="M 70 60 Q 85 55 100 62 Q 115 55 130 60" stroke={hairLight} strokeWidth="2" fill="none" opacity="0.5" />
    </>
  )

  if (style === 'mohawk') return (
    <>
      <path d="M 80 50 Q 85 22 100 18 Q 115 22 120 50 L 115 48 Q 100 35 85 48 Z" fill={`url(#${gradId})`} />
      <path d="M 92 25 Q 100 20 108 25" stroke={hairLight} strokeWidth="2" fill="none" opacity="0.6" />
    </>
  )

  if (style === 'bun') return (
    <>
      <path d="M 48 88 Q 50 55 100 50 Q 150 55 152 88 L 145 72 Q 100 65 55 72 Z" fill={`url(#${gradId})`} />
    </>
  )

  if (style === 'ponytail') return (
    <>
      <path d="M 48 90 Q 50 50 100 45 Q 150 50 152 90 L 145 75 Q 100 62 55 75 Z" fill={`url(#${gradId})`} />
    </>
  )

  if (style === 'afro') return (
    <>
      <path d="M 55 100 Q 55 95 65 95 Q 85 92 100 95 Q 115 92 135 95 Q 145 95 145 100" stroke={hairShadow} strokeWidth="1" fill="none" opacity="0.5" />
    </>
  )

  return null
}

function Eyes({ style }: { style: string }) {
  if (style === 'normal') return (
    <>
      {/* Sol göz */}
      <ellipse cx="78" cy="98" rx="7" ry="8" fill="#fff" />
      <circle cx="78" cy="99" r="4.5" fill="#3D2914" />
      <circle cx="78" cy="99" r="2.5" fill="#1a1a1a" />
      <circle cx="80" cy="96" r="1.5" fill="#fff" />
      {/* Sağ göz */}
      <ellipse cx="122" cy="98" rx="7" ry="8" fill="#fff" />
      <circle cx="122" cy="99" r="4.5" fill="#3D2914" />
      <circle cx="122" cy="99" r="2.5" fill="#1a1a1a" />
      <circle cx="124" cy="96" r="1.5" fill="#fff" />
      {/* Kirpikler */}
      <path d="M 71 92 L 73 89 M 78 90 L 78 87 M 85 92 L 83 89" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M 115 92 L 117 89 M 122 90 L 122 87 M 129 92 L 127 89" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" />
    </>
  )

  if (style === 'smiling' || style === 'happy') return (
    <>
      <path d="M 70 96 Q 78 88 86 96" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 114 96 Q 122 88 130 96" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Yanak izi */}
      <path d="M 68 100 Q 70 102 73 101" stroke="#1a1a1a" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M 132 100 Q 130 102 127 101" stroke="#1a1a1a" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5" />
    </>
  )

  if (style === 'wink') return (
    <>
      <ellipse cx="78" cy="98" rx="7" ry="8" fill="#fff" />
      <circle cx="78" cy="99" r="4.5" fill="#3D2914" />
      <circle cx="78" cy="99" r="2.5" fill="#1a1a1a" />
      <circle cx="80" cy="96" r="1.5" fill="#fff" />
      <path d="M 71 92 L 73 89 M 78 90 L 78 87 M 85 92 L 83 89" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" />
      {/* Sağ - kapalı */}
      <path d="M 113 97 Q 122 90 131 97" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 117 92 L 119 89 M 125 92 L 127 89" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" />
    </>
  )

  if (style === 'shocked') return (
    <>
      <circle cx="78" cy="98" r="9" fill="#fff" stroke="#1a1a1a" strokeWidth="1.5" />
      <circle cx="78" cy="98" r="5" fill="#3D2914" />
      <circle cx="78" cy="98" r="3" fill="#1a1a1a" />
      <circle cx="80" cy="96" r="1.5" fill="#fff" />
      <circle cx="122" cy="98" r="9" fill="#fff" stroke="#1a1a1a" strokeWidth="1.5" />
      <circle cx="122" cy="98" r="5" fill="#3D2914" />
      <circle cx="122" cy="98" r="3" fill="#1a1a1a" />
      <circle cx="124" cy="96" r="1.5" fill="#fff" />
    </>
  )

  if (style === 'sleepy') return (
    <>
      <path d="M 70 100 Q 78 103 86 100" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 114 100 Q 122 103 130 100" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Kirpikler aşağı */}
      <path d="M 72 102 L 71 105 M 78 103 L 78 106 M 84 102 L 85 105" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M 116 102 L 115 105 M 122 103 L 122 106 M 128 102 L 129 105" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" />
    </>
  )

  return null
}

function Eyebrows({ style, color }: { style: string; color: string }) {
  if (style === 'normal') return (
    <>
      <path d="M 68 84 Q 78 80 88 84" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 112 84 Q 122 80 132 84" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  )

  if (style === 'raised') return (
    <>
      <path d="M 68 82 Q 78 74 88 80" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 112 80 Q 122 74 132 82" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  )

  if (style === 'angry') return (
    <>
      <path d="M 68 78 L 88 88" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M 132 78 L 112 88" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </>
  )

  if (style === 'sad') return (
    <>
      <path d="M 68 88 L 88 80" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M 132 88 L 112 80" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </>
  )

  return null
}

function Mouth({ style }: { style: string }) {
  if (style === 'smile') return (
    <>
      <path d="M 85 134 Q 100 145 115 134" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 88 137 Q 100 143 112 137" stroke="#D85A30" strokeWidth="1" fill="none" opacity="0.5" />
    </>
  )

  if (style === 'big_smile') return (
    <>
      <path d="M 78 130 Q 100 152 122 130 L 116 134 Q 100 145 84 134 Z" fill="#a32d2d" stroke="#1a1a1a" strokeWidth="1.5" />
      {/* Dişler */}
      <path d="M 88 134 L 88 140 M 95 134 L 95 142 M 102 134 L 102 142 M 109 134 L 109 140" stroke="#fff" strokeWidth="2" />
      <path d="M 85 132 Q 100 130 115 132" stroke="#fff" strokeWidth="2.5" fill="none" />
    </>
  )

  if (style === 'neutral') return (
    <>
      <path d="M 88 137 Q 100 138 112 137" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </>
  )

  if (style === 'sad') return (
    <>
      <path d="M 85 144 Q 100 134 115 144" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </>
  )

  if (style === 'shock') return (
    <>
      <ellipse cx="100" cy="138" rx="6" ry="9" fill="#3a1818" />
      <ellipse cx="100" cy="135" rx="4" ry="3" fill="#a32d2d" opacity="0.6" />
    </>
  )

  if (style === 'tongue') return (
    <>
      <path d="M 85 133 Q 100 145 115 133" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="100" cy="142" rx="7" ry="5" fill="#E48BB6" />
      <line x1="100" y1="140" x2="100" y2="146" stroke="#C4729E" strokeWidth="1" />
    </>
  )

  return null
}

function Facial({ style, color, shadow }: { style: string; color: string; shadow: string }) {
  if (style === 'mustache') return (
    <>
      <path d="M 82 128 Q 92 134 100 132 Q 108 134 118 128 L 113 131 Q 100 132 87 131 Z" fill={color} />
      <path d="M 88 130 Q 100 132 112 130" stroke={shadow} strokeWidth="0.5" fill="none" />
    </>
  )

  if (style === 'goatee') return (
    <>
      <path d="M 92 150 Q 100 165 108 150 Q 105 157 100 158 Q 95 157 92 150 Z" fill={color} />
    </>
  )

  if (style === 'full_beard') return (
    <>
      <path d="M 55 120 Q 55 155 100 165 Q 145 155 145 120 Q 138 145 100 145 Q 62 145 55 120 Z" fill={color} />
      <path d="M 65 130 Q 70 145 80 150 M 100 145 L 100 160 M 135 130 Q 130 145 120 150" stroke={shadow} strokeWidth="0.6" fill="none" opacity="0.5" />
    </>
  )

  if (style === 'soul_patch') return (
    <ellipse cx="100" cy="146" rx="3" ry="5" fill={color} />
  )

  return null
}

function Accessory({ style }: { style: string }) {
  if (style === 'glasses') return (
    <>
      <circle cx="78" cy="98" r="13" fill="none" stroke="#1a1a1a" strokeWidth="2.5" />
      <circle cx="122" cy="98" r="13" fill="none" stroke="#1a1a1a" strokeWidth="2.5" />
      <line x1="91" y1="98" x2="109" y2="98" stroke="#1a1a1a" strokeWidth="2.5" />
      <line x1="65" y1="98" x2="55" y2="95" stroke="#1a1a1a" strokeWidth="2" />
      <line x1="135" y1="98" x2="145" y2="95" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="73" cy="93" r="3" fill="#fff" opacity="0.3" />
      <circle cx="117" cy="93" r="3" fill="#fff" opacity="0.3" />
    </>
  )

  if (style === 'sunglasses') return (
    <>
      <path d="M 62 90 L 92 90 L 92 105 Q 88 110 78 110 Q 65 110 62 102 Z" fill="#1a1a1a" />
      <path d="M 108 90 L 138 90 L 138 102 Q 135 110 122 110 Q 112 110 108 105 Z" fill="#1a1a1a" />
      <line x1="92" y1="93" x2="108" y2="93" stroke="#1a1a1a" strokeWidth="2.5" />
      <ellipse cx="74" cy="96" rx="4" ry="2" fill="#fff" opacity="0.4" />
      <ellipse cx="124" cy="96" rx="4" ry="2" fill="#fff" opacity="0.4" />
    </>
  )

  if (style === 'round_glasses') return (
    <>
      <circle cx="78" cy="98" r="11" fill="none" stroke="#FFB800" strokeWidth="3" />
      <circle cx="122" cy="98" r="11" fill="none" stroke="#FFB800" strokeWidth="3" />
      <line x1="89" y1="98" x2="111" y2="98" stroke="#FFB800" strokeWidth="2.5" />
      <circle cx="74" cy="94" r="2.5" fill="#fff" opacity="0.4" />
      <circle cx="118" cy="94" r="2.5" fill="#fff" opacity="0.4" />
    </>
  )

  if (style === 'hat') return (
    <>
      <ellipse cx="100" cy="48" rx="62" ry="9" fill="#3D2914" />
      <path d="M 65 48 Q 70 22 100 20 Q 130 22 135 48 Z" fill="#5C2E1A" />
      <ellipse cx="100" cy="48" rx="62" ry="3" fill="#1a1a1a" opacity="0.4" />
      <path d="M 75 35 Q 90 30 100 32" stroke="#1a1a1a" strokeWidth="1" fill="none" opacity="0.3" />
    </>
  )

  if (style === 'cap') return (
    <>
      <path d="M 48 55 Q 100 28 152 55 L 152 68 L 48 68 Z" fill="#1D9E75" />
      <ellipse cx="100" cy="68" rx="58" ry="6" fill="#0F6E56" />
      <text x="100" y="50" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#fff">G</text>
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
