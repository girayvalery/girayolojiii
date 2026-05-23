'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useAuthGate } from '@/components/auth/AuthGate'

const FAB_ITEMS = [
  { icon: '📝', label: 'Blog Yazısı', href: '/katkida-bulun?type=post', color: '#1D9E75' },
  { icon: '⚡', label: 'Kısa Video', href: '/katkida-bulun?type=reel', color: '#D4537E' },
  { icon: '📸', label: 'Hikaye', href: '/katkida-bulun?type=story', color: '#ba7517' },
]

export default function FAB() {
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const { requireAuth } = useAuthGate()
  const pathname = usePathname()

  // Reels detay ve diğer fullscreen sayfalarda gizle
  if (pathname?.startsWith('/reels/')) return null

  function handleClick() {
    if (!session) {
      requireAuth('İçerik eklemek')
      return
    }
    setOpen(p => !p)
  }

  return (
    <>
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
        {open && FAB_ITEMS.map((item, i) => (
          <Link key={i} href={item.href} onClick={() => setOpen(false)}
            className="flex items-center gap-2 pl-4 pr-3 py-2 rounded-full shadow-lg text-white text-sm font-medium animate-slideIn"
            style={{ background: item.color }}>
            <span>{item.label}</span>
            <span className="text-lg">{item.icon}</span>
          </Link>
        ))}
        <button onClick={handleClick}
          className="w-14 h-14 rounded-full text-white text-3xl shadow-xl transition-transform"
          style={{ background: open ? '#666' : '#1D9E75', transform: open ? 'rotate(45deg)' : 'rotate(0)' }}>
          +
        </button>
      </div>
    </>
  )
}
