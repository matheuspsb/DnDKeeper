import { useCallback, useState } from 'react'
import { useLatestRef } from '../useLatestRef'
import { useLocalStorageState } from '../useLocalStorageState'
import type { DrawnPath } from '../../types/drawing'

const STORAGE_KEY = 'dndkeeper_map_drawings'
const POINT_DISTANCE_THRESHOLD = 4

export function useMapDrawing() {
  const [isDrawingMode, setIsDrawingMode] = useState(false)
  const [paths, setPaths] = useLocalStorageState<DrawnPath[]>(STORAGE_KEY, [])
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[] | null>(null)
  const [brushColor, setBrushColor] = useState('#D72334')
  const [brushSize, setBrushSize] = useState(4)

  const brushColorRef = useLatestRef(brushColor)
  const brushSizeRef = useLatestRef(brushSize)

  const toggleDrawingMode = useCallback(() => {
    setIsDrawingMode((prev) => !prev)
    setCurrentPath(null)
  }, [])

  const startStroke = useCallback((point: { x: number; y: number }) => {
    setCurrentPath([point])
  }, [])

  const addToStroke = useCallback((point: { x: number; y: number }) => {
    setCurrentPath((prev) => {
      if (!prev) return [point]
      const last = prev[prev.length - 1]
      const dx = point.x - last.x
      const dy = point.y - last.y
      if (dx * dx + dy * dy < POINT_DISTANCE_THRESHOLD * POINT_DISTANCE_THRESHOLD) return prev
      return [...prev, point]
    })
  }, [])

  const endStroke = useCallback(() => {
    setCurrentPath((prev) => {
      if (!prev || prev.length < 2) return null
      const newPath: DrawnPath = {
        id: Date.now().toString(),
        points: prev,
        color: brushColorRef.current,
        width: brushSizeRef.current,
      }
      setPaths((existing) => [...existing, newPath])
      return null
    })
  }, [setPaths])

  const undoLast = useCallback(() => {
    setPaths((prev) => prev.slice(0, -1))
  }, [setPaths])

  const clearDrawings = useCallback(() => {
    setPaths([])
  }, [setPaths])

  return {
    isDrawingMode,
    toggleDrawingMode,
    paths,
    currentPath,
    brushColor,
    setBrushColor,
    brushSize,
    setBrushSize,
    startStroke,
    addToStroke,
    endStroke,
    undoLast,
    clearDrawings,
  }
}
