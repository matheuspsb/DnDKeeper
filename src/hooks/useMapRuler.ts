import { useCallback, useState } from 'react'

export type RulerMode = 'idle' | 'calibrating' | 'measuring'
export type Point = { x: number; y: number }

const CALIBRATION_KEY = 'dndkeeper_map_calibration'

function pixelDist(from: Point, to: Point): number {
  return Math.sqrt((to.x - from.x) ** 2 + (to.y - from.y) ** 2)
}

function formatMiles(miles: number): string {
  if (miles < 1) return `${(miles * 5280).toFixed(0)} ft`
  if (miles < 10) return `${miles.toFixed(1)} mi`
  return `${Math.round(miles)} mi`
}

export function useMapRuler() {
  const [mode, setMode] = useState<RulerMode>('idle')
  const [points, setPoints] = useState<Point[]>([])
  const [pixelsPerMile, setPixelsPerMile] = useState<number | null>(() => {
    const saved = localStorage.getItem(CALIBRATION_KEY)
    return saved ? Number(saved) : null
  })
  const [showCalibInput, setShowCalibInput] = useState(false)
  const [calibMiles, setCalibMiles] = useState('')

  const enterCalibrate = useCallback(() => {
    setMode('calibrating')
    setPoints([])
    setShowCalibInput(false)
  }, [])

  const enterMeasure = useCallback(() => {
    setMode('measuring')
    setPoints([])
  }, [])

  const exitRuler = useCallback(() => {
    setMode('idle')
    setPoints([])
    setShowCalibInput(false)
    setCalibMiles('')
  }, [])

  const cancelCalibration = useCallback(() => {
    setShowCalibInput(false)
    setCalibMiles('')
    setPoints([])
    setMode('idle')
  }, [])

  function addPoint(point: Point) {
    if (mode === 'calibrating') {
      if (points.length === 0) {
        setPoints([point])
      } else if (points.length === 1) {
        setPoints([points[0], point])
        setShowCalibInput(true)
      }
    } else if (mode === 'measuring') {
      if (points.length < 2) {
        setPoints((prev) => [...prev, point])
      } else {
        setPoints([point])
      }
    }
  }

  function confirmCalibration() {
    const miles = parseFloat(calibMiles)
    if (isNaN(miles) || miles <= 0 || points.length < 2) return
    const newPixelsPerMile = pixelDist(points[0], points[1]) / miles
    setPixelsPerMile(newPixelsPerMile)
    localStorage.setItem(CALIBRATION_KEY, String(newPixelsPerMile))
    setShowCalibInput(false)
    setCalibMiles('')
    setPoints([])
    setMode('idle')
  }

  function getDistance(): string | null {
    if (points.length < 2 || pixelsPerMile === null) return null
    return formatMiles(pixelDist(points[0], points[1]) / pixelsPerMile)
  }

  function getPreviewDistance(to: Point): string | null {
    if (pixelsPerMile === null || mode !== 'measuring' || points.length !== 1) return null
    return formatMiles(pixelDist(points[0], to) / pixelsPerMile)
  }

  function getMidpoint(): Point | null {
    if (points.length < 2) return null
    return {
      x: (points[0].x + points[1].x) / 2,
      y: (points[0].y + points[1].y) / 2,
    }
  }

  return {
    mode,
    points,
    pixelsPerMile,
    showCalibInput,
    calibMiles,
    setCalibMiles,
    enterCalibrate,
    enterMeasure,
    exitRuler,
    addPoint,
    confirmCalibration,
    cancelCalibration,
    getDistance,
    getPreviewDistance,
    getMidpoint,
  }
}
