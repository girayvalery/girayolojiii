'use client'
import { useEffect, useState } from 'react'

type Props = { onDone: () => void }

export default function RocketLaunch({ onDone }: Props) {
  const [stage, setStage] = useState<'launch' | 'done'>('launch')

  useEffect(() => {
    // Ses çal
    try {
      // Whoosh + boom sesi - oscillator ile
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()

      // 1. Whoosh - frekans yüksekten düşüğe
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(800, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 1)
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 1)

      // 2. Boom - kısa düşük frekans (1.2sn sonra)
      const boom = ctx.createOscillator()
      const boomGain = ctx.createGain()
      boom.type = 'triangle'
      boom.connect(boomGain)
      boomGain.connect(ctx.destination)
      boom.frequency.setValueAtTime(60, ctx.currentTime + 1.1)
      boom.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 1.5)
      boomGain.gain.setValueAtTime(0.4, ctx.currentTime + 1.1)
      boomGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5)
      boom.start(ctx.currentTime + 1.1)
      boom.stop(ctx.currentTime + 1.5)
    } catch {}

    // 1.6 saniye sonra bitir
    const t = setTimeout(() => {
      setStage('done')
      setTimeout(onDone, 100)
    }, 1600)

    return () => clearTimeout(t)
  }, [onDone])

  if (stage === 'done') return null

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none flex items-end justify-center">
      <div className="rocket-container">
        <div className="rocket">
          {/* Roket SVG */}
          <svg width="80" height="120" viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg">
            {/* Gövde */}
            <ellipse cx="40" cy="50" rx="18" ry="40" fill="#e0e0e0" />
            <ellipse cx="40" cy="50" rx="14" ry="38" fill="#fff" />
            {/* Üst kapsül kırmızı */}
            <path d="M 22 30 Q 40 0 58 30 L 58 50 L 22 50 Z" fill="#D32F2F" />
            {/* Pencere */}
            <circle cx="40" cy="48" r="7" fill="#7BC8F6" stroke="#1a5688" strokeWidth="2" />
            <circle cx="38" cy="45" r="2" fill="#fff" opacity="0.7" />
            {/* Kanatlar */}
            <path d="M 22 75 L 8 100 L 22 95 Z" fill="#D32F2F" />
            <path d="M 58 75 L 72 100 L 58 95 Z" fill="#D32F2F" />
            {/* Çizgiler */}
            <line x1="22" y1="60" x2="58" y2="60" stroke="#999" strokeWidth="1" />
            <line x1="22" y1="70" x2="58" y2="70" stroke="#999" strokeWidth="1" />
          </svg>

          {/* Alev */}
          <div className="flame">
            <div className="flame-inner" />
            <div className="flame-outer" />
          </div>
        </div>

        {/* Duman izleri */}
        <div className="smoke smoke-1" />
        <div className="smoke smoke-2" />
        <div className="smoke smoke-3" />
      </div>

      <style jsx>{`
        .rocket-container {
          position: relative;
          animation: launch 1.6s cubic-bezier(0.6, 0, 0.4, 1) forwards;
        }
        @keyframes launch {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          5% { opacity: 1; }
          50% { transform: translateY(-50vh) scale(1.05); }
          100% { transform: translateY(-110vh) scale(0.6); opacity: 0; }
        }
        .rocket {
          position: relative;
          animation: wobble 0.2s ease-in-out infinite;
        }
        @keyframes wobble {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(2deg); }
        }
        .flame {
          position: absolute;
          bottom: -30px;
          left: 50%;
          transform: translateX(-50%);
          width: 30px;
          height: 60px;
        }
        .flame-inner {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 0%, #FFEB3B 0%, #FF9800 30%, #F44336 70%, transparent 100%);
          border-radius: 50% 50% 30% 30% / 30% 30% 70% 70%;
          animation: flicker 0.1s ease-in-out infinite;
        }
        .flame-outer {
          position: absolute;
          inset: -8px;
          background: radial-gradient(ellipse at 50% 0%, rgba(255,235,59,0.6) 0%, rgba(244,67,54,0.4) 50%, transparent 80%);
          border-radius: 50% 50% 30% 30% / 30% 30% 70% 70%;
          animation: flicker 0.15s ease-in-out infinite reverse;
        }
        @keyframes flicker {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.15); }
        }
        .smoke {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 50px;
          height: 50px;
          background: radial-gradient(circle, rgba(200,200,200,0.6) 0%, transparent 70%);
          border-radius: 50%;
          transform: translateX(-50%);
        }
        .smoke-1 { animation: smokeRise 1.6s ease-out forwards; }
        .smoke-2 { animation: smokeRise 1.6s ease-out 0.15s forwards; }
        .smoke-3 { animation: smokeRise 1.6s ease-out 0.3s forwards; }
        @keyframes smokeRise {
          0% { transform: translate(-50%, 0) scale(0.5); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translate(-50%, 30px) scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
