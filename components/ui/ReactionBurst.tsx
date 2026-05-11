'use client'
import { useEffect, useState } from 'react'

export default function ReactionBurst({ emoji, onDone }: { emoji: string; onDone: () => void }) {
  const [show, setShow] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => { setShow(false); setTimeout(onDone, 200) }, 900)
    return () => clearTimeout(t)
  }, [onDone])

  if (!show) return null
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      <div className="text-9xl animate-reaction-burst" style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))' }}>
        {emoji}
      </div>
      <style>{`
        @keyframes reactionBurst {
          0% { transform: scale(0) rotate(-15deg); opacity: 0; }
          30% { transform: scale(1.4) rotate(5deg); opacity: 1; }
          70% { transform: scale(1.2) rotate(-3deg); opacity: 1; }
          100% { transform: scale(2.5) translateY(-100px); opacity: 0; }
        }
        .animate-reaction-burst { animation: reactionBurst 0.95s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  )
}
