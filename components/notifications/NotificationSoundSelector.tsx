'use client'
import { useState, useEffect, useRef } from 'react'

// Hazır ses seçenekleri - Pixabay/Freesound CDN'lerinden
const PRESET_SOUNDS = [
  { id: 'default', label: 'Varsayılan (Ding)', url: '' },
  { id: 'pop', label: 'Pop', url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_d1718ab41b.mp3' },
  { id: 'chime', label: 'Çan', url: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6ff1bcd.mp3' },
  { id: 'success', label: 'Başarı', url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_db6591201e.mp3' },
  { id: 'message', label: 'Mesaj', url: 'https://cdn.pixabay.com/audio/2022/03/24/audio_1b67c91a73.mp3' },
]

export default function NotificationSoundSelector() {
  const [selected, setSelected] = useState('default')
  const [customUrl, setCustomUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('notif_sound_id') || 'default'
    setSelected(saved)
    const url = localStorage.getItem('notif_sound_url') || ''
    setCustomUrl(url)
  }, [])

  function saveSelection(id: string, url: string) {
    setSelected(id)
    localStorage.setItem('notif_sound_id', id)
    if (url) {
      localStorage.setItem('notif_sound_url', url)
    } else {
      localStorage.removeItem('notif_sound_url')
    }
  }

  function playSound(url: string) {
    if (!url) {
      // Varsayılan ses
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain); gain.connect(ctx.destination)
        osc.frequency.value = 880
        gain.gain.setValueAtTime(0.3, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.3)
      } catch {}
      return
    }
    const audio = new Audio(url)
    audio.volume = 0.5
    audio.play().catch(() => alert('Bu ses çalınamadı. URL geçerli mi kontrol et.'))
  }

  async function handleUpload(file: File) {
    if (!file.type.startsWith('audio/')) {
      alert('Sadece ses dosyası yükleyebilirsin')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Dosya 2 MB\'dan büyük olamaz')
      return
    }
    setUploading(true)
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      if (!cloudName || !preset) {
        alert('Cloudinary kurulumu yapılmamış')
        setUploading(false)
        return
      }
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', preset)
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      if (data.secure_url) {
        saveSelection('custom', data.secure_url)
        setCustomUrl(data.secure_url)
      } else {
        alert('Yükleme başarısız: ' + (data.error?.message || 'Bilinmeyen hata'))
      }
    } catch (e: any) {
      alert('Hata: ' + e.message)
    }
    setUploading(false)
  }

  return (
    <>
      <div className="space-y-2 mb-4">
        {PRESET_SOUNDS.map(s => (
          <div key={s.id} className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'var(--bg-subtle)' }}>
            <button onClick={() => saveSelection(s.id, s.url)}
              className="flex-1 text-left text-sm"
              style={{ color: selected === s.id ? '#1D9E75' : 'var(--text)', fontWeight: selected === s.id ? 600 : 400 }}>
              {selected === s.id ? '✓ ' : ''}{s.label}
            </button>
            <button onClick={() => playSound(s.url)}
              className="px-3 py-1 rounded-lg text-xs font-medium"
              style={{ background: 'var(--bg-card)', color: 'var(--text)' }}>
              ▶ Dinle
            </button>
          </div>
        ))}

        {selected === 'custom' && customUrl && (
          <div className="p-3 rounded-xl" style={{ background: 'rgba(29,158,117,0.15)', border: '1px solid #1D9E75' }}>
            <div className="flex items-center gap-2">
              <span className="text-sm flex-1" style={{ color: '#1D9E75' }}>✓ Özel ses yüklü</span>
              <button onClick={() => playSound(customUrl)} className="px-3 py-1 rounded-lg text-xs font-medium" style={{ background: 'var(--bg-card)', color: 'var(--text)' }}>
                ▶ Dinle
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
        <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>📤 Kendi sesini yükle (MP3, WAV - max 2 MB)</p>
        <input ref={fileInputRef} type="file" accept="audio/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f) }} />
        <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
          className="w-full py-2 rounded-xl text-sm font-medium text-white"
          style={{ background: uploading ? '#666' : '#1D9E75' }}>
          {uploading ? 'Yükleniyor...' : '🎵 Ses Dosyası Seç'}
        </button>
      </div>
    </>
  )
}
