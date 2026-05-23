'use client'
import { AvatarConfig, DEFAULT_AVATAR } from '@/lib/avatar'

type Props = { config: AvatarConfig; size?: number; showBg?: boolean }

/*
FLAT VECTOR STYLE:
  - Net siyah kontur çizgileri (1.5-2px)
  - Düz renkler, gradient sadece arka planda
  - Geometrik basit şekiller, büyük bloklar
  - Yüz oval: cx=100 cy=108 rx=44 ry=54
  - Yüz tepe y=54, çene y=162
*/

const STROKE = '#1F1F2E'
const STROKE_W = 1.8

export default function SvgAvatar({ config, size = 120, showBg = true }: Props) {
  const c = { ...DEFAULT_AVATAR, ...config }
  const isFemale = c.gender === 'female'
  const uid = (c.bg + c.skin + c.hairColor).replace(/#/g, '')

  return (
    <svg viewBox="0 0 200 200" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`bg-${uid}`} cx="50%" cy="40%">
          <stop offset="0%" stopColor={shade(c.bg, 18)} />
          <stop offset="100%" stopColor={c.bg} />
        </radialGradient>
      </defs>

      {showBg && <rect x="0" y="0" width="200" height="200" fill={`url(#bg-${uid})`} rx="100" />}

      {/* ARKA SAÇ */}
      <HairBack style={c.hair} color={c.hairColor} />

      {/* BOYUN */}
      <path d="M 88 160 L 88 174 Q 88 178 100 180 Q 112 178 112 174 L 112 160 Z"
        fill={c.skin} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" />

      {/* YÜZ - oval */}
      <ellipse cx="100" cy="108" rx="44" ry="54" fill={c.skin} stroke={STROKE} strokeWidth={STROKE_W} />

      {/* KULAKLAR */}
      <ellipse cx="56" cy="112" rx="5" ry="10" fill={c.skin} stroke={STROKE} strokeWidth={STROKE_W} />
      <ellipse cx="144" cy="112" rx="5" ry="10" fill={c.skin} stroke={STROKE} strokeWidth={STROKE_W} />

      {/* YANAK kızarması - sadece female */}
      {isFemale && (
        <>
          <ellipse cx="76" cy="124" rx="8" ry="4" fill="#FF7A95" opacity="0.55" />
          <ellipse cx="124" cy="124" rx="8" ry="4" fill="#FF7A95" opacity="0.55" />
        </>
      )}

      {/* KAŞ */}
      <Eyebrows style={c.eyebrows} color={c.hairColor} />

      {/* GÖZLER */}
      <Eyes style={c.eyes} isFemale={isFemale} />

      {/* BURUN */}
      <Nose />

      {/* SAKAL (yüzü çevreler) */}
      {!isFemale && c.facial !== 'none' && c.facial !== 'mustache' && (
        <Facial style={c.facial} color={c.hairColor} />
      )}

      {/* AĞIZ */}
      <Mouth style={c.mouth} lipColor={c.lipColor} isFemale={isFemale}
        hasBeard={!isFemale && (c.facial === 'full_beard' || c.facial === 'goatee')} />

      {/* BIYIK */}
      {!isFemale && (c.facial === 'mustache' || c.facial === 'full_beard') && (
        <path d="M 84 130 Q 92 136 100 134 Q 108 136 116 130 L 110 132 Q 100 134 90 132 Z"
          fill={c.hairColor} stroke={STROKE} strokeWidth="1" strokeLinejoin="round" />
      )}

      {/* ÖN SAÇ */}
      <HairFront style={c.hair} color={c.hairColor} />

      {/* AKSESUAR */}
      <Accessory style={c.accessory} />
    </svg>
  )
}

/* ============================================================
   ARKA SAÇ (kafanın arkası)
   ============================================================ */
