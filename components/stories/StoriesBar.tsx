'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { getAllStories, REACTIONS, type Story } from '@/lib/data'
import { useBodyLock } from '@/lib/useBodyLock'
import { useAuthGate } from '@/components/auth/AuthGate'
import { useToast } from '@/components/ui/Toast'
import ReactionBurst from '@/components/ui/ReactionBurst'
import UserAvatar from '@/components/avatar/UserAvatar'

type GroupedStory = { userId: string; user: Story['user']; stories: Story[]; allSeen: boolean }

function StoryRing({ group, onPlay }: { group: GroupedStory; onPlay: () => void }) {
  return (
    <div className="flex flex-col items-center gap-1.5 shrink-0">
      <button onClick={onPlay}
        className="p-[2.5px] rounded-full transition-transform hover:scale-105"
        style={{
          background: group.allSeen ? 'linear-gradient(135deg,#444,#333)' : `conic-gradient(${group.user.avatarColor} 0%,#9FE1CB 50%,${group.user.avatarColor} 100%)`,
          boxShadow: group.allSeen ? 'none' : `0 0 12px ${group.user.avatarColor}55`,
        }}>
        <div className="rounded-full overflow-hidden" style={{ background: 'var(--bg-card)', border: '2px solid var(--bg)' }}>
          <UserAvatar user={group.user as any} size={56} />
        </div>
      </button>
      <span className="text-[11px] font-medium truncate w-16 text-center" style={{ color: group.allSeen ? 'var(--text-muted)' : 'var(--text)' }}>
        {(group.user as any).username ? '@' + (group.user as any).username : group.user.name.split(' ')[0]}
        {group.stories.length > 1 && <sup className="ml-0.5 text-[9px]" style={{ color: '#1D9E75' }}>{group.stories.length}</sup>}
      </span>
    </div>
  )
}

