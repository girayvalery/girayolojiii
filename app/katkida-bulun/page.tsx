'use client'
import { useState, useEffect, Suspense, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { CATEGORIES } from '@/lib/data'
import { extractYouTubeId } from '@/lib/youtube'
import PhotoUpload from '@/components/upload/PhotoUpload'
import { useToast } from '@/components/ui/Toast'

type ContentType = 'post' | 'story' | 'reel'

const COVER_EMOJIS = ['📝','🔬','🧠','🌌','⚛️','🧬','💡','🎨','🚀','🌍','🩺','🗣️','📚','🎬','🎯','💭','⚡','🌱','🔭','🎓']

function KatkidaBulunContent() {
  const router = useRouter()
  const search = useSearchParams()
  const { data: session, status } = useSession()
  const { show } = useToast()

  const [type, setType] = useState<ContentType>((search.get('type') as ContentType) || 'post')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState('Bilim')
  const [coverImage, setCoverImage] = useState('')
  const [coverEmoji, setCoverEmoji] = useState('📝')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  const [blogYoutubeUrl, setBlogYoutubeUrl] = useState('')
  const [blogYoutubeId, setBlogYoutubeId] = useState('')
  const [relatedReelId, setRelatedReelId] = useState('')
  const [availableReels, setAvailableReels] = useState<any[]>([])

  // Hikaye - TEK alan, foto veya video otomatik anlaşılır
  const [storyMedia, setStoryMedia] = useState('')
  const [storyMediaType, setStoryMediaType] = useState<'image' | 'video'>('image')

  const [reelVideo, setReelVideo] = useState('')
  const [reelTitle, setReelTitle] = useState('')
  const [reelDuration, setReelDuration] = useState(0)
  const [reelThumb, setReelThumb] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const hiddenVideoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/auth/login?callbackUrl=/katkida-bulun')
  }, [status, router])

  useEffect(() => {
    if (type === 'post' && session?.user) {
      fetch('/api/db/reels', { cache: 'no-store' })
        .then(r => r.json())
        .then((d: any) => {
          if (Array.isArray(d)) {
            const myReels = d.filter((r: any) => r.author?.id === (session.user as any).id)
            setAvailableReels(myReels)
          }
        })
        .catch(() => {})
    }
  }, [type, session])

  useEffect(() => {
    if (blogYoutubeUrl) {
      const id = extractYouTubeId(blogYoutubeUrl)
      setBlogYoutubeId(id || '')
    } else {
      setBlogYoutubeId('')
    }
  }, [blogYoutubeUrl])

  // Hikaye media yükleme - dosya tipinden otomatik anla
  function handleStoryUpload(url: string, file?: File) {
    setStoryMedia(url)
    // URL extension'a göre belirle
    if (url.match(/\.(mp4|mov|webm|avi)$/i) || (file && file.type.startsWith('video/'))) {
      setStoryMediaType('video')
    } else {
      setStoryMediaType('image')
    }
  }

  function handleVideoUpload(url: string) {
    setReelVideo(url)
    if (!url) return
    setTimeout(() => {
      const vid = hiddenVideoRef.current
      if (!vid) return
      vid.src = url
      vid.onloadedmetadata = () => {
        setReelDuration(vid.duration)
      }
      vid.onseeked = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        canvas.width = vid.videoWidth || 720
        canvas.height = vid.videoHeight || 1280
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.drawImage(vid, 0, 0, canvas.width, canvas.height)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7)
        setReelThumb(dataUrl)
      }
      vid.currentTime = 1
    }, 100)
  }

  async function submit() {
    if (!session?.user) { show('error', 'Giriş gerekli'); return }
    setSubmitting(true)

    let payload: any = { type, userId: (session.user as any).id }

    if (type === 'post') {
      if (!title || title.length < 3) { show('error', 'Başlık en az 3 karakter'); setSubmitting(false); return }
      if (!content) { show('error', 'İçerik gerekli'); setSubmitting(false); return }
      payload = {
        ...payload, title, content, excerpt: excerpt || content.slice(0, 150),
        category, tags, emoji: coverEmoji, mediaUrl: coverImage,
        youtubeId: blogYoutubeId || undefined,
        relatedReelId: relatedReelId || null,
      }
    } else if (type === 'story') {
      if (!storyMedia) { show('error', 'Görsel veya video yükle'); setSubmitting(false); return }
      payload = { ...payload, title: 'Hikaye', mediaUrl: storyMedia, mediaType: storyMediaType }
    } else if (type === 'reel') {
      if (!reelTitle || reelTitle.length < 3) { show('error', 'Başlık en az 3 karakter'); setSubmitting(false); return }
      if (!reelVideo) { show('error', 'Video yükle'); setSubmitting(false); return }
      payload = {
        ...payload, title: reelTitle, mediaUrl: reelVideo, thumbnail: reelThumb,
        category, emoji: coverEmoji,
      }
    }

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Gönderilemedi')
      show('success', '✅ Gönderi inceleme için bekliyor!')
      router.push('/')
    } catch (e: any) {
      show('error', e.message)
    }
    setSubmitting(false)
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase().replace(/[^a-z0-9çğıöşü]/g, '')
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags([...tags, t]); setTagInput('')
    }
  }

  const typeOptions = [
    { key: 'post' as const, icon: '📝', label: 'Blog Yazısı', desc: 'Makale yaz' },
    { key: 'story' as const, icon: '📸', label: 'Hikaye', desc: '24 saat görünür' },
    { key: 'reel' as const, icon: '⚡', label: 'Kısa Video', desc: 'Dikey video' },
  ]

  if (status !== 'authenticated') return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text)' }}>✍️ İçerik Ekle</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Yazı, hikaye veya kısa video ekleyebilirsin</p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {typeOptions.map(t => (
          <button key={t.key} onClick={() => setType(t.key)}
            className="p-4 rounded-2xl text-left transition-all hover:scale-[1.02]"
            style={{
              background: type === t.key ? 'rgba(29,158,117,0.15)' : 'var(--bg-card)',
              border: type === t.key ? '2px solid #1D9E75' : '2px solid var(--border)',
            }}>
            <div className="text-2xl mb-1">{t.icon}</div>
            <p className="text-sm font-semibold mb-1" style={{ color: type === t.key ? '#1D9E75' : 'var(--text)' }}>{t.label}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.desc}</p>
          </button>
        ))}
      </div>

      <div className="rounded-2xl p-6 space-y-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

        {type === 'post' && (
          <>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Başlık *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} maxLength={120} className="auth-input" placeholder="En az 3 karakter" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Emoji</label>
                <select value={coverEmoji} onChange={e => setCoverEmoji(e.target.value)} className="auth-input">
                  {COVER_EMOJIS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Kategori</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="auth-input">
                  {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.emoji} {c.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Kapak Fotoğrafı (opsiyonel)</label>
              <PhotoUpload type="image" currentUrl={coverImage} onUpload={setCoverImage} maxSizeMB={10} label="Kapak fotoğrafı yükle" />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>📺 YouTube Video Linki (opsiyonel)</label>
              <input type="text" value={blogYoutubeUrl} onChange={e => setBlogYoutubeUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="auth-input" />
              {blogYoutubeId && (
                <div className="mt-2 rounded-xl overflow-hidden">
                  <img src={`https://img.youtube.com/vi/${blogYoutubeId}/maxresdefault.jpg`} alt="YT" className="w-full" />
                </div>
              )}
            </div>

            {availableReels.length > 0 && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>⚡ Bağlı Kısa Video (opsiyonel)</label>
                <select value={relatedReelId} onChange={e => setRelatedReelId(e.target.value)} className="auth-input">
                  <option value="">- Bağlama -</option>
                  {availableReels.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Özet (opsiyonel)</label>
              <input type="text" value={excerpt} onChange={e => setExcerpt(e.target.value)} maxLength={160} className="auth-input" />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>İçerik *</label>
              <textarea rows={12} value={content} onChange={e => setContent(e.target.value)} className="auth-input resize-none" placeholder="Yazını buraya yaz..." style={{ fontFamily: 'var(--font-body)' }} />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Etiketler (maks 5)</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(t => (
                  <span key={t} className="text-xs px-3 py-1 rounded-full flex items-center gap-1" style={{ background: 'rgba(29,158,117,0.15)', color: '#1D9E75' }}>
                    #{t} <button onClick={() => setTags(tags.filter(x => x !== t))}>✕</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="etiket yaz, Enter bas" className="auth-input flex-1" />
                <button onClick={addTag} className="px-4 rounded-xl text-sm font-semibold text-white" style={{ background: '#1D9E75' }}>Ekle</button>
              </div>
            </div>
          </>
        )}

        {type === 'story' && (
          <>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>📸 Hikayen 24 saat boyunca herkese görünür. Görsel veya video yükleyebilirsin.</p>
            <PhotoUpload type="any" currentUrl={storyMedia} onUpload={handleStoryUpload} maxSizeMB={50} aspectRatio="vertical" label="Görsel veya video yükle" />
          </>
        )}

        {type === 'reel' && (
          <>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>⚡ Dikey video — uzun video yüklersen otomatik kırpılır.</p>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Başlık *</label>
              <input type="text" value={reelTitle} onChange={e => setReelTitle(e.target.value)} maxLength={80} className="auth-input" placeholder="En az 3 karakter" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Emoji</label>
                <select value={coverEmoji} onChange={e => setCoverEmoji(e.target.value)} className="auth-input">
                  {COVER_EMOJIS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Kategori</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="auth-input">
                  {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.emoji} {c.name}</option>)}
                </select>
              </div>
            </div>

            <PhotoUpload type="video" currentUrl={reelVideo} onUpload={handleVideoUpload} maxSizeMB={100} aspectRatio="vertical" label="Dikey kısa video yükle" />

            {reelVideo && reelDuration > 0 && (
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>⏱ Süre: {reelDuration.toFixed(1)} saniye</p>
            )}

            {reelThumb && (
              <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-subtle)', padding: 8 }}>
                <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>📷 Otomatik kapak (1. saniye):</p>
                <img src={reelThumb} alt="Thumb" className="rounded-lg max-h-40 mx-auto" />
              </div>
            )}

            <video ref={hiddenVideoRef} className="hidden" preload="metadata" muted playsInline crossOrigin="anonymous" />
            <canvas ref={canvasRef} className="hidden" />
          </>
        )}

        <button onClick={submit} disabled={submitting}
          className="w-full py-3 rounded-xl text-sm font-semibold text-white"
          style={{ background: submitting ? '#666' : '#1D9E75' }}>
          {submitting ? 'Gönderiliyor...' : '✓ Onaya Gönder'}
        </button>
      </div>
    </div>
  )
}

export default function Page() {
  return <Suspense fallback={null}><KatkidaBulunContent /></Suspense>
}