function HairBack({ style, color }: { style: string; color: string }) {
  const colorDark = shade(color, -20)

  if (style === 'long_f') return (
    <>
      <path d="M 42 105 Q 30 36 100 26 Q 170 36 158 105"
        fill={color} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" />
      <path d="M 42 105 Q 22 145 26 200 L 60 200 Q 50 150 56 110 Z"
        fill={color} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" />
      <path d="M 158 105 Q 178 145 174 200 L 140 200 Q 150 150 144 110 Z"
        fill={color} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" />
    </>
  )

  if (style === 'long_wavy') return (
    <>
      <path d="M 42 105 Q 30 34 100 24 Q 170 34 158 105"
        fill={color} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" />
      <path d="M 42 105 Q 22 140 30 175 Q 18 200 44 200 Q 56 175 58 140 Q 60 115 56 108 Z"
        fill={color} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" />
      <path d="M 158 105 Q 178 140 170 175 Q 182 200 156 200 Q 144 175 142 140 Q 140 115 144 108 Z"
        fill={color} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" />
    </>
  )

  if (style === 'long_curly') return (
    <g fill={color} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round">
      <path d="M 44 80 Q 36 26 100 20 Q 164 26 156 80 L 156 70 Q 100 60 44 70 Z" />
      <circle cx="40" cy="98" r="14" />
      <circle cx="34" cy="125" r="14" />
      <circle cx="38" cy="155" r="15" />
      <circle cx="50" cy="185" r="13" />
      <circle cx="160" cy="98" r="14" />
      <circle cx="166" cy="125" r="14" />
      <circle cx="162" cy="155" r="15" />
      <circle cx="150" cy="185" r="13" />
    </g>
  )

  if (style === 'ponytail_f') return (
    <ellipse cx="164" cy="135" rx="14" ry="44" fill={color} stroke={STROKE} strokeWidth={STROKE_W} />
  )

  if (style === 'bun_f') return (
    <g>
      <circle cx="100" cy="32" r="22" fill={color} stroke={STROKE} strokeWidth={STROKE_W} />
      <path d="M 78 40 Q 100 46 122 40" stroke={colorDark} strokeWidth="1.5" fill="none" />
    </g>
  )

  if (style === 'pigtails') return (
    <g fill={color} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round">
      <ellipse cx="32" cy="120" rx="13" ry="34" />
      <ellipse cx="168" cy="120" rx="13" ry="34" />
      <circle cx="32" cy="92" r="11" />
      <circle cx="168" cy="92" r="11" />
    </g>
  )

  if (style === 'afro_f' || style === 'afro') return (
    <ellipse cx="100" cy="62" rx="74" ry="50" fill={color} stroke={STROKE} strokeWidth={STROKE_W} />
  )

  return null
}

/* ============================================================
   ÖN SAÇ (kafanın üstü + kakül)
   ============================================================ */
