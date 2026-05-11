'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/data'
import { useToast } from '@/components/ui/Toast'
import PhotoUpload from '@/components/upload/PhotoUpload'

const COVER_EMOJIS = ['📝','🔬','🧠','🌌','⚛️','🧬','💡','🎨','🚀','🌍','🩺','🗣️','📚','🎬','🎯','💭','⚡','🌱','🔭','🎓']

export default function EditPostPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const { data: session } = useSession()
  const { show } = useToast()
  const user = session?.user as any
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState('Bilim')
  const [coverEmoji, setCoverEmoji] = useState('📝')
  const [coverImage, setCoverImage] = useState('')
  const [youtubeId, setYoutubeId] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function loadPost() {
      try {
        const allPosts = await fetch('/api/db/posts', { cache: 'no-store' }).then(r => r.json())
        const found = Array.isArray(allPosts) ? allPosts.find((p: any) => p.slug === params.slug) : null
        if (!found) {
          show('error', 'Yazı bulunamadı')
          router.replace('/')
          return
        }
        if (!user) {
          router.replace('/auth/login')
          return
        }
        if (found.author?.id !== user.id && user.role !== 'ADMIN') {
          show('error', 'Bu yazıyı düzenleme yetkin yok')
          router.replace(`/blog/${params.slug}`)
          return
        }
        setPost(found)
        setTitle(found.title || '')
        setContent(found.content || '')
        setExcerpt(found.excerpt || '')
        setCategory(found.category || 'Bilim')
        setCoverEmoji(found.coverEmoji || '📝')
        setCoverImage(found.coverImage || '')
        setYoutubeId(found.youtubeId || '')
      } catch (e) { show('error', 'Yükleme hatası') }
      setLoading(false)
    }
    if (user !== undefined) loadPost()
  }, [user, params.slug, router, show])

  if (loading || !post) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const id = post._id || post.id
      const res = await fetch(`/api/db/posts/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, excerpt, category, coverEmoji, coverImage, youtubeId }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Güncelleme başarısız')
      }
      show('success', 'Yazı güncellendi')
      router.replace(`/blog/${params.slug}`)
    } catch (err: any) { show('error', err.message) }
    setSubmitting(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text)' }}>✏️ Yazıyı Düzenle</h1>

      <form onSubmit={handleSave} className="rounded-2xl p-6 space-y-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Başlık</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} maxLength={120} className="auth-input" />
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
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Kapak Fotoğrafı</label>
          <PhotoUpload type="image" currentUrl={coverImage} onUpload={setCoverImage} maxSizeMB={5} />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>YouTube ID (opsiyonel)</label>
          <input type="text" value={youtubeId} onChange={e => setYoutubeId(e.target.value)} placeholder="Örn: dQw4w9WgXcQ" className="auth-input" />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Özet</label>
          <input type="text" value={excerpt} onChange={e => setExcerpt(e.target.value)} maxLength={160} className="auth-input" />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>İçerik</label>
          <textarea rows={16} value={content} onChange={e => setContent(e.target.value)} className="auth-input resize-none" style={{ fontFamily: 'var(--font-body)' }} />
        </div>

        <div className="flex gap-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <Link href={`/blog/${params.slug}`} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border text-center" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>İptal</Link>
          <button type="submit" disabled={submitting} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: '#1D9E75' }}>
            {submitting ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  )
}
