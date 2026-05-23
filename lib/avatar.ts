// Bitmoji avatar - cinsiyetli, kafa yapısına tam oturan

export type Gender = 'male' | 'female'

export type AvatarConfig = {
  gender: Gender
  skin: string
  hair: string
  hairColor: string
  eyes: string
  eyebrows: string
  mouth: string
  facial: string  // sadece male
  accessory: string
  bg: string
  lipColor: string  // ağız/dudak rengi (female için makyaj)
}

export const DEFAULT_AVATAR: AvatarConfig = {
  gender: 'male',
  skin: '#F5C9A1',
  hair: 'short',
  hairColor: '#3D2914',
  eyes: 'normal',
  eyebrows: 'normal',
  mouth: 'smile',
  facial: 'none',
  accessory: 'none',
  bg: '#1D9E75',
  lipColor: '#C16060',
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

// Erkek saç stilleri
export const MALE_HAIR_STYLES = [
  { id: 'bald', label: 'Kel' },
  { id: 'short', label: 'Kısa' },
  { id: 'short_messy', label: 'Dağınık' },
  { id: 'spiky', label: 'Dikleştirilmiş' },
  { id: 'side_part', label: 'Yan Ayrım' },
  { id: 'curly_m', label: 'Kıvırcık' },
  { id: 'mohawk', label: 'Mohikan' },
  { id: 'undercut', label: 'Undercut' },
  { id: 'wavy_m', label: 'Dalgalı' },
  { id: 'mid_m', label: 'Orta' },
]

// Kız saç stilleri
export const FEMALE_HAIR_STYLES = [
  { id: 'long_f', label: 'Uzun Düz' },
  { id: 'long_wavy', label: 'Uzun Dalgalı' },
  { id: 'long_curly', label: 'Uzun Kıvırcık' },
  { id: 'bob', label: 'Bob' },
  { id: 'ponytail_f', label: 'At Kuyruğu' },
  { id: 'bun_f', label: 'Topuz' },
  { id: 'pigtails', label: 'İki Örgü' },
  { id: 'short_f', label: 'Kısa Bayan' },
  { id: 'side_swept', label: 'Yan Süpürme' },
  { id: 'afro_f', label: 'Afro' },
]

export const EYE_STYLES = [
  { id: 'normal', label: 'Normal' },
  { id: 'big', label: 'Büyük' },
  { id: 'smiling', label: 'Gülen' },
  { id: 'wink', label: 'Göz Kırpan' },
  { id: 'shocked', label: 'Şaşkın' },
  { id: 'sleepy', label: 'Uykulu' },
]

export const EYEBROW_STYLES = [
  { id: 'normal', label: 'Normal' },
  { id: 'thick', label: 'Kalın' },
  { id: 'thin', label: 'İnce' },
  { id: 'raised', label: 'Kalkık' },
  { id: 'angry', label: 'Sinirli' },
  { id: 'sad', label: 'Üzgün' },
]

export const MOUTH_STYLES = [
  { id: 'smile', label: 'Gülümseme' },
  { id: 'big_smile', label: 'Geniş Gülümseme' },
  { id: 'neutral', label: 'Doğal' },
  { id: 'sad', label: 'Üzgün' },
  { id: 'shock', label: 'Şaşkın' },
  { id: 'kiss', label: 'Öpücük' },
]

export const FACIAL_STYLES = [
  { id: 'none', label: 'Yok' },
  { id: 'mustache', label: 'Bıyık' },
  { id: 'goatee', label: 'Keçi Sakal' },
  { id: 'full_beard', label: 'Tam Sakal' },
  { id: 'stubble', label: 'Sakal Tıraşsız' },
]

export const ACCESSORY_STYLES = [
  { id: 'none', label: 'Yok' },
  { id: 'glasses', label: 'Gözlük' },
  { id: 'sunglasses', label: 'Güneş Gözlüğü' },
  { id: 'round_glasses', label: 'Yuvarlak Gözlük' },
  { id: 'hat', label: 'Şapka' },
  { id: 'cap', label: 'Kep' },
  { id: 'beanie', label: 'Bere' },
]

export const LIP_COLORS = [
  { id: 'natural', color: '#C16060', label: 'Doğal' },
  { id: 'pink', color: '#E48BB6', label: 'Pembe' },
  { id: 'red', color: '#D32F2F', label: 'Kırmızı' },
  { id: 'berry', color: '#8B2C5C', label: 'Bordo' },
  { id: 'nude', color: '#B07D6A', label: 'Çıplak' },
  { id: 'coral', color: '#E08070', label: 'Mercan' },
]

export const BG_COLORS = [
  '#1D9E75', '#534AB7', '#185fa5', '#D4537E', '#D85A30', '#ba7517',
  '#1AAE9F', '#7F77DD', '#639922', '#FF6B35', '#A0421C', '#0F6E56',
]

export function getHairStyles(gender: Gender) {
  return gender === 'male' ? MALE_HAIR_STYLES : FEMALE_HAIR_STYLES
}
