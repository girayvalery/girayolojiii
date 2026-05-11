'use client'
import { useState } from 'react'
import { type Quest } from '@/lib/levels'

type Props = {
  level: number
  currentQuest: Quest | null
  nextQuest: Quest | null
  progress: number
  stats: any
  completedQuests: Quest[]
  allQuests: Quest[]
  isOwn: boolean
}

export default function LevelCard({ level, currentQuest, nextQuest, progress, stats, completedQuests, allQuests, isOwn }: Props) {
  const [showAll, setShowAll] = useState(false)

  if (!currentQuest) return null

  const upcomingQuests = allQuests.filter(q => q.level > level).slice(0, showAll ? 100 : 3)
  const lockedQuests = allQuests.filter(q => q.level > level)

  return (
    <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <span>🏆</span> Seviye {level} <span style={{ color: currentQuest.color }}>· {currentQuest.title}</span>
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{completedQuests.length} görev tamamlandı · {lockedQuests.length} kaldı</p>
        </div>
        <div className="text-4xl">{currentQuest.icon}</div>
      </div>

      {nextQuest && (
        <div className="rounded-xl p-4 mb-4" style={{ background: 'var(--bg-subtle)' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Sıradaki: <span style={{ color: nextQuest.color }}>{nextQuest.title}</span></p>
            <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
              {(stats[nextQuest.condition] || 0)} / {nextQuest.target}
            </span>
          </div>
          <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{nextQuest.description}</p>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: nextQuest.color }} />
          </div>
        </div>
      )}

      {isOwn && upcomingQuests.length > 0 && (
        <>
          <p className="text-xs font-semibold uppercase tracking-wider mt-4 mb-2" style={{ color: 'var(--text-muted)' }}>Yaklaşan Görevler</p>
          <div className="space-y-2">
            {upcomingQuests.map(q => (
              <div key={q.level} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'var(--bg-subtle)', opacity: 0.7 }}>
                <span className="text-xl">{q.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Lv {q.level} · {q.title}</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{q.description}</p>
                </div>
                <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{stats[q.condition] || 0}/{q.target}</span>
              </div>
            ))}
          </div>
          {lockedQuests.length > 3 && (
            <button onClick={() => setShowAll(p => !p)} className="text-xs mt-2" style={{ color: '#1D9E75' }}>
              {showAll ? 'Daha az göster' : `+${lockedQuests.length - 3} görev daha gör`}
            </button>
          )}
        </>
      )}

      {completedQuests.length > 0 && (
        <>
          <p className="text-xs font-semibold uppercase tracking-wider mt-4 mb-2" style={{ color: 'var(--text-muted)' }}>Tamamlanan ({completedQuests.length})</p>
          <div className="flex flex-wrap gap-1.5">
            {completedQuests.map(q => (
              <div key={q.level} className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium"
                style={{ background: `${q.color}18`, color: q.color, border: `1px solid ${q.color}33` }} title={q.description}>
                <span>{q.icon}</span><span>{q.title}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
