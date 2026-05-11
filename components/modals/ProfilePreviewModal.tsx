'use client'
import Link from 'next/link'
import { useState } from 'react'
import { getUserById } from '@/lib/data'
import { useBodyLock } from '@/lib/useBodyLock'
import { useAuthGate } from '@/components/auth/AuthGate'

export default function ProfilePreviewModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const user = getUserById(userId)
  const { requireAuth } = useAuthGate()
  const [following, setFollowing] = useState(false)
  useBodyLock(true)

  if (!user) return null

  function toggleFollow() {
    if (!requireAuth('Takip etmek')) return
    setFollowing(p => !p)
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl shadow-2xl animate-fade-up overflow-hidden"
        style={{ background: '#161616', border: '1px solid #2a2a2a' }}
        onClick={e => e.stopPropagation()}>
        <div className="h-20" style={{ background: `linear-gradient(135deg, ${user.avatarColor} 0%, #0F6E56 100%)` }} />
        <div className="px-6 pb-6 -mt-10 relative" style={{ background: '#161616' }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-3 mx-auto"
            style={{ background: `${user.avatarColor}33`, border: `4px solid #161616` }}>
            {user.avatar}
          </div>
          <h3 className="text-lg font-semibold text-center mb-0.5" style={{ color: '#f5f5f5' }}>{user.name}</h3>
          <p className="text-sm text-center mb-2" style={{ color: '#999' }}>@{user.username}</p>
          <div className="flex justify-center mb-3">
            <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: `${user.avatarColor}22`, color: user.avatarColor }}>
              {user.role === 'ADMIN' ? '⚡ Admin' : user.role === 'YAZAR' ? '✍️ Yazar' : '👤 Üye'}
            </span>
          </div>
          <p className="text-sm text-center leading-relaxed mb-4" style={{ color: '#bbb' }}>{user.bio}</p>
          <div className="grid grid-cols-3 gap-2 mb-5 py-3 rounded-xl" style={{ background: '#0d0d0d' }}>
            <div className="text-center">
              <div className="text-sm font-semibold" style={{ color: '#f5f5f5' }}>{user.postCount}</div>
              <div className="text-[10px]" style={{ color: '#999' }}>Yazı</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold" style={{ color: '#f5f5f5' }}>{user.followerCount}</div>
              <div className="text-[10px]" style={{ color: '#999' }}>Takipçi</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold" style={{ color: '#f5f5f5' }}>{Math.floor(user.followerCount * 0.4)}</div>
              <div className="text-[10px]" style={{ color: '#999' }}>Takip</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={toggleFollow} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
              style={{
                background: following ? '#0d0d0d' : '#1D9E75',
                color: following ? '#999' : '#fff',
                border: following ? '1px solid #2a2a2a' : 'none',
              }}>
              {following ? '✓ Takipte' : '+ Takip Et'}
            </button>
            <Link href={`/profile/${user.id}`} onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-center"
              style={{ background: '#0d0d0d', border: '1px solid #2a2a2a', color: '#bbb' }}>
              Profili Gör →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
