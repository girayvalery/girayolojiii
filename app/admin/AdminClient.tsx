'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
// Reels/stories MongoDB'den çekilir
import UserAvatar from '@/components/avatar/UserAvatar'

type Tab = 'overview'|'pending'|'published'|'users'|'videos'|'reels'|'stories'|'feedback'|'settings'

export default function AdminClient() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('overview')
  const [pendingList, setPendingList] = useState<any[]>([])
  const [published, setPublished] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [videos, setVideos] = useState<any[]>([])
  const [feedback, setFeedback] = useState<any[]>([])
  const [reels, setReels] = useState<any[]>([])
  const [stories, setStories] = useState<any[]>([])
  const [selected, setSelected] = useState<any|null>(null)
  const [rejectNote, setRejectNote] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ok = document.cookie.includes('admin_auth=true')
    if (!ok) { router.replace('/admin/login'); return }
    loadAll()
  }, [router])

  async function loadAll() {
    setLoading(true)
    try {
      const [subs, posts, usersList, vids, fb, reelsList, storiesList] = await Promise.all([
        fetch('/api/submissions', { cache: 'no-store' }).then(r => r.json()).catch(() => []),
        fetch('/api/db/posts', { cache: 'no-store' }).then(r => r.json()).catch(() => []),
        fetch('/api/db/users', { cache: 'no-store' }).then(r => r.json()).catch(() => []),
        fetch('/api/db/videos', { cache: 'no-store' }).then(r => r.json()).catch(() => []),
        fetch('/api/feedback', { cache: 'no-store' }).then(r => r.json()).catch(() => []),
        fetch('/api/db/reels', { cache: 'no-store' }).then(r => r.json()).catch(() => []),
        fetch('/api/db/stories', { cache: 'no-store' }).then(r => r.json()).catch(() => []),
      ])
      setPendingList(Array.isArray(subs) ? subs : [])
      setPublished(Array.isArray(posts) ? posts : [])
      setUsers(Array.isArray(usersList) ? usersList : [])
      setVideos(Array.isArray(vids) ? vids : [])
      setFeedback(Array.isArray(fb) ? fb : [])
      setReels(Array.isArray(reelsList) ? reelsList : [])
      setStories(Array.isArray(storiesList) ? storiesList : [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  function logout() {
    document.cookie = 'admin_auth=; path=/; max-age=0'
    router.replace('/admin/login')
  }

  async function approve(sub: any) {
    await fetch(`/api/submissions/${sub._id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve' }),
    })
    setPendingList(p => p.filter(x => x._id !== sub._id))
    loadAll()
  }

  async function reject(sub: any) {
    await fetch(`/api/submissions/${sub._id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reject', note: rejectNote }),
    })
    setPendingList(p => p.filter(x => x._id !== sub._id))
    setSelected(null); setRejectNote('')
  }

  async function deletePost(post: any) {
    if (!confirm('Yazıyı silmek istediğine emin misin?')) return
    await fetch(`/api/db/posts/${post._id || post.id}`, { method: 'DELETE' })
    setPublished(p => p.filter(x => (x._id || x.id) !== (post._id || post.id)))
  }

  async function changeRole(userId: string, newRole: 'ADMIN'|'YAZAR'|'UYE') {
    await fetch(`/api/admin/users/${userId}/role`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    })
    setUsers(p => p.map(u => u.id === userId ? { ...u, role: newRole } : u))
  }

  async function deleteUser(userId: string) {
    if (!confirm('Kullanıcıyı silmek istediğine emin misin?')) return
    await fetch(`/api/db/users/${userId}`, { method: 'DELETE' })
    setUsers(p => p.filter(u => u.id !== userId))
  }

  const filteredUsers = users.filter(u =>
    !searchQuery ||
    (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalViews = published.reduce((s, p) => s + (p.viewCount || 0), 0)

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="sticky top-0 z-40" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-14 gap-3">
          <Link href="/" className="text-lg font-semibold" style={{ color: '#1D9E75' }}>Girayoloji</Link>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(29,158,117,0.1)', color: '#1D9E75' }}>⚡ Admin</span>
          <button onClick={loadAll} className="ml-auto text-xs px-3 py-1.5 rounded-lg" style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>🔄 Yenile</button>
          <button onClick={logout} className="text-xs px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>Çıkış</button>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text)' }}>Yönetim Paneli</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Sitede her şeyi yönet</p>

        <div className="flex gap-2 mb-6 flex-wrap overflow-x-auto pb-2">
          {([
            { key: 'overview' as const, icon: '📊', label: 'Genel' },
            { key: 'pending' as const, icon: '⏳', label: `Bekleyen (${pendingList.length})` },
            { key: 'published' as const, icon: '✅', label: `Yazılar (${published.length})` },
            { key: 'users' as const, icon: '👥', label: `Üyeler (${users.length})` },
            { key: 'videos' as const, icon: '🎬', label: `Videolar (${videos.length})` },
            { key: 'reels' as const, icon: '⚡', label: `Reels (${reels.length})` },
            { key: 'stories' as const, icon: '📸', label: `Hikayeler (${stories.length})` },
            { key: 'feedback' as const, icon: '💌', label: `Geri Bildirim (${feedback.length})` },
            { key: 'settings' as const, icon: '⚙️', label: 'Ayarlar' },
          ]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap"
              style={{ background: tab === t.key ? '#1D9E75' : 'var(--bg-subtle)', color: tab === t.key ? '#fff' : 'var(--text-muted)' }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {loading && <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>}

        {!loading && tab === 'overview' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Toplam Yazı', value: published.length, icon: '📝', color: '#1D9E75' },
              { label: 'Bekleyen Onay', value: pendingList.length, icon: '⏳', color: '#ba7517' },
              { label: 'Toplam Üye', value: users.length, icon: '👥', color: '#534AB7' },
              { label: 'Toplam Görüntülenme', value: totalViews.toLocaleString('tr-TR'), icon: '👁', color: '#185fa5' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="text-3xl font-semibold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {!loading && tab === 'pending' && (
          <div className="space-y-4">
            {pendingList.length === 0 ? (
              <div className="text-center py-20 rounded-2xl" style={{ background: 'var(--bg-card)' }}>
                <div className="text-5xl mb-3">🎉</div>
                <p className="font-semibold" style={{ color: 'var(--text)' }}>Tüm gönderiler incelendi!</p>
              </div>
            ) : pendingList.map((sub: any) => (
              <div key={sub._id} className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: 'var(--bg-subtle)' }}>{sub.emoji || '📝'}</div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(186,117,23,0.15)', color: '#ba7517' }}>⏳ {sub.type || 'post'}</span>
                    <h3 className="font-semibold mb-1 mt-2" style={{ color: 'var(--text)' }}>{sub.title}</h3>
                    <p className="text-sm mb-2 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{(sub.content || '').slice(0, 200)}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>👤 {sub.userName} · {sub.category || ''}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => approve(sub)} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: '#1D9E75' }}>✓ Onayla</button>
                    <button onClick={() => setSelected(sub)} className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: 'rgba(162,45,45,0.12)', color: '#e24b4a' }}>✕ Reddet</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && tab === 'published' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {published.map((post: any) => (
              <div key={post._id || post.id} className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: 'var(--bg-subtle)' }}>{post.coverEmoji}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold line-clamp-2" style={{ color: 'var(--text)' }}>{post.title}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>@{post.author?.username || post.author?.name}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                  <span>👁 {post.viewCount || 0}</span>
                  <span>❤️ {post.likeCount || 0}</span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/blog/${post.slug}`} target="_blank" className="flex-1 text-center py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--bg-subtle)', color: 'var(--text)' }}>Görüntüle</Link>
                  <Link href={`/blog/${post.slug}/edit`} className="flex-1 text-center py-1.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(29,158,117,0.1)', color: '#1D9E75' }}>Düzenle</Link>
                  <button onClick={() => deletePost(post)} className="flex-1 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(226,75,74,0.1)', color: '#e24b4a' }}>Sil</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && tab === 'users' && (
          <>
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Kullanıcı ara..." className="auth-input mb-4 max-w-md" />
            <div className="space-y-3">
              {filteredUsers.map(u => (
                <div key={u.id} className="flex items-center gap-4 rounded-xl p-4 flex-wrap" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <UserAvatar user={u} size={40} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{u.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>@{u.username} · {u.email}</p>
                  </div>
                  <select value={u.role} onChange={e => changeRole(u.id, e.target.value as any)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ background: 'var(--bg-subtle)', color: 'var(--text)', border: '1px solid var(--border)' }}>
                    <option value="UYE">Üye</option>
                    <option value="YAZAR">Yazar</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <Link href={`/profile/${u.id}`} target="_blank" className="text-xs px-3 py-1.5 rounded-lg" style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>Profil</Link>
                  <button onClick={() => deleteUser(u.id)} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: 'rgba(226,75,74,0.1)', color: '#e24b4a' }}>Sil</button>
                </div>
              ))}
              {filteredUsers.length === 0 && <p className="text-center py-10" style={{ color: 'var(--text-muted)' }}>Üye bulunamadı.</p>}
            </div>
          </>
        )}

        {!loading && tab === 'videos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((v: any) => (
              <div key={v._id || v.id} className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                {v.youtubeId ? (
                  <img src={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`} alt={v.title} className="w-full h-32 object-cover" />
                ) : (
                  <div className={`relative h-32 flex items-center justify-center bg-gradient-to-br ${v.bgGradient || 'from-gray-800 to-gray-900'}`}>
                    <span className="text-4xl">{v.emoji || '🎬'}</span>
                  </div>
                )}
                <div className="p-4">
                  <p className="text-sm font-semibold line-clamp-1" style={{ color: 'var(--text)' }}>{v.title}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{(v.views || 0).toLocaleString()} görüntülenme</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && tab === 'reels' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {reels.length === 0 ? (
              <p className="col-span-full text-center py-10" style={{ color: 'var(--text-muted)' }}>Henüz kısa video yok.</p>
            ) : reels.map((r: any) => (
              <div key={r.id || r._id} className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="relative bg-black" style={{ aspectRatio: '9/16' }}>
                  {r.thumbnail ? (
                    <img src={r.thumbnail} alt={r.title} className="absolute inset-0 w-full h-full object-cover" />
                  ) : r.mediaUrl ? (
                    <video src={r.mediaUrl} className="absolute inset-0 w-full h-full object-cover" muted playsInline preload="metadata" />
                  ) : (
                    <div className={`absolute inset-0 flex items-center justify-center text-4xl bg-gradient-to-b ${r.bgGradient || 'from-purple-900 to-purple-700'}`}>
                      {r.emoji || '⚡'}
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium line-clamp-2" style={{ color: 'var(--text)' }}>{r.title}</p>
                  <div className="flex gap-1 mt-2">
                    <a href={`/reels/${r.slug || r.id}`} target="_blank" className="flex-1 text-center py-1 rounded text-[10px]" style={{ background: 'var(--bg-subtle)', color: 'var(--text)' }}>Görüntüle</a>
                    <button onClick={async () => {
                      if (!confirm('Silmek istediğine emin misin?')) return
                      await fetch(`/api/db/reels/${r._id || r.id}`, { method: 'DELETE' })
                      setReels((p: any[]) => p.filter(x => (x._id || x.id) !== (r._id || r.id)))
                    }} className="flex-1 py-1 rounded text-[10px]" style={{ background: 'rgba(226,75,74,0.1)', color: '#e24b4a' }}>Sil</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && tab === 'stories' && (
          <>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold" style={{ color: 'var(--text)' }}>📸 Hikayeler ({stories.length})</h2>
              {stories.length > 0 && (
                <button onClick={async () => {
                  if (!confirm(`${stories.length} hikayeyi silmek istediğine emin misin?`)) return
                  const res = await fetch('/api/admin/delete-all-stories', { method: 'POST' })
                  const d = await res.json()
                  if (res.ok) { alert(`${d.deleted} hikaye silindi`); setStories([]) }
                  else alert('Silinemedi: ' + d.error)
                }} className="px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ background: '#e24b4a' }}>🗑️ Tümünü Sil</button>
              )}
            </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {stories.length === 0 ? (
              <p className="col-span-full text-center py-10" style={{ color: 'var(--text-muted)' }}>Henüz hikaye yok.</p>
            ) : stories.map((s: any) => (
              <div key={s.id || s._id} className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="relative bg-black" style={{ aspectRatio: '9/16' }}>
                  {s.mediaUrl ? (
                    s.mediaType === 'video' ? (
                      <video src={s.mediaUrl} className="absolute inset-0 w-full h-full object-cover" muted playsInline preload="metadata" />
                    ) : (
                      <img src={s.mediaUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    )
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">📸</div>
                  )}
                </div>
                <div className="p-2 text-center">
                  <p className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>{s.user?.name}</p>
                </div>
              </div>
            ))}
          </div>
          </>
        )}

        {!loading && tab === 'feedback' && (
          <div className="space-y-3">
            {feedback.length === 0 ? (
              <p className="text-center py-10" style={{ color: 'var(--text-muted)' }}>Henüz geri bildirim yok.</p>
            ) : feedback.map((f: any) => (
              <div key={f._id} className="rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{
                    background: f.type === 'sikayet' ? 'rgba(226,75,74,0.15)' : f.type === 'hata' ? 'rgba(186,117,23,0.15)' : 'rgba(29,158,117,0.15)',
                    color: f.type === 'sikayet' ? '#e24b4a' : f.type === 'hata' ? '#ba7517' : '#1D9E75',
                  }}>
                    {f.type === 'sikayet' ? '⚠️ Şikayet' : f.type === 'hata' ? '🐛 Hata' : '💡 Öneri'}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(f.createdAt).toLocaleString('tr-TR')}</span>
                </div>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--text)' }}>{f.subject}</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{f.message}</p>
                {f.email && <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>✉️ {f.email}</p>}
              </div>
            ))}
          </div>
        )}

        {!loading && tab === 'settings' && (
          <div className="rounded-2xl p-6 space-y-4 max-w-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>⚙️ Site Ayarları</h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Site ayarları yakında.</p>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }} onClick={() => setSelected(null)}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#161616', border: '1px solid #2a2a2a' }} onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold mb-1" style={{ color: '#f5f5f5' }}>Reddetme Sebebi</h3>
            <p className="text-sm mb-4" style={{ color: '#999' }}>"{selected.title}"</p>
            <textarea rows={3} value={rejectNote} onChange={e => setRejectNote(e.target.value)} className="auth-input resize-none mb-4" />
            <div className="flex gap-3">
              <button onClick={() => reject(selected)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: '#a32d2d' }}>Reddet</button>
              <button onClick={() => setSelected(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ background: '#1f1f1f', color: '#bbb' }}>İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
