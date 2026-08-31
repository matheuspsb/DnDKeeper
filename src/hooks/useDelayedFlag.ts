import { useEffect, useState } from 'react'

export function useDelayedFlag(active: boolean, delayMs: number): boolean {
  const [flag, setFlag] = useState(false)

  useEffect(() => {
    if (!active) {
      setFlag(false)
      return
    }
    const id = setTimeout(() => setFlag(true), delayMs)
    return () => clearTimeout(id)
  }, [active, delayMs])

  return flag
}
