'use client'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function HeroSection() {
  const { data: session } = useSession()
  if (session) return null

  return (
    <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #04342C 0%, #0F6E56 50%, #1D9E75 100%)' }}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(8px)' }}>
            ● Türkiye'nin Merak Platformu
          </span>
          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight mb-3 text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Bilim, fikir ve <br />
            <span style={{ color: '#9FE1CB' }}>keşfin adresi</span>
          </h1>
          <p className="text-base text-white/80 leading-relaxed mb-6 max-w-lg">
            Giray'ın blog yazıları, videolar, hikayeler ve topluluk katkılarıyla her meraklıya açık.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/blog" className="px-6 py-2.5 rounded-full text-sm font-semibold" style={{ background: '#fff', color: '#0F6E56' }}>
              Bloglara Göz At
            </Link>
            <Link href="/auth/register" className="px-6 py-2.5 rounded-full text-sm font-semibold text-white border-2" style={{ borderColor: 'rgba(255,255,255,0.4)' }}>
              Üye Ol
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.2)' }}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Makale', value: '6+' },
            { label: 'Video', value: '3' },
            { label: 'Üye', value: '5+' },
            { label: 'Kategori', value: '8' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-semibold text-white">{s.value}</div>
              <div className="text-xs text-white/70">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
