import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'
import type { Point } from './useMapRuler'

export function useMapInteraction(
  transformRef: RefObject<ReactZoomPanPinchRef | null>,
  currentScale: number,
) {
  const [mousePos, setMousePos] = useState<Point | null>(null)
  const pendingPos = useRef<Point | null>(null)
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    }
  }, [])

  function getImageCoords(e: React.MouseEvent<HTMLDivElement>): Point {
    const rect = e.currentTarget.getBoundingClientRect()
    const scale = transformRef.current?.state.scale ?? currentScale
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale,
    }
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    pendingPos.current = getImageCoords(e)
    if (rafId.current !== null) return
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null
      setMousePos(pendingPos.current)
    })
  }

  function handleMouseLeave() {
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current)
      rafId.current = null
    }
    pendingPos.current = null
    setMousePos(null)
  }

  function clearMousePos() {
    setMousePos(null)
  }

  return { mousePos, handleMouseMove, handleMouseLeave, clearMousePos, getImageCoords }
}
