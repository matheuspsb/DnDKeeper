import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../utils/motion'

interface Options {
  durationMs: number
  enabled?: boolean
}

export function useValueChangePulse<T>(value: T, { durationMs, enabled = true }: Options): boolean {
  const previous = useRef(value)
  const [pulsing, setPulsing] = useState(false)

  useEffect(() => {
    if (previous.current === value) return
    previous.current = value
    if (!enabled || prefersReducedMotion()) return

    setPulsing(true)
    const id = setTimeout(() => setPulsing(false), durationMs)
    return () => clearTimeout(id)
  }, [value, enabled, durationMs])

  return pulsing
}
