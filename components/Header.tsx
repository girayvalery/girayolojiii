'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useTheme } from './Providers'
import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import NotificationBell from './notifications/NotificationBell'

const SearchModal = dynamic(() => import('./search/SearchModal'), { ssr: false })

const nav = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/blog', label: 'Bloglar' },
  { href: '/topluluk', label: 'Topluluk' },
  { href: '/hakkinda', label: 'Hakkında' },
]

export default function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { theme, toggle } = useTheme()
  const [userOpen, setUserOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const user = session?.user as any
  const userId = user?.id || 'u1'

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserOpen(false)
      }
    }
    if (userOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [userOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(p => !p)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-50" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-14 gap-4">

          {/* SOL: Logo + Nav (bitişik) */}
          <Link href="/" className="shrink-0 text-xl font-semibold tracking-tight" style={{ color: '#1D9E75', fontFamily: 'var(--font-display)' }}>
            Girayoloji
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {nav.map(link => (
              <Link key={link.href} href={link.href}
                className="px-3 py-1.5 rounded-lg text-sm transition-all"
                style={{ background: pathname === link.href ? 'rgba(29,158,117,0.1)' : 'transparent', color: pathname === link.href ? '#1D9E75' : 'var(--text-muted)', fontWeight: pathname === link.href ? '500' : '400' }}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ORTA: Arama */}
          <button onClick={() => setSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-xl text-sm transition-all hover:scale-[1.02] flex-1 max-w-md mx-auto"
            style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            <span>🔍</span>
            <span className="hidden lg:block flex-1 text-left">Makale, video, kullanıcı ara...</span>
            <kbd className="hidden lg:flex items-center text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>⌘K</kbd>
          </button>

          {/* SAĞ: Kullanıcı */}
          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(true)} className="sm:hidden p-2 rounded-lg" style={{ color: 'var(--text-muted)' }}>🔍</button>

            <button onClick={toggle} className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {session && <NotificationBell />}

            {session ? (
              <div ref={userMenuRef} className="relative">
                <button onClick={() => setUserOpen(p => !p)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-full transition-all hover:scale-[1.02]"
                  style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                  {user?.photoUrl ? (
                    <img src={user.photoUrl} alt={user.name} className="w-7 h-7 rounded-full object-cover" style={{ border: '2px solid #1D9E75' }} />
                  ) : (
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-base"
                      style={{ background: `${user?.avatarColor || '#1D9E75'}22`, border: '2px solid #1D9E75' }}>
                      {user?.avatar || user?.name?.[0]?.toUpperCase() || '?'}
                    </span>
                  )}
                  <span className="text-sm hidden sm:block" style={{ color: 'var(--text)' }}>
                    {user?.username ? `@${user.username}` : user?.name?.split(' ')[0]}
                  </span>
                </button>

                {userOpen && (
                  <div className="absolute right-0 top-12 w-60 rounded-2xl shadow-2xl border z-50 overflow-hidden animate-fade-up"
                    style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>

                    <Link href={`/profile/${userId}`} onClick={() => setUserOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                      style={{ borderBottom: '1px solid var(--border)' }}>
                      {user?.photoUrl ? (
                        <img src={user.photoUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover" style={{ border: '2px solid #1D9E75' }} />
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                          style={{ background: `${user?.avatarColor || '#1D9E75'}22`, border: '2px solid #1D9E75' }}>
                          {user?.avatar || '👤'}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{user?.name}</p>
                        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>@{user?.username}</p>
                      </div>
                    </Link>

                    <div className="py-1">
                      <Link href={`/profile/${userId}`} onClick={() => setUserOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm" style={{ color: 'var(--text)' }}>
                        <span className="text-base w-5">👤</span>Profilim
                      </Link>
                      <Link href="/dashboard" onClick={() => setUserOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm" style={{ color: 'var(--text)' }}>
                        <span className="text-base w-5">📊</span>İstatistikler
                      </Link>
                      <Link href="/okuma-listesi" onClick={() => setUserOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm" style={{ color: 'var(--text)' }}>
                        <span className="text-base w-5">🔖</span>Okuma Listesi
                      </Link>
                      <Link href="/ayarlar" onClick={() => setUserOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm" style={{ color: 'var(--text)' }}>
                        <span className="text-base w-5">⚙️</span>Ayarlar
                      </Link>
                      <Link href="/katkida-bulun" onClick={() => setUserOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm" style={{ color: 'var(--text)' }}>
                        <span className="text-base w-5">✍️</span>İçerik Ekle
                      </Link>
                      {user?.role === 'ADMIN' && (
                        <Link href="/admin" onClick={() => setUserOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold" style={{ color: '#1D9E75' }}>
                          <span className="text-base w-5">⚡</span>Admin Paneli
                        </Link>
                      )}
                    </div>

                    <div style={{ borderTop: '1px solid var(--border)' }} />

                    <button onClick={() => { setUserOpen(false); signOut({ callbackUrl: '/' }) }}
                      className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm" style={{ color: '#e24b4a' }}>
                      <span className="text-base w-5">🚪</span>Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login" className="px-3 py-1.5 rounded-full text-sm" style={{ color: 'var(--text-muted)' }}>Giriş</Link>
                <Link href="/auth/register" className="px-4 py-1.5 rounded-full text-sm font-semibold text-white" style={{ background: '#1D9E75' }}>Üye Ol</Link>
              </div>
            )}

            <button className="md:hidden p-2 rounded-lg" style={{ color: 'var(--text-muted)' }} onClick={() => setMobileOpen(p => !p)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t px-4 py-3 space-y-1" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            {nav.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm" style={{ color: 'var(--text)' }}>
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  )
}
