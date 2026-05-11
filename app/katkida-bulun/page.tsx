'use client'
import { useState, useEffect, Suspense, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { CATEGORIES, getAllUsers } from '@/lib/data'
import { extractYouTubeId } from '@/lib/youtube'
import PhotoUpload from '@/components/upload/PhotoUpload'
import { useToast } from '@/components/ui/Toast'

type ContentType = 'post' | 'story' | 'reel' | 'video'

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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [mentionInput, setMentionInput] = useState('')
  const [showMentions, setShowMentions] = useState(false)
  const [storyImage, setStoryImage] = useState('')
  const [reelVideo, setReelVideo] = useState('')
  const [reelDuration, setReelDuration] = useState(0)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [youtubePreview, setYoutubePreview] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const allUsers = getAllUsers()

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/auth/login?callbackUrl=/katkida-bulun')
  }, [status, router])

  useEffect(() => {
    if (youtubeUrl) {
      const id = extractYouTubeId(youtubeUrl)
      if (id) setYoutubePreview(id)
      else setYoutubePreview('')
    } else setYoutubePreview('')
  }, [youtubeUrl])

  if (status !== 'authenticated') {
    return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '')
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags([...tags, t]); setTagInput('')
    }
  }

  function removeTag(t: string) { setTags(tags.filter(x => x !== t)) }

  function handleVideoUpload(url: string) {
    setReelVideo(url)
    setTimeout(() => {
      if (videoRef.current) {
        const dur = videoRef.current.duration
        setReelDuration(dur)
        if (dur > 60) {
          show('error', 'Kısa video 60 saniyeden uzun olamaz!')
          setReelVideo('')
        }
      }
    }, 800)
  }

  const mentionMatches = mentionInput
    ? allUsers.filter(u => u.username.toLowerCase().includes(mentionInput.toLowerCase())).slice(0, 5)
    : []

  function insertMention(username: string) {
    setContent(c => c + `@${username} `)
    setMentionInput(''); setShowMentions(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    let payload: any = { type, title, tags }

    if (type === 'post') {
      if (content.length < 200) { show('error', 'Yazı en az 200 karakter olmalı'); setSubmitting(false); return }
      payload = { ...payload, content, category, coverEmoji, mediaUrl: coverImage, excerpt: excerpt || content.slice(0, 150) }
    } else if (type === 'story') {
      payload = { ...payload, emoji: coverEmoji, mediaUrl: storyImage }
    } else if (type === 'reel') {
      if (reelDuration > 60) { show('error', 'Kısa video 60 saniyeden uzun olamaz'); setSubmitting(false); return }
      payload = { ...payload, mediaUrl: reelVideo, emoji: coverEmoji, category }
    } else if (type === 'video') {
      const yid = extractYouTubeId(youtubeUrl)
      if (!yid) { show('error', 'Geçersiz YouTube URL'); setSubmitting(false); return }
      payload = { ...payload, youtubeId: yid, category, content }
    }

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gönderilemedi')
      show('success', '✓ Gönderin alındı! Admin onayından sonra yayınlanacak.')
      setTitle(''); setContent(''); setExcerpt(''); setCoverImage(''); setStoryImage(''); setReelVideo(''); setYoutubeUrl(''); setTags([])
    } catch (err: any) {
      show('error', err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const TYPES = [
    { key: 'post' as const, icon: '📝', label: 'Blog Yazısı', desc: 'Uzun makale yaz' },
    { key: 'story' as const, icon: '📸', label: 'Hikaye', desc: '24 saat görünür' },
    { key: 'video' as const, icon: '🎬', label: 'YouTube Video', desc: 'Link paylaş' },
    { key: 'reel' as const, icon: '⚡', label: 'Kısa Video', desc: 'Maks 60 saniye' },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--text)' }}>İçerik Ekle</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Bilgini paylaş, topluluğa katkıda bulun</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {TYPES.map(t => (
          <button key={t.key} onClick={() => setType(t.key)}
            className="rounded-xl p-4 text-center transition-all hover:scale-105"
            style={{
              background: type === t.key ? 'rgba(29,158,117,0.15)' : 'var(--bg-card)',
              border: `1px solid ${type === t.key ? '#1D9E75' : 'var(--border)'}`,
            }}>
            <div className="text-3xl mb-2">{t.icon}</div>
            <p className="text-sm font-semibold mb-0.5" style={{ color: type === t.key ? '#1D9E75' : 'var(--text)' }}>{t.label}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.desc}</p>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl p-6 space-y-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Başlık *</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required minLength={3} maxLength={120}
            placeholder="Etkileyici bir başlık yaz..." className="auth-input" />
          <p className="text-xs mt-1 text-right" style={{ color: 'var(--text-muted)' }}>{title.length}/120</p>
        </div>

        {type === 'post' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Kapak Emoji</label>
                <button type="button" onClick={() => setShowEmojiPicker(p => !p)}
                  className="w-full h-12 rounded-xl flex items-center justify-center text-3xl"
                  style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                  {coverEmoji}
                </button>
                {showEmojiPicker && (
                  <div className="grid grid-cols-10 gap-1 mt-2 p-2 rounded-xl" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                    {COVER_EMOJIS.map(e => (
                      <button key={e} type="button" onClick={() => { setCoverEmoji(e); setShowEmojiPicker(false) }}
                        className="aspect-square rounded-lg flex items-center justify-center text-xl"
                        style={{ background: coverEmoji === e ? 'rgba(29,158,117,0.2)' : 'transparent' }}>
                        {e}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Kategori *</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="auth-input">
                  {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.emoji} {c.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Kapak Fotoğrafı (önerilen)</label>
              <PhotoUpload type="image" currentUrl={coverImage} onUpload={setCoverImage} maxSizeMB={5} label="Kapak fotoğrafı yükle" />
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>İdeal boyut: 1200x630 px. Yüklenmezse emoji gösterilir.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Özet (opsiyonel)</label>
              <input type="text" value={excerpt} onChange={e => setExcerpt(e.target.value)} maxLength={160}
                placeholder="Kısa açıklama" className="auth-input" />
            </div>

            <div>
              <label className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                <span>İçerik *</span>
                <span className="text-[10px] normal-case font-normal">Markdown destekli (## başlık)</span>
              </label>
              <textarea rows={14} value={content} onChange={e => setContent(e.target.value)} required minLength={200}
                placeholder="Yazını buraya yaz..." className="auth-input resize-none" style={{ fontFamily: 'var(--font-body)' }} />
              <div className="flex items-center justify-between mt-1">
                <button type="button" onClick={() => setShowMentions(true)} className="text-xs px-2 py-1 rounded-lg" style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>@ Bahset</button>
                <p className="text-xs" style={{ color: content.length < 200 ? '#e24b4a' : 'var(--text-muted)' }}>{content.length} / 200</p>
              </div>

              {showMentions && (
                <div className="mt-2 p-3 rounded-xl" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                  <input type="text" value={mentionInput} onChange={e => setMentionInput(e.target.value)}
                    placeholder="Kullanıcı adı yaz..." autoFocus className="auth-input mb-2 text-sm" />
                  {mentionMatches.length > 0 ? (
                    <div className="space-y-1">
                      {mentionMatches.map(u => (
                        <button key={u.id} type="button" onClick={() => insertMention(u.username)}
                          className="w-full flex items-center gap-2 p-2 rounded-lg text-left" style={{ background: 'var(--bg-card)' }}>
                          <span className="text-lg">{u.avatar}</span>
                          <div>
                            <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{u.name}</p>
                            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>@{u.username}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : mentionInput && (
                    <p className="text-xs text-center py-2" style={{ color: 'var(--text-muted)' }}>Kullanıcı bulunamadı</p>
                  )}
                  <button type="button" onClick={() => { setShowMentions(false); setMentionInput('') }}
                    className="w-full mt-2 py-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>Kapat</button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Etiketler (maks 5)</label>
              <div className="flex gap-2 flex-wrap mb-2">
                {tags.map(t => (
                  <span key={t} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(29,158,117,0.15)', color: '#1D9E75' }}>
                    #{t}
                    <button type="button" onClick={() => removeTag(t)} className="ml-1 text-base leading-none">×</button>
                  </span>
                ))}
              </div>
              {tags.length < 5 && (
                <div className="flex gap-2">
                  <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                    placeholder="Etiket yaz, Enter'a bas" className="auth-input flex-1" />
                  <button type="button" onClick={addTag} className="px-4 rounded-xl text-xs font-semibold" style={{ background: 'var(--bg-subtle)', color: 'var(--text)' }}>Ekle</button>
                </div>
              )}
            </div>
          </>
        )}

        {type === 'story' && (
          <>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Emoji</label>
              <input type="text" value={coverEmoji} onChange={e => setCoverEmoji(e.target.value)} maxLength={2} className="auth-input text-center text-3xl py-3" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Hikaye Fotoğrafı (opsiyonel)</label>
              <PhotoUpload type="image" currentUrl={storyImage} onUpload={setStoryImage} maxSizeMB={5} />
            </div>
            <div className="px-4 py-3 rounded-xl text-xs" style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
              ⏱️ Hikayen 24 saat boyunca görünür kalacak
            </div>
          </>
        )}

        {type === 'reel' && (
          <>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Kategori *</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="auth-input">
                {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.emoji} {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Kısa Video (Maks 60 sn) *</label>
              <PhotoUpload type="video" currentUrl={reelVideo} onUpload={handleVideoUpload} maxSizeMB={50} />
              {reelVideo && <video ref={videoRef} src={reelVideo} className="hidden" preload="metadata" />}
              {reelDuration > 0 && (
                <p className="text-xs mt-2" style={{ color: reelDuration > 60 ? '#e24b4a' : '#1D9E75' }}>
                  {reelDuration > 60 ? `⚠️ Çok uzun: ${reelDuration.toFixed(1)}sn` : `✓ Süre: ${reelDuration.toFixed(1)}sn`}
                </p>
              )}
            </div>
          </>
        )}

        {type === 'video' && (
          <>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>YouTube URL *</label>
              <input type="url" value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} required
                placeholder="https://www.youtube.com/watch?v=..." className="auth-input" />
              {youtubePreview && (
                <div className="mt-3 rounded-xl overflow-hidden">
                  <div className="relative w-full" style={{ paddingBottom: '56.25%', background: '#000' }}>
                    <iframe src={`https://www.youtube.com/embed/${youtubePreview}`} className="absolute inset-0 w-full h-full" allowFullScreen />
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Kategori *</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="auth-input">
                {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.emoji} {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Açıklama (opsiyonel)</label>
              <textarea rows={4} value={content} onChange={e => setContent(e.target.value)}
                placeholder="Video hakkında..." className="auth-input resize-none" />
            </div>
          </>
        )}

        <div className="flex gap-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <Link href="/" className="flex-1 py-2.5 rounded-xl text-sm font-semibold border text-center" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            İptal
          </Link>
          <button type="submit" disabled={submitting}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
            style={{ background: '#1D9E75' }}>
            {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {submitting ? 'Gönderiliyor...' : 'Gönder'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function KatkidaBulunPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <KatkidaBulunContent />
    </Suspense>
  )
}
