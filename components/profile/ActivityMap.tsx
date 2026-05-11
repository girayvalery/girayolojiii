'use client'

const COLORS = ['#1f1f1f', '#0F6E56', '#1D9E75', '#3CC295', '#9FE1CB']
const MONTHS = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara']
const DAYS = ['Pzt','Çar','Cum']

export default function ActivityMap({ data }: { data: { date: string; count: number; intensity: number }[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>📊 Aktivite</h3>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Henüz aktivite verisi yok.</p>
      </div>
    )
  }

  // 53 hafta x 7 gün grid
  const weeks: typeof data[] = []
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7))
  }

  const totalActivity = data.reduce((s, d) => s + d.count, 0)

  return (
    <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold" style={{ color: 'var(--text)' }}>📊 Aktivite</h3>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Son bir yıl · {totalActivity} aktivite</p>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex gap-[3px] min-w-fit">
          <div className="flex flex-col gap-[3px] mr-2 mt-4">
            {DAYS.map(d => <div key={d} className="text-[9px] h-[10px]" style={{ color: 'var(--text-muted)' }}>{d}</div>)}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((d, di) => (
                <div key={di} className="w-[10px] h-[10px] rounded-[2px]"
                  style={{ background: COLORS[d.intensity] }}
                  title={`${d.date}: ${d.count} aktivite`} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 mt-3">
        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Az</span>
        {COLORS.map((c, i) => <div key={i} className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />)}
        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Çok</span>
      </div>
    </div>
  )
}
