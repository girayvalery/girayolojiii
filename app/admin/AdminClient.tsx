'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getPending, getPublished, getAllUsers, getAllVideos, getAllReels, getAllStories, type Post } from '@/lib/data'

type Tab = 'overview'|'pending'|'published'|'users'|'videos'|'reels'|'stories'|'feedback'|'settings'

export default function AdminClient() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('overview')
  const [pendingList, setPendingList] = useState<Post[]>([])
  const [published] = useState(() => getPublished())
  const [users, setUsers] = useState(() => getAllUsers())
  const [videos] = useState(() => getAllVideos())
  const [reels] = useState(() => getAllReels())
  const [stories] = useState(() => getAllStories())
  const [selected, setSelected] = useState<Post|null>(null)
  const [rejectNote, setRejectNote] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [feedback, setFeedback] = useState<any[]>([])

  useEffect(() => {
    const ok = document.cookie.includes('admin_auth=true')
    if (!ok) router.replace('/admin/login')
    setPendingList(getPending())
  }, [router])

  function logout() {
    document.cookie = 'admin_auth=; path=/; max-age=0'
    router.replace('/admin/login')
  }

  function approve(post: Post) { setPendingList(p => p.filter(x => x.id !== post.id)) }
  function reject(post: Post) { setPendingList(p => p.filter(x => x.id !== post.id)); setSelected(null); setRejectNote('') }
  function changeRole(userId: string, newRole: 'ADMIN'|'YAZAR'|'UYE') {
    setUsers(p => p.map(u => u.id === userId ? { ...u, role: newRole } : u))
  }
  function deleteUser(userId: string) {
    if (confirm('Kullanıcıyı silmek istediğinden emin misin?')) {
      setUsers(p => p.filter(u => u.id !== userId))
    }
  }

  const filteredUsers = users.filter(u =>
    !searchQuery ||
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalViews = published.reduce((s, p) => s + p.viewCount, 0)
  const totalLikes = published.reduce((s, p) => s + p.likeCount, 0)

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="sticky top-0 z-40" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-14 gap-3">
          <Link href="/" className="text-lg font-semibold" style={{ color: '#1D9E75' }}>Girayoloji</Link>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(29,158,117,0.1)', color: '#1D9E75' }}>⚡ Admin</span>
          <button onClick={logout} className="ml-auto text-xs px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>Çıkış</button>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text)' }}>Yönetim Paneli</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Sitede her şeyi yönet</p>

        {/* Tabs */}
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

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>📈 İçerik Dağılımı</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Blog Yazıları', value: published.length, color: '#1D9E75' },
                    { label: 'YouTube Videolar', value: videos.length, color: '#534AB7' },
                    { label: 'Kısa Videolar', value: reels.length, color: '#D4537E' },
                    { label: 'Hikayeler', value: stories.length, color: '#ba7517' },
                  ].map(s => (
                    <div key={s.label}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span style={{ color: 'var(--text)' }}>{s.label}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{s.value}</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-subtle)' }}>
                        <div className="h-full" style={{ background: s.color, width: `${(s.value / Math.max(published.length, videos.length, reels.length, stories.length)) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>🏆 En Popüler 5 Yazı</h3>
                <div className="space-y-2">
                  {[...published].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5).map((post, i) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'var(--bg-subtle)' }}>
                      <span className="text-sm font-bold tabular-nums w-6" style={{ color: i < 3 ? '#1D9E75' : 'var(--text-muted)' }}>#{i + 1}</span>
                      <span className="text-xl">{post.coverEmoji}</span>
                      <p className="flex-1 text-xs font-medium line-clamp-1" style={{ color: 'var(--text)' }}>{post.title}</p>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>👁 {post.viewCount}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* PENDING */}
        {tab === 'pending' && (
          <div className="space-y-4">
            {pendingList.length === 0 ? (
              <div className="text-center py-20 rounded-2xl" style={{ background: 'var(--bg-card)' }}>
                <div className="text-5xl mb-3">🎉</div>
                <p className="font-semibold" style={{ color: 'var(--text)' }}>Tüm gönderiler incelendi!</p>
              </div>
            ) : pendingList.map(post => (
              <div key={post.id} className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex items-start gap-4 flex-wrap">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 bg-gradient-to-br ${post.bgGradient}`}>{post.coverEmoji}</div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(186,117,23,0.15)', color: '#ba7517' }}>⏳ Bekliyor</span>
                    <h3 className="font-semibold mb-1 mt-2" style={{ color: 'var(--text)' }}>{post.title}</h3>
                    <p className="text-sm mb-2 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{post.excerpt}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{post.author.avatar} {post.author.name}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => approve(post)} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: '#1D9E75' }}>✓ Onayla</button>
                    <button onClick={() => setSelected(post)} className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: 'rgba(162,45,45,0.12)', color: '#e24b4a' }}>✕ Reddet</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PUBLISHED */}
        {tab === 'published' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {published.map(post => (
              <div key={post.id} className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 bg-gradient-to-br ${post.bgGradient}`}>{post.coverEmoji}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold line-clamp-2" style={{ color: 'var(--text)' }}>{post.title}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{post.author.name}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                  <span>👁 {post.viewCount}</span>
                  <span>❤️ {post.likeCount}</span>
                  <span>💬 0</span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/blog/${post.slug}`} className="flex-1 text-center py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--bg-subtle)', color: 'var(--text)' }}>Görüntüle</Link>
                  <button className="flex-1 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(226,75,74,0.1)', color: '#e24b4a' }}>Sil</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* USERS */}
        {tab === 'users' && (
          <>
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Kullanıcı ara..."
              className="auth-input mb-4 max-w-md" />
            <div className="space-y-3">
              {filteredUsers.map(u => (
                <div key={u.id} className="flex items-center gap-4 rounded-xl p-4 flex-wrap" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ background: `${u.avatarColor}22` }}>{u.avatar}</div>
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
                  <Link href={`/profile/${u.id}`} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>Profil</Link>
                  <button onClick={() => deleteUser(u.id)} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: 'rgba(226,75,74,0.1)', color: '#e24b4a' }}>Sil</button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* VIDEOS */}
        {tab === 'videos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map(v => (
              <div key={v.id} className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className={`relative h-32 flex items-center justify-center bg-gradient-to-br ${v.bgGradient}`}>
                  <span className="text-4xl">{v.emoji}</span>
                  <span className="absolute bottom-2 right-2 text-xs text-white px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.7)' }}>{v.duration}</span>
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold line-clamp-1" style={{ color: 'var(--text)' }}>{v.title}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{v.views.toLocaleString()} görüntülenme</p>
                  <button className="w-full mt-2 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(226,75,74,0.1)', color: '#e24b4a' }}>Sil</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* REELS */}
        {tab === 'reels' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {reels.map(r => (
              <div key={r.id} className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className={`relative h-40 flex items-center justify-center bg-gradient-to-b ${r.bgGradient}`}>
                  <span className="text-4xl">{r.emoji}</span>
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium line-clamp-2" style={{ color: 'var(--text)' }}>{r.title}</p>
                  <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{r.views.toLocaleString()} · ❤️ {r.likes}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STORIES */}
        {tab === 'stories' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {stories.map(s => (
              <div key={s.id} className="rounded-xl p-4 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="text-3xl mb-2">{s.emoji}</div>
                <p className="text-xs font-medium" style={{ color: 'var(--text)' }}>{s.user.name}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{s.title}</p>
              </div>
            ))}
          </div>
        )}

        {/* SETTINGS */}
        {tab === 'settings' && (
          <div className="rounded-2xl p-6 space-y-4 max-w-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>⚙️ Site Ayarları</h3>
            <div className="space-y-3">
              {[
                { label: 'Yeni kayıtları kabul et', enabled: true },
                { label: 'Yorum onayı gerekli', enabled: false },
                { label: 'E-posta bildirimleri', enabled: true },
                { label: 'Bakım modu', enabled: false },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-subtle)' }}>
                  <span className="text-sm" style={{ color: 'var(--text)' }}>{s.label}</span>
                  <div className="w-10 h-6 rounded-full relative cursor-pointer" style={{ background: s.enabled ? '#1D9E75' : 'var(--border)' }}>
                    <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all" style={{ left: s.enabled ? '18px' : '2px' }} />
                  </div>
                </div>
              ))}
            </div>
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
