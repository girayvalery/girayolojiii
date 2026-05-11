'use client'
import { SessionProvider } from 'next-auth/react'
import { createContext, useContext, useEffect, useState } from 'react'
import { AuthGateProvider } from './auth/AuthGate'
import { ToastProvider } from './ui/Toast'

type Theme = 'light' | 'dark' | 'auto'

const ThemeContext = createContext<{ theme: Theme; resolvedTheme: 'light' | 'dark'; toggle: () => void; setTheme: (t: Theme) => void }>({
  theme: 'auto', resolvedTheme: 'dark', toggle: () => {}, setTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export default function Providers({ children, session }: { children: React.ReactNode; session: any }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved) setTheme(saved)
  }, [])

  useEffect(() => {
    let actualTheme: 'light' | 'dark' = 'dark'
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      actualTheme = prefersDark ? 'dark' : 'light'
    } else {
      actualTheme = theme
    }
    setResolvedTheme(actualTheme)
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(actualTheme)
    localStorage.setItem('theme', theme)

    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const listener = (e: MediaQueryListEvent) => {
        const newTheme = e.matches ? 'dark' : 'light'
        setResolvedTheme(newTheme)
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(newTheme)
      }
      mediaQuery.addEventListener('change', listener)
      return () => mediaQuery.removeEventListener('change', listener)
    }
  }, [theme])

  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

  return (
    <SessionProvider session={session}>
      <ThemeContext.Provider value={{ theme, resolvedTheme, toggle, setTheme }}>
        <ToastProvider>
          <AuthGateProvider>
            {children}
          </AuthGateProvider>
        </ToastProvider>
      </ThemeContext.Provider>
    </SessionProvider>
  )
}
