import { useState } from 'react'
import type { RefObject } from 'react'
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'
import type { Point } from './useMapRuler'

export function useMapInteraction(
  transformRef: RefObject<ReactZoomPanPinchRef | null>,
  currentScale: number
) {
  const [mousePos, setMousePos] = useState<Point | null>(null)

  function getImageCoords(e: React.MouseEvent<HTMLDivElement>): Point {
    const rect = e.currentTarget.getBoundingClientRect()
    const scale = transformRef.current?.state.scale ?? currentScale
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale,
    }
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    setMousePos(getImageCoords(e))
  }

  function handleMouseLeave() {
    setMousePos(null)
  }

  function clearMousePos() {
    setMousePos(null)
  }

  return { mousePos, handleMouseMove, handleMouseLeave, clearMousePos, getImageCoords }
}
