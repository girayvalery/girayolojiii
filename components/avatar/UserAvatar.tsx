'use client'
import SvgAvatar from './SvgAvatar'
import { AvatarConfig, DEFAULT_AVATAR } from '@/lib/avatar'

type Props = {
  user: {
    avatar?: string
    avatarColor?: string
    avatarConfig?: AvatarConfig | null
    photoUrl?: string
    name?: string
  }
  size?: number
}

export default function UserAvatar({ user, size = 40 }: Props) {
  // 1. Fotoğraf varsa fotoğraf göster
  if (user.photoUrl && user.photoUrl.length > 0) {
    return (
      <img
        src={user.photoUrl}
        alt={user.name || 'user'}
        className="rounded-full object-cover"
        style={{
          width: size,
          height: size,
          border: `2px solid ${user.avatarColor || '#1D9E75'}55`,
        }}
      />
    )
  }

  // 2. Bitmoji config varsa SVG göster
  if (user.avatarConfig) {
    return (
      <div className="rounded-full overflow-hidden" style={{ width: size, height: size }}>
        <SvgAvatar config={user.avatarConfig} size={size} />
      </div>
    )
  }

  // 3. Fallback - default bitmoji (emoji DEĞİL)
  return (
    <div className="rounded-full overflow-hidden" style={{ width: size, height: size }}>
      <SvgAvatar config={{ ...DEFAULT_AVATAR, bg: user.avatarColor || '#1D9E75' }} size={size} />
    </div>
  )
}
