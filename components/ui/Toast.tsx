'use client'
import { createContext, useContext, useState, useCallback } from 'react'

type Toast = { id: string; type: 'success'|'error'|'info'; message: string }
const ToastContext = createContext<{ show: (type: Toast['type'], message: string) => void }>({ show: () => {} })

export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const show = useCallback((type: Toast['type'], message: string) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2)
    setToasts(p => [...p, { id, type, message }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500)
  }, [])

  const colors = {
    success: { bg: '#1D9E75', icon: '✓' },
    error: { bg: '#e24b4a', icon: '✕' },
    info: { bg: '#185fa5', icon: 'ℹ' },
  }

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => {
          const c = colors[t.type]
          return (
            <div key={t.id} className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl pointer-events-auto animate-toast-in"
              style={{ background: c.bg, color: '#fff', minWidth: 240, maxWidth: 360 }}>
              <span className="text-lg font-bold">{c.icon}</span>
              <span className="text-sm flex-1">{t.message}</span>
            </div>
          )
        })}
      </div>
      <style>{`@keyframes toastIn { from { transform: translateX(120%); opacity: 0 } to { transform: translateX(0); opacity: 1 } } .animate-toast-in { animation: toastIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) }`}</style>
    </ToastContext.Provider>
  )
}
