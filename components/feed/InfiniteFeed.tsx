'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { getPublished } from '@/lib/data'
import PostCard from '@/components/PostCard'

export default function InfiniteFeed() {
  const allPosts = getPublished()
  const [feed, setFeed] = useState(() => allPosts.slice(0, 6))
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return
    setLoading(true)
    setTimeout(() => {
      const next = allPosts.slice(0, feed.length + 3)
      if (next.length === feed.length) { setHasMore(false); setLoading(false); return }
      setFeed(next)
      setLoading(false)
    }, 600)
  }, [loading, hasMore, feed.length, allPosts])

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) loadMore()
    }, { threshold: 0.1 })
    if (sentinelRef.current) obs.observe(sentinelRef.current)
    return () => obs.disconnect()
  }, [loadMore])

  return (
    <div className="space-y-4">
      {feed.map(post => <PostCard key={post.id} post={post} size="md" />)}
      {loading && [1,2].map(i => (
        <div key={i} className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="h-32 skeleton" />
          <div className="p-4 space-y-2">
            <div className="h-3 skeleton rounded w-1/4" />
            <div className="h-4 skeleton rounded w-4/5" />
          </div>
        </div>
      ))}
      {hasMore && <div ref={sentinelRef} className="h-4" />}
      {!hasMore && (
        <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
          <p className="text-sm">✨ Tüm içerikleri gördün!</p>
        </div>
      )}
    </div>
  )
}
