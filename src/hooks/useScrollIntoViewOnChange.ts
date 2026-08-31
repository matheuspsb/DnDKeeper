import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../utils/motion'

export function useScrollIntoViewOnChange<T extends Element>(key: unknown) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'center',
    })
  }, [key])

  return ref
}
