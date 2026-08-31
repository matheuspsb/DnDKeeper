import { useCallback, useEffect, useState } from 'react'

interface Fullscreen {
  supported: boolean
  active: boolean
  toggle: () => void
}

export function useFullscreen(): Fullscreen {
  const supported = typeof document !== 'undefined' && !!document.documentElement.requestFullscreen

  const [active, setActive] = useState(
    () => typeof document !== 'undefined' && !!document.fullscreenElement,
  )

  useEffect(() => {
    const onChange = () => setActive(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggle = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {})
    } else {
      document.documentElement.requestFullscreen?.().catch(() => {})
    }
  }, [])

  return { supported, active, toggle }
}
