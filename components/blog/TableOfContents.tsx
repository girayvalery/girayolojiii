'use client'
import { useState, useEffect } from 'react'

export default function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const regex = /^##\s+(.+)$/gm
    const matches = [...content.matchAll(regex)]
    const list = matches.map(m => ({
      id: m[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      text: m[1],
    }))
    setHeadings(list)
  }, [content])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id) }),
      { rootMargin: '-100px 0px -70% 0px' }
    )
    headings.forEach(h => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <div className="rounded-xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>📋 İçindekiler</p>
      <ul className="space-y-1.5 text-sm">
        {headings.map((h, i) => (
          <li key={i}>
            <a href={`#${h.id}`}
              className="block py-1 pl-3 transition-all"
              style={{
                color: activeId === h.id ? '#1D9E75' : 'var(--text-muted)',
                borderLeft: `2px solid ${activeId === h.id ? '#1D9E75' : 'transparent'}`,
                fontWeight: activeId === h.id ? '500' : '400',
              }}>
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
