'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useAuthGate } from '@/components/auth/AuthGate'

const FAB_ITEMS = [
  { icon: '📝', label: 'Blog Yazısı', href: '/katkida-bulun?type=post', color: '#1D9E75' },
  { icon: '🎬', label: 'YouTube Video', href: '/katkida-bulun?type=video', color: '#534AB7' },
  { icon: '⚡', label: 'Kısa Video (60sn)', href: '/katkida-bulun?type=reel', color: '#D4537E' },
  { icon: '📸', label: 'Hikaye', href: '/katkida-bulun?type=story', color: '#ba7517' },
]

export default function FAB() {
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const { requireAuth } = useAuthGate()

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
          <Link key={item.label} href={item.href} onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-white text-sm font-medium shadow-2xl hover:scale-105 transition-all"
            style={{ background: item.color, animation: `fabItem 0.25s ease ${i * 0.05}s both`, boxShadow: `0 8px 25px ${item.color}55` }}>
            <span>{item.icon}</span>{item.label}
          </Link>
        ))}
        <button onClick={handleClick}
          className="w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl shadow-2xl hover:scale-110"
          style={{ background: open ? '#0F6E56' : '#1D9E75', transform: open ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.25s, background 0.2s' }}>
          +
        </button>
      </div>
      <style>{`@keyframes fabItem { from { opacity:0; transform: scale(0.7) translateY(12px); } to { opacity:1; transform: scale(1) translateY(0); } }`}</style>
    </>
  )
}
