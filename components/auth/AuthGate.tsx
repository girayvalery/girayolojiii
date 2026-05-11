'use client'
import { useState, createContext, useContext } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useBodyLock } from '@/lib/useBodyLock'

const AuthGateContext = createContext<{ requireAuth: (action?: string) => boolean }>({
  requireAuth: () => true,
})

export const useAuthGate = () => useContext(AuthGateContext)

export function AuthGateProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [action, setAction] = useState('')

  function requireAuth(actionLabel?: string): boolean {
    if (session) return true
    setAction(actionLabel || '')
    setOpen(true)
    return false
  }

  return (
    <AuthGateContext.Provider value={{ requireAuth }}>
      {children}
      {open && <AuthModal action={action} onClose={() => setOpen(false)} />}
    </AuthGateContext.Provider>
  )
}

function AuthModal({ action, onClose }: { action: string; onClose: () => void }) {
  useBodyLock(true)
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)' }}
      onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl shadow-2xl animate-fade-up p-6"
        style={{ background: '#161616', border: '1px solid #2a2a2a' }}
        onClick={e => e.stopPropagation()}>
        <div className="text-center mb-5">
          <div className="text-5xl mb-3">🔒</div>
          <h3 className="text-lg font-semibold mb-1" style={{ color: '#f5f5f5' }}>Giriş Gerekli</h3>
          <p className="text-sm" style={{ color: '#999' }}>
            {action ? `${action} için ` : ''}üye olman ya da giriş yapman gerekiyor.
          </p>
        </div>
        <div className="space-y-2">
          <Link href="/auth/register" onClick={onClose}
            className="block w-full py-3 rounded-xl text-sm font-semibold text-white text-center"
            style={{ background: '#1D9E75' }}>
            Üye Ol →
          </Link>
          <Link href="/auth/login" onClick={onClose}
            className="block w-full py-3 rounded-xl text-sm font-semibold text-center"
            style={{ background: '#0d0d0d', border: '1px solid #2a2a2a', color: '#bbb' }}>
            Zaten hesabım var
          </Link>
          <button onClick={onClose} className="w-full py-2 text-xs" style={{ color: '#999' }}>
            Vazgeç
          </button>
        </div>
      </div>
    </div>
  )
}