function HairFront({ style, color }: { style: string; color: string }) {
  if (style === 'bald') return null
  const colorDark = shade(color, -20)

  // ========== ERKEK ==========
  if (style === 'short') return (
    <path d="M 54 86 Q 52 38 100 32 Q 148 38 146 86 Q 140 70 128 68 Q 115 62 100 66 Q 85 62 72 68 Q 60 70 54 86 Z"
      fill={color} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" />
  )

  if (style === 'short_messy') return (
    <g fill={color} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round">
      <path d="M 54 90 Q 52 42 100 35 Q 148 42 146 90 Q 138 70 128 66 Q 115 60 100 66 Q 85 60 72 66 Q 62 70 54 90 Z" />
      <path d="M 70 42 L 76 26 L 82 44 Z" />
      <path d="M 88 36 L 92 22 L 98 40 Z" />
      <path d="M 104 38 L 108 22 L 114 40 Z" />
      <path d="M 118 42 L 124 28 L 128 46 Z" />
    </g>
  )

  if (style === 'spiky') return (
    <g fill={color} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round">
      <path d="M 54 82 Q 54 58 100 54 Q 146 58 146 82 L 142 72 Q 100 64 58 72 Z" />
      <path d="M 56 60 L 50 18 L 68 56 Z" />
      <path d="M 72 56 L 66 10 L 84 54 Z" />
      <path d="M 88 52 L 84 6 L 100 52 Z" />
      <path d="M 100 52 L 116 6 L 112 52 Z" />
      <path d="M 116 54 L 134 10 L 128 56 Z" />
      <path d="M 132 56 L 150 18 L 144 60 Z" />
    </g>
  )

  if (style === 'side_part') return (
    <g>
      <path d="M 54 86 Q 52 36 100 30 Q 148 36 146 86 Z"
        fill={color} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" />
      <path d="M 92 34 Q 80 60 76 86" stroke={STROKE} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 92 34 Q 80 60 76 86 L 92 80 Q 80 50 96 38 Z" fill={colorDark} opacity="0.4" />
    </g>
  )

  if (style === 'curly_m') return (
    <g fill={color} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round">
      <path d="M 44 90 Q 32 50 60 32 Q 80 18 100 22 Q 120 18 140 32 Q 168 50 156 90 Q 142 70 128 70 Q 110 58 100 68 Q 90 58 72 70 Q 58 70 44 90 Z" />
      <circle cx="58" cy="42" r="9" />
      <circle cx="74" cy="30" r="10" />
      <circle cx="90" cy="24" r="10" />
      <circle cx="100" cy="20" r="10" />
      <circle cx="110" cy="24" r="10" />
      <circle cx="126" cy="30" r="10" />
      <circle cx="142" cy="42" r="9" />
      <circle cx="48" cy="62" r="9" />
      <circle cx="152" cy="62" r="9" />
    </g>
  )

  if (style === 'mohawk') return (
    <g>
      {/* Yanlar - gölge ile tıraşlı */}
      <path d="M 54 95 Q 54 76 80 78 L 80 90 Q 64 90 54 95 Z" fill={colorDark} stroke={STROKE} strokeWidth="1.2" />
      <path d="M 146 95 Q 146 76 120 78 L 120 90 Q 136 90 146 95 Z" fill={colorDark} stroke={STROKE} strokeWidth="1.2" />
      {/* Mohikan - dar yüksek tepe */}
      <path d="M 86 56 Q 88 16 100 10 Q 112 16 114 56 L 110 50 Q 100 38 90 50 Z"
        fill={color} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" />
      {/* Mohikan üstü püsküller */}
      <path d="M 92 22 L 96 6 L 100 22 Z" fill={color} stroke={STROKE} strokeWidth="1.2" />
      <path d="M 100 22 L 104 6 L 108 22 Z" fill={color} stroke={STROKE} strokeWidth="1.2" />
    </g>
  )

  if (style === 'undercut') return (
    <g>
      <path d="M 54 100 Q 54 86 100 84 Q 146 86 146 100 L 146 94 Q 100 86 54 94 Z"
        fill={colorDark} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" />
      <path d="M 62 84 Q 58 36 100 28 Q 142 36 138 84 L 130 60 Q 110 52 92 56 Q 76 52 70 60 Z"
        fill={color} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" />
    </g>
  )

  if (style === 'wavy_m') return (
    <g>
      <path d="M 52 88 Q 50 42 78 32 Q 92 38 100 28 Q 108 38 122 32 Q 150 42 148 88 L 142 72 Q 120 78 100 80 Q 80 78 58 72 Z"
        fill={color} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" />
      <path d="M 60 52 Q 76 44 88 52 Q 100 42 112 52 Q 124 44 140 52" stroke={STROKE} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
  )

  if (style === 'mid_m') return (
    <g>
      <path d="M 46 96 Q 44 34 100 26 Q 156 34 154 96 L 148 74 Q 130 58 100 62 Q 70 58 52 74 Z"
        fill={color} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" />
      <path d="M 70 56 Q 100 48 130 56" stroke={STROKE} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
  )

  // ========== KIZ ==========
  if (style === 'long_f') return (
    <path d="M 50 80 Q 54 32 100 26 Q 146 32 150 80 L 146 74 Q 130 80 100 76 Q 70 80 54 74 Z"
      fill={color} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" />
  )

  if (style === 'long_wavy') return (
    <g>
      <path d="M 50 82 Q 54 32 100 26 Q 146 32 150 82 L 146 72 Q 124 82 100 78 Q 76 82 54 72 Z"
        fill={color} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" />
      <path d="M 60 56 Q 80 48 100 56 Q 120 48 140 56" stroke={STROKE} strokeWidth="1.3" fill="none" strokeLinecap="round" />
    </g>
  )

  if (style === 'long_curly') return (
    <g fill={color} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round">
      <path d="M 46 80 Q 38 24 100 18 Q 162 24 154 80 L 152 74 Q 100 62 48 74 Z" />
      <circle cx="58" cy="44" r="10" />
      <circle cx="74" cy="30" r="11" />
      <circle cx="88" cy="22" r="11" />
      <circle cx="100" cy="18" r="11" />
      <circle cx="112" cy="22" r="11" />
      <circle cx="126" cy="30" r="11" />
      <circle cx="142" cy="44" r="10" />
    </g>
  )

  if (style === 'bob') return (
    <path d="M 46 118 Q 46 36 100 28 Q 154 36 154 118 L 152 105 Q 130 110 100 110 Q 70 110 48 105 Z"
      fill={color} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" />
  )

  if (style === 'ponytail_f') return (
    <path d="M 50 90 Q 52 32 100 26 Q 148 32 150 90 L 144 72 Q 100 62 56 72 Z"
      fill={color} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" />
  )

  if (style === 'bun_f') return (
    <path d="M 52 80 Q 54 38 100 32 Q 146 38 148 80 L 142 70 Q 100 62 58 70 Z"
      fill={color} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" />
  )

  if (style === 'pigtails') return (
    <path d="M 48 92 Q 52 34 100 28 Q 148 34 152 92 L 142 72 Q 100 64 58 72 Z"
      fill={color} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" />
  )

  if (style === 'short_f') return (
    <path d="M 52 95 Q 54 38 100 32 Q 146 38 148 95 L 142 78 Q 130 82 100 82 Q 70 82 56 78 Z"
      fill={color} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" />
  )

  if (style === 'side_swept') return (
    <g>
      <path d="M 50 95 Q 54 34 100 28 Q 146 34 150 95 L 146 78 Q 88 56 60 80 Q 56 88 50 95 Z"
        fill={color} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" />
      <path d="M 92 54 Q 116 44 140 52" stroke={STROKE} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
  )

  if (style === 'afro_f') return null

  return null
}

