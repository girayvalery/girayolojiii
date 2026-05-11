'use client'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function EditPostButton({ postId, authorId }: { postId: string; authorId: string }) {
  const { data: session } = useSession()
  const user = session?.user as any
  if (!user) return null
  const isOwner = user.id === authorId
  const isAdmin = user.role === 'ADMIN'
  if (!isOwner && !isAdmin) return null
  return (
    <Link href={`/blog/${postId}/edit`} className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full" style={{ background: 'rgba(29,158,117,0.15)', color: '#1D9E75' }}>
      ✏️ Düzenle
    </Link>
  )
}
