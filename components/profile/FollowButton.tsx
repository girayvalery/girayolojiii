'use client'
import { useEffect, useState } from 'react'
import { useAuthGate } from '@/components/auth/AuthGate'
import { useToast } from '@/components/ui/Toast'

type Props = {
  targetId: string
  isOwn: boolean
  onChange?: () => void
}

export default function FollowButton({ targetId, isOwn, onChange }: Props) {
  const { requireAuth } = useAuthGate()
  const { show } = useToast()
  const [following, setFollowing] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOwn) return
    fetch(`/api/follow?targetId=${targetId}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { setFollowing(d.following) })
      .catch(() => {})
  }, [targetId, isOwn])

  if (isOwn) return null

  async function toggle() {
    if (!requireAuth('Takip etmek')) return
    setLoading(true)
    try {
      const res = await fetch('/api/follow', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId }),
      })
      const d = await res.json()
      if (res.ok) {
        setFollowing(d.following)
        show('success', d.following ? '✓ Takip ettin' : 'Takipten çıkıldı')
        if (onChange) onChange()
      } else {
        show('error', d.error || 'İşlem başarısız')
      }
    } catch { show('error', 'Bağlantı hatası') }
    setLoading(false)
  }

  return (
    <button onClick={toggle} disabled={loading}
      className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
      style={{
        background: following ? 'var(--bg-subtle)' : '#1D9E75',
        color: following ? 'var(--text)' : '#fff',
        border: following ? '1px solid var(--border)' : 'none',
      }}>
      {loading ? '...' : following ? '✓ Takipte' : '+ Takip Et'}
    </button>
  )
}
