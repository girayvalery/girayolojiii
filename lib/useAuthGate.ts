'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

export function useAuthGate() {
  const { data: session } = useSession()
  const [promptAction, setPromptAction] = useState<string | null>(null)

  function requireAuth(action: string, callback: () => void) {
    if (session) {
      callback()
    } else {
      setPromptAction(action)
    }
  }

  function closePrompt() {
    setPromptAction(null)
  }

  return { session, requireAuth, promptAction, closePrompt, isAuthenticated: !!session }
}
