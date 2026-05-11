'use client'
import { useEffect } from 'react'

export function useBodyLock(locked: boolean) {
  useEffect(() => {
    if (locked) {
      document.body.classList.add('modal-open')
      document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`
    } else {
      document.body.classList.remove('modal-open')
      document.body.style.paddingRight = ''
    }
    return () => {
      document.body.classList.remove('modal-open')
      document.body.style.paddingRight = ''
    }
  }, [locked])
}
