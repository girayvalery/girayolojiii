'use client'
import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    // Backend integration burada
    setSubmitted(true)
    setTimeout(() => { setSubmitted(false); setEmail('') }, 4000)
  }

  return (
    <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, #04342C 0%, #0F6E56 100%)' }}>
      <div className="max-w-md mx-auto text-center">
        <div className="text-3xl mb-2">📧</div>
        <h3 className="text-lg font-semibold text-white mb-1">Haftalık Bülten</h3>
        <p className="text-xs text-white/70 mb-4">En iyi içerikler her Pazar e-postanda</p>

        {submitted ? (
          <div className="text-sm text-white py-3 px-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.15)' }}>
            ✓ Abone oldun! Teşekkürler 🎉
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="ornek@email.com"
              className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }} />
            <button type="submit" className="px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap" style={{ background: '#fff', color: '#0F6E56' }}>
              Abone Ol
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
