'use client'
import { useRef } from 'react'
import PostCard from '@/components/PostCard'
import type { Post } from '@/lib/data'

export default function FeaturedCarousel({ posts }: { posts: Post[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  function scroll(dir: 'left'|'right') {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -el.clientWidth * 0.85 : el.clientWidth * 0.85, behavior: 'smooth' })
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

      {posts.length > 2 && (
        <>
          <button onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-xl z-10 hover:scale-110 transition-all"
            style={{ background: 'rgba(0,0,0,0.7)', color: '#fff', backdropFilter: 'blur(8px)' }}>
            ‹
          </button>
          <button onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-xl z-10 hover:scale-110 transition-all"
            style={{ background: 'rgba(0,0,0,0.7)', color: '#fff', backdropFilter: 'blur(8px)' }}>
            ›
          </button>
        </>
      )}
    </div>
  )
}