/* ============================================================
   GÖZLER - flat tarz, kontur var
   ============================================================ */
function Eyes({ style, isFemale }: { style: string; isFemale: boolean }) {
  if (style === 'normal') return (
    <g>
      <ellipse cx="78" cy="100" rx="5.5" ry="6.5" fill="#fff" stroke={STROKE} strokeWidth="1.5" />
      <circle cx="78" cy="100" r="3.5" fill="#1F1F2E" />
      <circle cx="79.5" cy="98" r="1.3" fill="#fff" />
      <ellipse cx="122" cy="100" rx="5.5" ry="6.5" fill="#fff" stroke={STROKE} strokeWidth="1.5" />
      <circle cx="122" cy="100" r="3.5" fill="#1F1F2E" />
      <circle cx="123.5" cy="98" r="1.3" fill="#fff" />
      {isFemale && (
        <>
          <path d="M 72 93 L 71 90 M 78 92 L 78 89 M 84 93 L 85 90" stroke={STROKE} strokeWidth="1.3" strokeLinecap="round" />
          <path d="M 116 93 L 115 90 M 122 92 L 122 89 M 128 93 L 129 90" stroke={STROKE} strokeWidth="1.3" strokeLinecap="round" />
        </>
      )}
    </g>
  )

  if (style === 'big') return (
    <g>
      <ellipse cx="78" cy="100" rx="7" ry="8" fill="#fff" stroke={STROKE} strokeWidth="1.5" />
      <circle cx="78" cy="100" r="4.5" fill="#1F1F2E" />
      <circle cx="79.5" cy="98" r="1.6" fill="#fff" />
      <ellipse cx="122" cy="100" rx="7" ry="8" fill="#fff" stroke={STROKE} strokeWidth="1.5" />
      <circle cx="122" cy="100" r="4.5" fill="#1F1F2E" />
      <circle cx="123.5" cy="98" r="1.6" fill="#fff" />
      <path d="M 71 90 L 70 86 M 75 88 L 74 84 M 78 87 L 78 83 M 81 88 L 82 84 M 85 90 L 86 86" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M 115 90 L 114 86 M 119 88 L 118 84 M 122 87 L 122 83 M 125 88 L 126 84 M 129 90 L 130 86" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" />
    </g>
  )

  if (style === 'smiling') return (
    <g>
      <path d="M 71 98 Q 78 90 85 98" stroke={STROKE} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 115 98 Q 122 90 129 98" stroke={STROKE} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </g>
  )

  if (style === 'wink') return (
    <g>
      <ellipse cx="78" cy="100" rx="5.5" ry="6.5" fill="#fff" stroke={STROKE} strokeWidth="1.5" />
      <circle cx="78" cy="100" r="3.5" fill="#1F1F2E" />
      <circle cx="79.5" cy="98" r="1.3" fill="#fff" />
      <path d="M 115 100 Q 122 94 129 100" stroke={STROKE} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </g>
  )

  if (style === 'shocked') return (
    <g>
      <circle cx="78" cy="100" r="7" fill="#fff" stroke={STROKE} strokeWidth="1.8" />
      <circle cx="78" cy="100" r="4" fill="#1F1F2E" />
      <circle cx="79.5" cy="98" r="1.3" fill="#fff" />
      <circle cx="122" cy="100" r="7" fill="#fff" stroke={STROKE} strokeWidth="1.8" />
      <circle cx="122" cy="100" r="4" fill="#1F1F2E" />
      <circle cx="123.5" cy="98" r="1.3" fill="#fff" />
    </g>
  )

  if (style === 'sleepy') return (
    <g>
      <path d="M 72 100 Q 78 103 84 100" stroke={STROKE} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M 116 100 Q 122 103 128 100" stroke={STROKE} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <line x1="74" y1="103" x2="74" y2="106" stroke={STROKE} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="78" y1="104" x2="78" y2="107" stroke={STROKE} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="82" y1="103" x2="82" y2="106" stroke={STROKE} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="118" y1="103" x2="118" y2="106" stroke={STROKE} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="122" y1="104" x2="122" y2="107" stroke={STROKE} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="126" y1="103" x2="126" y2="106" stroke={STROKE} strokeWidth="1.2" strokeLinecap="round" />
    </g>
  )

  return null
}

