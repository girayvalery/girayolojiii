'use client'
import SvgAvatar from './SvgAvatar'
import type { AvatarConfig } from '@/lib/avatar'

type Props = {
  user: {
    avatar?: string
    avatarColor?: string
    avatarConfig?: AvatarConfig
    photoUrl?: string
    name?: string
  }
  size?: number
}

export default function UserAvatar({ user, size = 40 }: Props) {
  if (user.photoUrl) {
    return <img src={user.photoUrl} alt={user.name || 'user'}
      className="rounded-full object-cover"
      style={{ width: size, height: size, border: `2px solid ${user.avatarColor || '#1D9E75'}55` }} />
  }
  if (user.avatarConfig) {
    return (
      <div className="rounded-full overflow-hidden" style={{ width: size, height: size }}>
        <SvgAvatar config={user.avatarConfig} size={size} />
      </div>
    )
  }
  // Fallback: emoji avatar
  return (
    <div className="rounded-full flex items-center justify-center"
      style={{
        width: size, height: size,
        background: `${user.avatarColor || '#1D9E75'}22`,
        border: `2px solid ${user.avatarColor || '#1D9E75'}55`,
        fontSize: size * 0.5,
      }}>
      {user.avatar || '🧑'}
    </div>
  )
}
