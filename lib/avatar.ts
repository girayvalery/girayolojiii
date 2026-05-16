// Bitmoji tarzı katmanlı SVG avatar sistemi

export type AvatarConfig = {
  skin: string       // ten rengi
  hair: string       // saç stili
  hairColor: string  // saç rengi
  eyes: string       // göz stili
  eyebrows: string   // kaş
  mouth: string      // ağız
  facial: string     // sakal/bıyık (veya yok)
  accessory: string  // gözlük/şapka (veya yok)
  bg: string         // arka plan rengi
}

export const DEFAULT_AVATAR: AvatarConfig = {
  skin: '#F5C9A1',
  hair: 'short',
  hairColor: '#3D2914',
  eyes: 'normal',
  eyebrows: 'normal',
  mouth: 'smile',
  facial: 'none',
  accessory: 'none',
  bg: '#1D9E75',
}

export const SKIN_TONES = [
  { id: 'fair', color: '#FFE3CD', label: 'Açık' },
  { id: 'light', color: '#F5C9A1', label: 'Buğday' },
  { id: 'medium', color: '#D9A574', label: 'Orta' },
  { id: 'tan', color: '#B07D4F', label: 'Bronz' },
  { id: 'dark', color: '#8B5E3C', label: 'Esmer' },
  { id: 'deep', color: '#5C3A1F', label: 'Koyu' },
]

export const HAIR_COLORS = [
  { id: 'black', color: '#1A1A1A', label: 'Siyah' },
  { id: 'brown', color: '#3D2914', label: 'Kahve' },
  { id: 'auburn', color: '#5C2E1A', label: 'Kestane' },
  { id: 'blonde', color: '#D4A45B', label: 'Sarı' },
  { id: 'red', color: '#A0421C', label: 'Kızıl' },
  { id: 'gray', color: '#888', label: 'Gri' },
  { id: 'white', color: '#E8E8E8', label: 'Beyaz' },
  { id: 'pink', color: '#E48BB6', label: 'Pembe' },
  { id: 'blue', color: '#5BA1D4', label: 'Mavi' },
  { id: 'green', color: '#5BD49A', label: 'Yeşil' },
  { id: 'purple', color: '#9B5BD4', label: 'Mor' },
  { id: 'orange', color: '#E48B5B', label: 'Turuncu' },
]

export const HAIR_STYLES = [
  { id: 'bald', label: 'Kel', emoji: '🥚' },
  { id: 'short', label: 'Kısa', emoji: '👨' },
  { id: 'mid', label: 'Orta', emoji: '🧑' },
  { id: 'long', label: 'Uzun', emoji: '👩' },
  { id: 'curly', label: 'Kıvırcık', emoji: '🦱' },
  { id: 'wavy', label: 'Dalgalı', emoji: '🌊' },
  { id: 'mohawk', label: 'Mohikan', emoji: '🦅' },
  { id: 'bun', label: 'Topuz', emoji: '🍩' },
  { id: 'ponytail', label: 'At Kuyruğu', emoji: '🐎' },
  { id: 'afro', label: 'Afro', emoji: '🎵' },
]

export const EYE_STYLES = [
  { id: 'normal', label: 'Normal' },
  { id: 'smiling', label: 'Gülen' },
  { id: 'wink', label: 'Göz Kırpan' },
  { id: 'shocked', label: 'Şaşkın' },
  { id: 'sleepy', label: 'Uykulu' },
  { id: 'happy', label: 'Mutlu' },
]

export const EYEBROW_STYLES = [
  { id: 'normal', label: 'Normal' },
  { id: 'raised', label: 'Kalkık' },
  { id: 'angry', label: 'Sinirli' },
  { id: 'sad', label: 'Üzgün' },
]

export const MOUTH_STYLES = [
  { id: 'smile', label: 'Gülümseme' },
  { id: 'big_smile', label: 'Büyük Gülümseme' },
  { id: 'neutral', label: 'Doğal' },
  { id: 'sad', label: 'Üzgün' },
  { id: 'shock', label: 'Şaşkın' },
  { id: 'tongue', label: 'Dil' },
]

export const FACIAL_STYLES = [
  { id: 'none', label: 'Yok' },
  { id: 'mustache', label: 'Bıyık' },
  { id: 'goatee', label: 'Keçi Sakal' },
  { id: 'full_beard', label: 'Tam Sakal' },
  { id: 'soul_patch', label: 'Alt Dudak' },
]

export const ACCESSORY_STYLES = [
  { id: 'none', label: 'Yok' },
  { id: 'glasses', label: 'Gözlük' },
  { id: 'sunglasses', label: 'Güneş Gözlüğü' },
  { id: 'round_glasses', label: 'Yuvarlak Gözlük' },
  { id: 'hat', label: 'Şapka' },
  { id: 'cap', label: 'Kep' },
]

export const BG_COLORS = [
  '#1D9E75', '#534AB7', '#185fa5', '#D4537E', '#D85A30', '#ba7517',
  '#1AAE9F', '#7F77DD', '#639922', '#FF6B35', '#A0421C', '#0F6E56',
]