/* ============================================================
   KAŞ
   ============================================================ */
function Eyebrows({ style, color }: { style: string; color: string }) {
  const dark = shade(color, -30)

  if (style === 'normal') return (
    <g fill={dark}>
      <path d="M 70 85 Q 78 80 86 85 Q 80 82 76 84 Q 72 85 70 85 Z" />
      <path d="M 114 85 Q 122 80 130 85 Q 128 85 124 84 Q 120 82 114 85 Z" />
    </g>
  )

  if (style === 'thick') return (
    <g fill={dark}>
      <path d="M 70 86 Q 78 78 86 84 Q 80 82 76 84 Q 72 85 70 86 Z" />
      <path d="M 114 84 Q 122 78 130 86 Q 128 85 124 84 Q 120 82 114 84 Z" />
    </g>
  )

  if (style === 'thin') return (
    <g>
      <path d="M 72 85 Q 78 81 86 85" stroke={dark} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 114 85 Q 122 81 128 85" stroke={dark} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
  )

  if (style === 'raised') return (
    <g>
      <path d="M 72 83 Q 78 76 86 82" stroke={dark} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 114 82 Q 122 76 128 83" stroke={dark} strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  )

  if (style === 'angry') return (
    <g>
      <path d="M 72 80 L 86 86" stroke={dark} strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M 128 80 L 114 86" stroke={dark} strokeWidth="3.2" fill="none" strokeLinecap="round" />
    </g>
  )

  if (style === 'sad') return (
    <g>
      <path d="M 72 86 L 86 81" stroke={dark} strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M 128 86 L 114 81" stroke={dark} strokeWidth="3.2" fill="none" strokeLinecap="round" />
    </g>
  )

  return null
}

/* ============================================================
   BURUN - basit
   ============================================================ */
function Nose() {
  return (
    <path d="M 96 110 Q 95 122 100 124 L 104 124" stroke={STROKE} strokeWidth="1.5" fill="none" strokeLinecap="round" />
  )
}

/* ============================================================
   AĞIZ
   ============================================================ */
function Mouth({ style, lipColor, isFemale, hasBeard }: { style: string; lipColor: string; isFemale: boolean; hasBeard: boolean }) {
  const yShift = hasBeard ? -4 : 0
  const y = 140 + yShift
  const lip = isFemale ? lipColor : '#C16060'

  if (style === 'smile') return (
    <g>
      <path d={`M 87 ${y - 1} Q 100 ${y + 7} 113 ${y - 1}`} stroke={STROKE} strokeWidth="2" fill="none" strokeLinecap="round" />
      {isFemale && <path d={`M 88 ${y} Q 100 ${y + 5} 112 ${y}`} stroke={lip} strokeWidth="1.5" fill="none" />}
    </g>
  )

  if (style === 'big_smile') return (
    <g>
      <path d={`M 84 ${y - 3} Q 100 ${y + 10} 116 ${y - 3}`} fill="#7a1f1f" stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" />
      <path d={`M 87 ${y - 2} L 113 ${y - 2} L 110 ${y + 2} L 90 ${y + 2} Z`} fill="#fff" />
      <line x1="93" y1={y - 2} x2="93" y2={y + 2} stroke={STROKE} strokeWidth="1" />
      <line x1="100" y1={y - 2} x2="100" y2={y + 2} stroke={STROKE} strokeWidth="1" />
      <line x1="107" y1={y - 2} x2="107" y2={y + 2} stroke={STROKE} strokeWidth="1" />
    </g>
  )

  if (style === 'neutral') return (
    <line x1="89" y1={y + 1} x2="111" y2={y + 1} stroke={STROKE} strokeWidth="2" strokeLinecap="round" />
  )

  if (style === 'sad') return (
    <path d={`M 87 ${y + 5} Q 100 ${y - 2} 113 ${y + 5}`} stroke={STROKE} strokeWidth="2" fill="none" strokeLinecap="round" />
  )

  if (style === 'shock') return (
    <ellipse cx="100" cy={y + 2} rx="5" ry="7" fill="#3a1818" stroke={STROKE} strokeWidth="1.5" />
  )

  if (style === 'kiss') return (
    <path d={`M 94 ${y} Q 100 ${y - 4} 106 ${y} Q 102 ${y + 4} 100 ${y + 5} Q 98 ${y + 4} 94 ${y} Z`}
      fill={lip} stroke={STROKE} strokeWidth="1.5" strokeLinejoin="round" />
  )

  return null
}

/* ============================================================
   SAKAL
   ============================================================ */
function Facial({ style, color }: { style: string; color: string }) {
  if (style === 'goatee') return (
    <path d="M 92 146 Q 100 160 108 146 Q 105 154 100 156 Q 95 154 92 146 Z"
      fill={color} stroke={STROKE} strokeWidth="1.2" strokeLinejoin="round" />
  )

  if (style === 'full_beard') return (
    <g fill={color} stroke={STROKE} strokeWidth="1.2" strokeLinejoin="round">
      <path d="M 60 120 Q 62 158 100 165 Q 138 158 140 120 Q 134 146 100 146 Q 66 146 60 120 Z" />
      <path d="M 84 130 Q 92 134 100 132 Q 108 134 116 130 L 110 132 Q 100 134 90 132 Z" />
      <path d="M 56 108 Q 54 130 64 145 Q 70 138 70 122 Z" />
      <path d="M 144 108 Q 146 130 136 145 Q 130 138 130 122 Z" />
    </g>
  )

  if (style === 'stubble') return (
    <ellipse cx="100" cy="140" rx="32" ry="14" fill={shade(color, -15)} opacity="0.4" />
  )

  return null
}

/* ============================================================
   AKSESUAR
   ============================================================ */
function Accessory({ style }: { style: string }) {
  if (style === 'glasses') return (
    <g>
      <circle cx="78" cy="100" r="10" fill="none" stroke={STROKE} strokeWidth="2.5" />
      <circle cx="122" cy="100" r="10" fill="none" stroke={STROKE} strokeWidth="2.5" />
      <line x1="88" y1="100" x2="112" y2="100" stroke={STROKE} strokeWidth="2.2" />
      <line x1="68" y1="100" x2="56" y2="98" stroke={STROKE} strokeWidth="2" />
      <line x1="132" y1="100" x2="144" y2="98" stroke={STROKE} strokeWidth="2" />
    </g>
  )

  if (style === 'sunglasses') return (
    <g>
      <path d="M 66 92 L 92 92 L 92 106 Q 88 110 78 110 Q 68 110 66 102 Z" fill="#1F1F2E" stroke={STROKE} strokeWidth="1.5" />
      <path d="M 108 92 L 134 92 L 134 102 Q 132 110 122 110 Q 112 110 108 106 Z" fill="#1F1F2E" stroke={STROKE} strokeWidth="1.5" />
      <line x1="92" y1="95" x2="108" y2="95" stroke={STROKE} strokeWidth="2.5" />
      <ellipse cx="74" cy="97" rx="4" ry="2" fill="#fff" opacity="0.4" />
      <ellipse cx="120" cy="97" rx="4" ry="2" fill="#fff" opacity="0.4" />
    </g>
  )

  if (style === 'round_glasses') return (
    <g>
      <circle cx="78" cy="100" r="9.5" fill="none" stroke="#FFB800" strokeWidth="2.8" />
      <circle cx="122" cy="100" r="9.5" fill="none" stroke="#FFB800" strokeWidth="2.8" />
      <line x1="88" y1="100" x2="112" y2="100" stroke="#FFB800" strokeWidth="2.2" />
    </g>
  )

  if (style === 'hat') return (
    <g>
      <ellipse cx="100" cy="50" rx="60" ry="7" fill="#3D2914" stroke={STROKE} strokeWidth="1.5" />
      <path d="M 70 50 Q 74 18 100 16 Q 126 18 130 50 Z" fill="#5C2E1A" stroke={STROKE} strokeWidth="1.5" strokeLinejoin="round" />
      <ellipse cx="100" cy="44" rx="30" ry="2" fill="#3D2914" />
    </g>
  )

  if (style === 'cap') return (
    <g>
      <path d="M 50 50 Q 100 22 150 50 L 150 64 L 50 64 Z" fill="#1D9E75" stroke={STROKE} strokeWidth="1.5" strokeLinejoin="round" />
      <ellipse cx="100" cy="64" rx="55" ry="5" fill="#0F6E56" stroke={STROKE} strokeWidth="1.5" />
      <text x="100" y="48" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#fff">G</text>
    </g>
  )

  if (style === 'beanie') return (
    <g>
      <path d="M 52 70 Q 52 22 100 18 Q 148 22 148 70 L 52 70 Z" fill="#D85A30" stroke={STROKE} strokeWidth="1.8" strokeLinejoin="round" />
      <rect x="52" y="62" width="96" height="10" fill="#A0421C" stroke={STROKE} strokeWidth="1.5" />
      <circle cx="100" cy="18" r="6" fill="#FFE3CD" stroke={STROKE} strokeWidth="1.5" />
    </g>
  )

  return null
}

function shade(color: string, percent: number): string {
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