function StoryViewer({ groups, startGroupIdx, onClose, onSeen }: {
  groups: GroupedStory[]; startGroupIdx: number; onClose: () => void; onSeen: (id: string) => void
}) {
  const router = useRouter()
  const { data: session } = useSession()
  const { requireAuth } = useAuthGate()
  const { show } = useToast()
  const [groupIdx, setGroupIdx] = useState(startGroupIdx)
  const [storyIdx, setStoryIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const [showViewers, setShowViewers] = useState(false)
  const [viewers, setViewers] = useState<any[]>([])
  const [burst, setBurst] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  useBodyLock(true)

  const group = groups[groupIdx]
  const story = group?.stories[storyIdx]
  const isOwn = (session?.user as any)?.id === group?.userId

  const goNext = useCallback(() => {
    if (storyIdx < group.stories.length - 1) {
      setStoryIdx(i => i + 1); setProgress(0)
    } else if (groupIdx < groups.length - 1) {
      setGroupIdx(i => i + 1); setStoryIdx(0); setProgress(0)
    } else onClose()
  }, [storyIdx, groupIdx, group, groups, onClose])

  const goPrev = useCallback(() => {
    if (storyIdx > 0) {
      setStoryIdx(i => i - 1); setProgress(0)
    } else if (groupIdx > 0) {
      const prev = groups[groupIdx - 1]
      setGroupIdx(i => i - 1); setStoryIdx(prev.stories.length - 1); setProgress(0)
    }
  }, [storyIdx, groupIdx, groups])

  useEffect(() => {
    if (!story) return
    onSeen(story.id)
    // Görüldü kaydı
    if (session?.user && !isOwn) {
      fetch('/api/stories/view', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId: story.id }),
      }).catch(() => {})
    }
    // Sahibi - viewers fetch
    if (isOwn) {
      fetch(`/api/stories/view?storyId=${story.id}`, { cache: 'no-store' })
        .then(r => r.json())
        .then(d => setViewers(d.viewers || []))
        .catch(() => setViewers([]))
    }
    setProgress(0)
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (!paused && !burst) {
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) { clearInterval(intervalRef.current!); goNext(); return 0 }
          return p + 0.5
        })
      }, 25)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [storyIdx, groupIdx, paused, burst, goNext, onSeen, story, session, isOwn])

  function goToProfile() {
    onClose()
    router.push(`/profile/${group.userId}`)
  }

  function reactToStory(emoji: string) {
    if (!requireAuth('Tepki vermek')) return
    setPaused(true)
    setBurst(emoji)
    fetch('/api/stories/react', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storyId: story.id, emoji, storyOwnerId: group.userId }),
    }).then(() => show('success', `${emoji} tepkin gönderildi`)).catch(() => {})
  }

  if (!group || !story) return null

  return (
    <>
      <div className="fixed inset-0 z-[100]" style={{ background: '#000' }} onClick={onClose}>
        <button onClick={(e) => { e.stopPropagation(); goPrev() }}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white text-3xl z-30 hover:scale-110 transition-all"
          style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', opacity: groupIdx === 0 && storyIdx === 0 ? 0.3 : 1 }}>
          ‹
        </button>

        <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-12"
          onClick={e => e.stopPropagation()}
          onMouseDown={() => setPaused(true)} onMouseUp={() => setPaused(false)} onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)} onTouchEnd={() => setPaused(false)}>
          <div className="relative w-full max-w-[420px] h-full max-h-[840px] rounded-2xl overflow-hidden">
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${group.user.avatarColor}66, ${group.user.avatarColor}33, #0d0d0d)` }} />

            <div className="absolute top-3 left-3 right-3 z-20 flex gap-1">
              {group.stories.map((_, i) => (
                <div key={i} className="flex-1 h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <div className="h-full bg-white" style={{ width: i < storyIdx ? '100%' : i === storyIdx ? `${progress}%` : '0%' }} />
                </div>
              ))}
            </div>

            <button onClick={goToProfile} className="absolute top-7 left-3 z-20 flex items-center gap-2.5 hover:opacity-80">
              <UserAvatar user={group.user as any} size={36} />
              <div className="text-left">
                <p className="text-white text-sm font-semibold">{group.user.name}</p>
                <p className="text-white/50 text-xs">@{(group.user as any).username || group.user.name}</p>
              </div>
            </button>

            <button className="absolute top-5 right-4 z-30 text-white/70 text-2xl" onClick={onClose}>✕</button>

            <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
              {story.imageUrl ? (
                <img src={story.imageUrl} alt={story.title} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <span className="text-[200px]">{story.emoji}</span>
              )}
              <p className="text-white text-2xl font-semibold text-center px-8 relative z-10">{story.title}</p>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-20 p-4" style={{ background: 'linear-gradient(to top,rgba(0,0,0,0.85),transparent)' }}>
              {isOwn ? (
                <button onClick={() => setShowViewers(true)} className="w-full py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                  👁️ {viewers.length} izlendi · görüntüle
                </button>
              ) : (
                <div className="flex gap-2 justify-center">
                  {REACTIONS.map(r => (
                    <button key={r.emoji} title={r.label}
                      onClick={() => reactToStory(r.emoji)}
                      className="w-11 h-11 rounded-full flex items-center justify-center text-2xl hover:scale-125 transition-all"
                      style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                      {r.emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <button onClick={(e) => { e.stopPropagation(); goNext() }}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white text-3xl z-30 hover:scale-110 transition-all"
          style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
          ›
        </button>

        {showViewers && (
          <div className="absolute inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={() => setShowViewers(false)}>
            <div className="w-full max-w-md mx-auto rounded-t-3xl p-6 sm:mb-12 sm:rounded-3xl" style={{ background: '#161616', border: '1px solid #2a2a2a' }} onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold" style={{ color: '#f5f5f5' }}>👁️ Hikayeyi izleyenler · {viewers.length}</h3>
                <button onClick={() => setShowViewers(false)} style={{ color: '#999' }}>✕</button>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {viewers.length === 0 ? (
                  <p className="text-center py-6 text-sm" style={{ color: '#999' }}>Henüz kimse görmedi.</p>
                ) : viewers.map((v: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-xl" style={{ background: '#0d0d0d' }}>
                    <UserAvatar user={{
                      avatar: v.userAvatar, avatarColor: v.userAvatarColor,
                      avatarConfig: v.userAvatarConfig, photoUrl: v.userPhotoUrl, name: v.userName,
                    }} size={36} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm" style={{ color: '#f5f5f5' }}>{v.userName}</p>
                      <p className="text-xs" style={{ color: '#999' }}>@{v.userUsername}</p>
                    </div>
                    {v.reaction && <span className="text-2xl">{v.reaction}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {burst && <ReactionBurst emoji={burst} onDone={() => { setBurst(null); setPaused(false) }} />}
    </>
  )
}

export default function StoriesBar() {
  const [stories, setStories] = useState<Story[]>([])
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set())
  const [viewIdx, setViewIdx] = useState<number | null>(null)

  useEffect(() => {
    // MongoDB'den hikayeler
    fetch('/api/db/stories', { cache: 'no-store' })
      .then(r => r.json())
      .then((d: any) => {
        if (Array.isArray(d) && d.length > 0) setStories(d as Story[])
        else setStories(getAllStories())
      })
      .catch(() => setStories(getAllStories()))
  }, [])

  const grouped: GroupedStory[] = []
  const seenUsers = new Set<string>()
  for (const s of stories) {
    if (seenUsers.has(s.userId)) {
      grouped.find(g => g.userId === s.userId)?.stories.push(s)
    } else {
      seenUsers.add(s.userId)
      grouped.push({ userId: s.userId, user: s.user, stories: [s], allSeen: false })
    }
  }
  const updatedGroups = grouped.map(g => ({ ...g, allSeen: g.stories.every(s => seenIds.has(s.id)) }))

  if (grouped.length === 0) return null

  return (
    <>
      <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Hikayeler</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-none">
          {updatedGroups.map((group, i) => (
            <StoryRing key={group.userId} group={group} onPlay={() => setViewIdx(i)} />
          ))}
        </div>
      </div>

      {viewIdx !== null && <StoryViewer groups={updatedGroups} startGroupIdx={viewIdx} onClose={() => setViewIdx(null)} onSeen={(id) => setSeenIds(p => new Set(p).add(id))} />}
    </>
  )
}
