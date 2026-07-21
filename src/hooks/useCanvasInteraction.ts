import { useState, useRef, useEffect, useCallback } from 'react'

interface Point {
  x: number
  y: number
}

const MIN_ZOOM        = 0.15
const MAX_ZOOM        = 3
const DRAG_THRESHOLD  = 5  // px — abaixo disso considera clique, não arraste

export function useCanvasInteraction() {
  const [pan, setPan]             = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom]           = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const svgRef                    = useRef<SVGSVGElement>(null)
  const isPanning                 = useRef(false)
  const lastMousePos              = useRef<Point>({ x: 0, y: 0 })
  const dragDistance              = useRef(0)

  // Refs sincronizados com state para uso dentro de event handlers nativos
  const stateRef = useRef({ pan, zoom })
  stateRef.current = { pan, zoom }

  // Zoom centrado no cursor via listener nativo (passive: false para preventDefault)
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    function handleWheel(event: WheelEvent) {
      event.preventDefault()
      const { pan: currentPan, zoom: currentZoom } = stateRef.current
      const scaleFactor = event.deltaY < 0 ? 1.1 : 1 / 1.1
      const newZoom     = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, currentZoom * scaleFactor))
      const rect        = svg.getBoundingClientRect()
      const mouseX      = event.clientX - rect.left
      const mouseY      = event.clientY - rect.top
      // Ponto no espaço do mundo que está sob o cursor deve permanecer fixo
      const worldX = (mouseX - currentPan.x) / currentZoom
      const worldY = (mouseY - currentPan.y) / currentZoom
      setZoom(newZoom)
      setPan({ x: mouseX - worldX * newZoom, y: mouseY - worldY * newZoom })
    }

    svg.addEventListener('wheel', handleWheel, { passive: false })
    return () => svg.removeEventListener('wheel', handleWheel)
  }, [])

  const onMouseDown = useCallback((event: React.MouseEvent) => {
    isPanning.current        = true
    dragDistance.current     = 0
    lastMousePos.current     = { x: event.clientX, y: event.clientY }
    setIsDragging(true)
  }, [])

  const onMouseMove = useCallback((event: React.MouseEvent) => {
    if (!isPanning.current) return
    const dx = event.clientX - lastMousePos.current.x
    const dy = event.clientY - lastMousePos.current.y
    dragDistance.current    += Math.sqrt(dx * dx + dy * dy)
    lastMousePos.current     = { x: event.clientX, y: event.clientY }
    setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
  }, [])

  const onMouseUp = useCallback(() => {
    isPanning.current = false
    setIsDragging(false)
  }, [])

  // Permite ao consumidor distinguir clique de arraste nos elementos filhos
  const wasJustClick = useCallback(() => dragDistance.current < DRAG_THRESHOLD, [])

  // Centraliza o conteúdo no viewport; chamar em useEffect após montar
  const centerContent = useCallback((worldCenterX: number, worldCenterY: number, initialZoom = 0.7) => {
    const svg = svgRef.current
    if (!svg) return
    const { width, height } = svg.getBoundingClientRect()
    setZoom(initialZoom)
    setPan({
      x: width  / 2 - worldCenterX * initialZoom,
      y: height / 2 - worldCenterY * initialZoom,
    })
  }, [])

  return {
    pan,
    zoom,
    isDragging,
    svgRef,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    wasJustClick,
    centerContent,
  }
}
