'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { CATEGORIES } from '@/lib/data'

const NAV = [
  { href: '/', label: 'Ana Sayfa', icon: '🏠' },
  { href: '/blog', label: 'Bloglar', icon: '📚' },
  { href: '/reels', label: 'Kısa Videolar', icon: '⚡' },
  { href: '/topluluk', label: 'Topluluk', icon: '👥' },
  { href: '/hakkinda', label: 'Hakkında', icon: 'ℹ️' },
]

export default function LeftSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className="space-y-4 sticky top-20">
      <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Menü</p>
        <ul className="space-y-1">
          {NAV.map(n => (
            <li key={n.href}>
              <Link href={n.href}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium"
                style={{
                  background: pathname === n.href ? 'rgba(29,158,117,0.1)' : 'transparent',
                  color: pathname === n.href ? '#1D9E75' : 'var(--text)',
                }}>
                <span className="text-base">{n.icon}</span>{n.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {!session && (
        <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, rgba(29,158,117,0.15), rgba(15,110,86,0.05))', border: '1px solid rgba(29,158,117,0.3)' }}>
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text)' }}>Katıl!</p>
          <Link href="/auth/register" className="block w-full text-center py-2 rounded-xl text-xs font-semibold text-white" style={{ background: '#1D9E75' }}>
            Ücretsiz Üye Ol
          </Link>
        </div>
      )}

      <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Kategoriler</p>
        <ul className="space-y-1">
          {CATEGORIES.slice(0, 8).map(c => (
            <li key={c.name}>
              <Link href={`/blog?category=${c.name}`} className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg text-sm" style={{ color: 'var(--text)' }}>
                <span className="flex items-center gap-2"><span>{c.emoji}</span>{c.name}</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
