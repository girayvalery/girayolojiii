'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import UserAvatar from '@/components/avatar/UserAvatar'
import { timeAgo } from '@/lib/utils'
import { useAuthGate } from '@/components/auth/AuthGate'
import { useToast } from '@/components/ui/Toast'

type Comment = {
  id: string
  reelId: string
  parentId: string | null
  author: any
  content: string
  likes: string[]
  createdAt: string
}

export default function ReelComments({ reelId }: { reelId: string }) {
  const { data: session } = useSession()
  const { requireAuth } = useAuthGate()
  const { show } = useToast()
  const me = session?.user as any

  const [comments, setComments] = useState<Comment[]>([])
  const [text, setText] = useState('')
  const [replyTo, setReplyTo] = useState<Comment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!reelId) return
    fetch(`/api/db/reel-comments?reelId=${reelId}`, { cache: 'no-store' })
      .then(r => r.json())
      .then((d: any) => {
        if (Array.isArray(d)) setComments(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [reelId])

  async function postComment() {
    if (!requireAuth('Yorum yapmak')) return
    if (!text.trim()) return
    const body = { reelId, content: text.trim(), parentId: replyTo?.id || null }
    try {
      const res = await fetch('/api/db/reel-comments', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const d = await res.json()
      if (res.ok && d.comment) {
        setComments(prev => [...prev, d.comment])
        setText('')
        setReplyTo(null)
        show('success', '💬 Yorumun eklendi')
      } else show('error', d.error || 'Yorum eklenemedi')
    } catch { show('error', 'Hata oluştu') }
  }

  async function toggleLike(commentId: string) {
    if (!requireAuth('Beğenmek')) return
    try {
      const res = await fetch(`/api/db/reel-comments/${commentId}/like`, { method: 'POST' })
      const d = await res.json()
      if (res.ok) {
        setComments(prev => prev.map(c => c.id === commentId ? { ...c, likes: d.likes } : c))
      }
    } catch {}
  }

  async function deleteComment(commentId: string) {
    if (!confirm('Yorumu sil?')) return
    try {
      const res = await fetch(`/api/db/reel-comments/${commentId}`, { method: 'DELETE' })
      if (res.ok) {
        setComments(prev => prev.filter(c => c.id !== commentId && c.parentId !== commentId))
        show('success', 'Silindi')
      }
    } catch {}
  }

  // Yapı: önce parent yorumlar, sonra cevaplar
  const parents = comments.filter(c => !c.parentId)
  const repliesByParent: Record<string, Comment[]> = {}
  comments.filter(c => c.parentId).forEach(c => {
    if (!repliesByParent[c.parentId!]) repliesByParent[c.parentId!] = []
    repliesByParent[c.parentId!].push(c)
  })

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="text-center py-10">
            <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : parents.length === 0 ? (
          <p className="text-center py-10 text-sm" style={{ color: 'var(--text-muted)' }}>İlk yorumu sen yap!</p>
        ) : parents.map(c => (
          <div key={c.id}>
            <CommentItem c={c} me={me}
              onLike={() => toggleLike(c.id)}
              onReply={() => setReplyTo(c)}
              onDelete={() => deleteComment(c.id)} />
            {repliesByParent[c.id]?.map(r => (
              <div key={r.id} className="ml-10 mt-2">
                <CommentItem c={r} me={me}
                  onLike={() => toggleLike(r.id)}
                  onReply={() => setReplyTo(c)}
                  onDelete={() => deleteComment(r.id)}
                  isReply />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="p-3 border-t" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
        {replyTo && (
          <div className="mb-2 text-xs flex items-center justify-between px-2 py-1 rounded-lg" style={{ background: 'var(--bg-subtle)' }}>
            <span style={{ color: 'var(--text-muted)' }}>↪️ <strong>{replyTo.author?.name}</strong>'a cevap yazıyorsun</span>
            <button onClick={() => setReplyTo(null)} className="text-sm">✕</button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text" value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && postComment()}
            placeholder={me ? "Yorum yaz..." : "Yorum yapmak için giriş yap"}
            disabled={!me}
            className="flex-1 px-3 py-2 rounded-xl text-sm"
            style={{ background: 'var(--bg-subtle)', color: 'var(--text)', border: '1px solid var(--border)' }} />
          <button onClick={postComment} disabled={!text.trim() || !me}
            className="px-4 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
            style={{ background: '#1D9E75' }}>Gönder</button>
        </div>
      </div>
    </div>
  )
}

function CommentItem({ c, me, onLike, onReply, onDelete, isReply }: { c: Comment; me: any; onLike: () => void; onReply: () => void; onDelete: () => void; isReply?: boolean }) {
  const liked = me && c.likes?.includes(me.id)
  const isOwn = me && c.author?.id === me.id
  return (
    <div className="flex gap-2">
      <UserAvatar user={c.author} size={isReply ? 28 : 36} />
      <div className="flex-1 min-w-0">
        <div className="rounded-2xl px-3 py-2" style={{ background: 'var(--bg-subtle)' }}>
          <div className="flex items-center justify-between mb-0.5">
            <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{c.author?.name}</p>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{timeAgo(c.createdAt)}</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text)' }}>{c.content}</p>
        </div>
        <div className="flex items-center gap-3 mt-1 px-2">
          <button onClick={onLike} className="text-xs flex items-center gap-1" style={{ color: liked ? '#1D9E75' : 'var(--text-muted)' }}>
            {liked ? '❤️' : '🤍'} {c.likes?.length || 0}
          </button>
          {!isReply && (
            <button onClick={onReply} className="text-xs" style={{ color: 'var(--text-muted)' }}>↪️ Cevapla</button>
          )}
          {isOwn && (
            <button onClick={onDelete} className="text-xs" style={{ color: '#e24b4a' }}>🗑️</button>
          )}
        </div>
      </div>
    </div>
  )
}
