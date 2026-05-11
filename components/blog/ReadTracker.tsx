'use client'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

export default function ReadTracker({ postId }: { postId: string }) {
  const { data: session } = useSession()
  useEffect(() => {
    if (!session?.user || !postId) return
    fetch('/api/reads', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    }).catch(() => {})
  }, [session, postId])
  return null
}
