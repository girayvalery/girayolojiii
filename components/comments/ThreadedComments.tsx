'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { timeAgo } from '@/lib/utils'
import { useAuthGate } from '@/components/auth/AuthGate'
import { useToast } from '@/components/ui/Toast'
import UserAvatar from '@/components/avatar/UserAvatar'

type Comment = {
  id: string
  postId: string
  parentId: string | null
  content: string
  author: { id: string; name: string; username?: string; avatar?: string; avatarColor?: string; avatarConfig?: any; photoUrl?: string }
  likes: number
  likedBy?: string[]
  createdAt: string
  replies?: Comment[]
}

function CommentNode({ comment, depth = 0, currentUserId, onReply, onLike, onDelete }: {
  comment: Comment; depth?: number; currentUserId?: string
  onReply: (parentId: string, content: string) => Promise<void>
  onLike: (id: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const { requireAuth } = useAuthGate()
  const [collapsed, setCollapsed] = useState(false)
  const [replying, setReplying] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function startReply() {
    if (!requireAuth('Yanıt vermek')) return
    setReplying(p => !p)
  }

  async function submitReply() {
    if (!replyText.trim()) return
    setSubmitting(true)
    await onReply(comment.id, replyText)
    setReplyText(''); setReplying(false); setSubmitting(false)
  }

  function handleLike() {
    if (!requireAuth('Beğenmek')) return
    onLike(comment.id)
  }

  const isOwn = currentUserId === comment.author.id
  const hasLiked = currentUserId ? (comment.likedBy || []).includes(currentUserId) : false
  const indent = Math.min(depth, 4)

  return (
    <div className={`${indent > 0 ? 'ml-4 pl-3' : ''}`} style={{ borderLeft: indent > 0 ? '2px solid #33333355' : 'none' }}>
      <div className="py-3">
        <div className="flex items-center gap-2 mb-2">
          <Link href={`/profile/${comment.author.id}`} className="shrink-0 hover:scale-110 transition-transform">
            <UserAvatar user={comment.author as any} size={28} />
          </Link>
          <Link href={`/profile/${comment.author.id}`} className="text-xs font-semibold hover:text-green-500" style={{ color: 'var(--text)' }}>
            @{comment.author.username || comment.author.name}
          </Link>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{timeAgo(comment.createdAt)}</span>
          <button onClick={() => setCollapsed(p => !p)} className="text-xs ml-1" style={{ color: 'var(--text-muted)' }} title="Gizle/Aç">
            {collapsed ? '▶' : '▼'}
          </button>
          {isOwn && !collapsed && (
            <button onClick={() => onDelete(comment.id)} className="text-xs ml-auto hover:text-red-500" style={{ color: 'var(--text-muted)' }} title="Sil">🗑️</button>
          )}
        </div>

        {!collapsed && (
          <>
            <p className="text-sm leading-relaxed mb-2 pl-9 whitespace-pre-wrap" style={{ color: 'var(--text)', fontFamily: 'var(--font-body)' }}>{comment.content}</p>
            <div className="flex items-center gap-3 pl-9">
              <button onClick={startReply} className="text-xs font-medium hover:text-green-500" style={{ color: 'var(--text-muted)' }}>💬 Yanıtla</button>
              <button onClick={handleLike}
                className="ml-auto flex items-center gap-1 text-xs font-medium hover:scale-110 transition-all"
                style={{ color: hasLiked ? '#1D9E75' : 'var(--text-muted)' }}>
                <span>{hasLiked ? '👍' : '👍🏻'}</span> {comment.likes || 0}
              </button>
            </div>

            {replying && (
              <div className="mt-3 pl-9">
                <textarea rows={3} value={replyText} onChange={e => setReplyText(e.target.value)}
                  placeholder={`@${comment.author.username || comment.author.name} yanıtla...`}
                  className="auth-input resize-none mb-2 text-sm" autoFocus />
                <div className="flex gap-2">
                  <button onClick={submitReply} disabled={submitting} className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white" style={{ background: '#1D9E75' }}>
                    {submitting ? '...' : 'Yanıtla'}
                  </button>
                  <button onClick={() => { setReplying(false); setReplyText('') }} className="px-4 py-1.5 rounded-xl text-xs font-semibold" style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>İptal</button>
                </div>
              </div>
            )}

            {(comment.replies && comment.replies.length > 0) && (
              <div className="mt-2">
                {comment.replies.map(r => <CommentNode key={r.id} comment={r} depth={depth + 1} currentUserId={currentUserId} onReply={onReply} onLike={onLike} onDelete={onDelete} />)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function ThreadedComments({ postId }: { postId: string }) {
  const { data: session } = useSession()
  const { requireAuth } = useAuthGate()
  const { show } = useToast()
  const userId = (session?.user as any)?.id
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`, { cache: 'no-store' })
      const flat: Comment[] = await res.json()
      const roots = flat.filter(c => !c.parentId)
      function attach(node: Comment): Comment {
        return { ...node, replies: flat.filter(c => c.parentId === node.id).map(attach) }
      }
      setComments(roots.map(attach))
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [postId])

  async function submit(parentId: string | null, content: string) {
    if (!requireAuth('Yorum yapmak')) return
    if (!content.trim()) return
    try {
      const res = await fetch('/api/comments', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, parentId, content }),
      })
      if (res.ok) { show('success', 'Yorumun eklendi'); load() }
      else show('error', 'Yorum eklenemedi')
    } catch { show('error', 'Bağlantı hatası') }
  }

  async function submitNew() {
    if (!requireAuth('Yorum yapmak')) return
    if (!newComment.trim()) return
    setSubmitting(true)
    await submit(null, newComment)
    setNewComment(''); setSubmitting(false)
  }

  async function likeComment(commentId: string) {
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like' }),
      })
      if (res.ok) load()
    } catch {}
  }

  async function deleteComment(commentId: string) {
    if (!confirm('Yorumu silmek istediğine emin misin?')) return
    try {
      const res = await fetch(`/api/comments/${commentId}`, { method: 'DELETE' })
      if (res.ok) { show('success', 'Yorum silindi'); load() }
    } catch {}
  }

  const total = (function count(items: Comment[]): number {
    return items.reduce((s, c) => s + 1 + count(c.replies || []), 0)
  })(comments)

  return (
    <section className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>💬 Yorumlar</h2>
        <span className="text-sm px-2.5 py-0.5 rounded-full" style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>{total}</span>
      </div>

      <div className="mb-6 rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <textarea rows={3} value={newComment} onChange={e => setNewComment(e.target.value)}
          onFocus={() => requireAuth('Yorum yapmak')}
          placeholder="Düşüncelerini paylaş..." className="auth-input resize-none mb-2 text-sm" />
        <button onClick={submitNew} disabled={submitting} className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
          style={{ background: newComment.trim() ? '#1D9E75' : '#555' }}>
          {submitting ? 'Gönderiliyor...' : 'Yorum Yap'}
        </button>
      </div>

      <div style={{ borderTop: '1px solid var(--border)' }}>
        {loading ? (
          <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>Yorumlar yükleniyor...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
            <div className="text-5xl mb-3">💭</div>
            <p className="text-sm">Henüz yorum yok. İlk yorumu sen yap!</p>
          </div>
        ) : comments.map(c => <CommentNode key={c.id} comment={c} depth={0} currentUserId={userId} onReply={submit} onLike={likeComment} onDelete={deleteComment} />)}
      </div>
    </section>
  )
}
