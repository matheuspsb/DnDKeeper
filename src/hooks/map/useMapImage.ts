import { useEffect, useState } from 'react'
import type { RefObject } from 'react'
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'

export function useMapImage(
  containerRef: RefObject<HTMLDivElement | null>,
  transformRef: RefObject<ReactZoomPanPinchRef | null>,
) {
  const [minScale, setMinScale] = useState(0.01)
  const [currentScale, setCurrentScale] = useState(1)
  const [imageReady, setImageReady] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imgSize, setImgSize] = useState<{ width: number; height: number } | null>(null)

  function handleImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget
    setImgSize({ width: img.naturalWidth, height: img.naturalHeight })
  }

  function handleImageError() {
    setImageError(true)
  }

  useEffect(() => {
    if (!imgSize || !containerRef.current || !transformRef.current) return
    const scale = Math.max(
      containerRef.current.clientWidth / imgSize.width,
      containerRef.current.clientHeight / imgSize.height,
    )
    setMinScale(scale)
    setCurrentScale(scale)
    transformRef.current.centerView(scale, 0)
    setImageReady(true)
  }, [imgSize, containerRef, transformRef])

  return {
    minScale,
    currentScale,
    setCurrentScale,
    imageReady,
    imageError,
    imgSize,
    handleImageLoad,
    handleImageError,
  }
}
