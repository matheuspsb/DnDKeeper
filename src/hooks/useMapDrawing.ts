import { useCallback, useRef, useState } from 'react'
import type { DrawnPath } from '../types/drawing'

const STORAGE_KEY = 'dndkeeper_map_drawings'
const POINT_DISTANCE_THRESHOLD = 4

function load(): DrawnPath[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function save(paths: DrawnPath[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(paths))
}

export function useMapDrawing() {
  const [isDrawingMode, setIsDrawingMode] = useState(false)
  const [paths, setPaths] = useState<DrawnPath[]>(() => load())
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[] | null>(null)
  const [brushColor, _setBrushColor] = useState('#D72334')
  const [brushSize, _setBrushSize] = useState(4)

  const brushColorRef = useRef(brushColor)
  const brushSizeRef = useRef(brushSize)

  function setBrushColor(color: string) {
    brushColorRef.current = color
    _setBrushColor(color)
  }

  function setBrushSize(size: number) {
    brushSizeRef.current = size
    _setBrushSize(size)
  }

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
      setPaths((existing) => {
        const next = [...existing, newPath]
        save(next)
        return next
      })
      return null
    })
  }, [])

  const undoLast = useCallback(() => {
    setPaths((prev) => {
      const next = prev.slice(0, -1)
      save(next)
      return next
    })
  }, [])

  const clearDrawings = useCallback(() => {
    setPaths([])
    save([])
  }, [])

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
