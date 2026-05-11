'use client'
import { useState, useRef, useEffect } from 'react'
import PostCard from '@/components/PostCard'
import type { Post } from '@/lib/data'

export default function FeaturedCarousel({ posts }: { posts: Post[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  function update() {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 10)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  useEffect(() => {
    update()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', update)
    return () => el.removeEventListener('scroll', update)
  }, [])

  function scroll(dir: 'left'|'right') {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -el.clientWidth * 0.7 : el.clientWidth * 0.7, behavior: 'smooth' })
  }

  if (posts.length === 0) return null

  return (
    <div className="relative">
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth snap-x snap-mandatory">
        {posts.map(p => (
          <div key={p.id} className="snap-start shrink-0 w-[85%] sm:w-[48%] lg:w-[32%]">
            <PostCard post={p} size="lg" />
          </div>
        ))}
      </div>

      {canLeft && (
        <button onClick={() => scroll('left')}
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full items-center justify-center text-xl shadow-lg z-10 hover:scale-110 transition-all"
          style={{ background: 'var(--bg-card)', color: 'var(--text)', border: '1px solid var(--border)' }}>
          ‹
        </button>
      )}
      {canRight && (
        <button onClick={() => scroll('right')}
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 rounded-full items-center justify-center text-xl shadow-lg z-10 hover:scale-110 transition-all"
          style={{ background: 'var(--bg-card)', color: 'var(--text)', border: '1px solid var(--border)' }}>
          ›
        </button>
      )}
    </div>
  )
}
