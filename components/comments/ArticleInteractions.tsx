'use client'
import { useState, useEffect } from 'react'
import { REACTIONS } from '@/lib/data'
import { useAuthGate } from '@/components/auth/AuthGate'
import { useToast } from '@/components/ui/Toast'
import ReactionBurst from '@/components/ui/ReactionBurst'

export default function ArticleInteractions({ postId, initialLikes = 0 }: { postId: string; initialLikes?: number }) {
  const { requireAuth } = useAuthGate()
  const { show } = useToast()
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [mine, setMine] = useState<string | null>(null)
  const [showPicker, setShowPicker] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const [burst, setBurst] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/reactions?postId=${postId}`)
      .then(r => r.json())
      .then(d => { setCounts(d.counts || {}); setMine(d.mine) })
      .catch(() => {})
  }, [postId])

  async function pickReaction(emoji: string) {
    if (!requireAuth('Tepki vermek')) return
    setShowPicker(false)
    try {
      const res = await fetch('/api/reactions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, emoji }),
      })
      const d = await res.json()
      if (res.ok) {
        setCounts(d.counts || {})
        setMine(d.mine)
        if (d.mine === emoji) setBurst(emoji)  // sadece ekleme/değiştirme animasyonu
      } else {
        show('error', d.error || 'Tepki verilemedi')
      }
    } catch {
      show('error', 'Bağlantı hatası')
    }
  }

  function toggleSave() {
    if (!requireAuth('Yazıyı kaydetmek')) return
    setSaved(p => !p)
    show('success', saved ? 'Kayıt listesinden çıkarıldı' : 'Okuma listene eklendi')
  }

  function openPicker() {
    if (!requireAuth('Tepki vermek')) return
    setShowPicker(p => !p)
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true); show('success', 'Link kopyalandı!')
    setTimeout(() => setCopied(false), 2000)
  }

  const totalReactions = Object.values(counts).reduce((s, n) => s + n, 0)
  const mineLabel = REACTIONS.find(r => r.emoji === mine)?.label

  return (
    <>
      <div className="flex items-center gap-2 py-3 flex-wrap">
        <div className="relative">
          <button onClick={openPicker}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:scale-105 transition-all"
            style={{
              background: mine ? 'rgba(29,158,117,0.15)' : 'var(--bg-card)',
              color: mine ? '#1D9E75' : 'var(--text-muted)',
              border: `1px solid ${mine ? 'rgba(29,158,117,0.3)' : 'var(--border)'}`,
            }}>
            <span className="text-base">{mine || '💡'}</span>
            <span>{mineLabel || 'Tepki Ver'}</span>
            {totalReactions > 0 && <span className="font-semibold">{totalReactions}</span>}
          </button>

          {showPicker && (
            <div className="absolute bottom-full mb-2 left-0 flex gap-1 p-2 rounded-2xl shadow-2xl z-50"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              {REACTIONS.map(r => (
                <button key={r.emoji} onClick={() => pickReaction(r.emoji)}
                  className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl hover:scale-125 transition-all min-w-[52px]"
                  title={r.label}>
                  <span className="text-2xl">{r.emoji}</span>
                  <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>{counts[r.emoji] || 0}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Inline tepki sayaçları (sadece olan tepkiler görünür) */}
        {totalReactions > 0 && (
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-xl" style={{ background: 'var(--bg-subtle)' }}>
            {REACTIONS.filter(r => counts[r.emoji] > 0).map(r => (
              <button key={r.emoji} onClick={() => pickReaction(r.emoji)} className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg hover:scale-110 transition-all"
                style={{ background: mine === r.emoji ? 'rgba(29,158,117,0.2)' : 'transparent' }}
                title={r.label}>
                <span className="text-sm">{r.emoji}</span>
                <span className="text-xs font-semibold" style={{ color: mine === r.emoji ? '#1D9E75' : 'var(--text-muted)' }}>{counts[r.emoji]}</span>
              </button>
            ))}
          </div>
        )}

        <button onClick={toggleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:scale-105 transition-all ml-auto"
          style={{
            background: saved ? 'rgba(186,117,23,0.15)' : 'var(--bg-card)',
            color: saved ? '#ba7517' : 'var(--text-muted)',
            border: `1px solid ${saved ? 'rgba(186,117,23,0.3)' : 'var(--border)'}`,
          }}>
          <span>{saved ? '🔖' : '📑'}</span>
          <span>{saved ? 'Kaydedildi' : 'Kaydet'}</span>
        </button>

        <button onClick={copyLink}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:scale-105 transition-all"
          style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
          <span>{copied ? '✅' : '🔗'}</span>
          <span>{copied ? 'Kopyalandı!' : 'Paylaş'}</span>
        </button>
      </div>
      {burst && <ReactionBurst emoji={burst} onDone={() => setBurst(null)} />}
    </>
  )
}
