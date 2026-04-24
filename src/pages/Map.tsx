import { useCallback, useRef, useState } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'
import GalleryEmpty from '../components/molecules/gallery/GalleryEmpty'
import MapHintBar from '../components/molecules/MapHintBar'
import MapToolbar from '../components/organisms/map/MapToolbar'
import MapSvgOverlay from '../components/organisms/map/MapSvgOverlay'
import MapCalibrationModal from '../components/organisms/map/MapCalibrationModal'
import { useMapRuler } from '../hooks/useMapRuler'
import { useMapInteraction } from '../hooks/useMapInteraction'
import { toImageUrl } from '../services/googleDrive'

const MAP_FILE_ID = import.meta.env.VITE_GOOGLE_DRIVE_MAP_FILE_ID as string
const MAP_SIZE = 'w6000'

function Mapa() {
  const containerRef = useRef<HTMLDivElement>(null)
  const transformRef = useRef<ReactZoomPanPinchRef>(null)
  const [minScale, setMinScale] = useState(0.01)
  const [currentScale, setCurrentScale] = useState(0.01)
  const [imageReady, setImageReady] = useState(false)
  const [imgSize, setImgSize] = useState<{ width: number; height: number } | null>(null)

  const ruler = useMapRuler()
  const interaction = useMapInteraction(transformRef, currentScale)

  function handleImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget
    const container = containerRef.current
    const transform = transformRef.current
    if (!container || !transform) return

    setImgSize({ width: img.naturalWidth, height: img.naturalHeight })

    const scale = Math.min(
      container.clientWidth / img.naturalWidth,
      container.clientHeight / img.naturalHeight,
    )
    setMinScale(scale)
    setCurrentScale(scale)
    transform.centerView(scale, 0)
    setImageReady(true)
  }

  function handleMapClick(e: React.MouseEvent<HTMLDivElement>) {
    if (ruler.mode === 'idle') return
    ruler.addPoint(interaction.getImageCoords(e))
    interaction.clearMousePos()
  }

  // Stable callbacks — props won't change between scrolls, so MapToolbar stays frozen
  const handleCalibrateToggle = useCallback(() => {
    if (ruler.mode === 'calibrating') ruler.exitRuler()
    else ruler.enterCalibrate()
  }, [ruler.mode, ruler.exitRuler, ruler.enterCalibrate])

  const handleMeasureToggle = useCallback(() => {
    if (ruler.mode === 'measuring') ruler.exitRuler()
    else ruler.enterMeasure()
  }, [ruler.mode, ruler.exitRuler, ruler.enterMeasure])

  const handleZoomIn = useCallback(() => transformRef.current?.zoomIn(), [])
  const handleZoomOut = useCallback(() => transformRef.current?.zoomOut(), [])
  const handleReset = useCallback(() => {
    transformRef.current?.centerView(minScale, 200)
    ruler.exitRuler()
  }, [minScale, ruler.exitRuler])

  const previewLabel =
    interaction.mousePos !== null ? ruler.getPreviewDistance(interaction.mousePos) : null

  const showPreviewLine = ruler.points.length === 1 && interaction.mousePos !== null
  const inRulerMode = ruler.mode !== 'idle'

  if (!MAP_FILE_ID) {
    return (
      <div className="flex flex-col gap-6 p-8">
        <h2 className="text-white-100 text-3xl font-bold">Mapa</h2>
        <div className="flex-1 flex items-center justify-center mt-24">
          <GalleryEmpty message="Configure VITE_GOOGLE_DRIVE_MAP_FILE_ID no .env.local para exibir o mapa." />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-8 pb-4 shrink-0">
        <h2 className="text-white-100 text-3xl font-bold">Mapa</h2>
      </div>

      <div ref={containerRef} className="flex-1 overflow-hidden relative bg-black-500">
        {!imageReady && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 pointer-events-none">
            <div className="w-10 h-10 rounded-full border-2 border-black-100 border-t-red-100 animate-spin" />
            <span className="text-white-300 text-sm">Carregando mapa...</span>
          </div>
        )}

        {/* Outside TransformWrapper — never re-renders from transform changes */}
        <MapHintBar mode={ruler.mode} pointCount={ruler.points.length} />
        <MapToolbar
          rulerMode={ruler.mode}
          isCalibrated={ruler.pixelsPerMile !== null}
          onCalibrateToggle={handleCalibrateToggle}
          onMeasureToggle={handleMeasureToggle}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleReset}
        />

        <TransformWrapper
          ref={transformRef}
          initialScale={0.01}
          minScale={minScale}
          maxScale={10}
          limitToBounds={true}
          wheel={{ step: 0.001 }}
          doubleClick={{ disabled: true }}
          onTransform={(ref) => setCurrentScale(ref.state.scale)}
        >
          <TransformComponent
            wrapperStyle={{ width: '100%', height: '100%' }}
            contentStyle={{ cursor: inRulerMode ? 'crosshair' : 'grab' }}
          >
            <div
              style={{ position: 'relative', display: 'inline-block' }}
              onClick={handleMapClick}
              onMouseMove={interaction.handleMouseMove}
              onMouseLeave={interaction.handleMouseLeave}
            >
              <img
                src={toImageUrl(MAP_FILE_ID, MAP_SIZE)}
                alt="Mapa"
                draggable={false}
                onLoad={handleImageLoad}
                style={{ display: 'block' }}
                className={`select-none max-w-none transition-opacity duration-500 ${imageReady ? 'opacity-100' : 'opacity-0'}`}
              />

              {imgSize && (
                <MapSvgOverlay
                  imgSize={imgSize}
                  points={ruler.points}
                  mousePos={interaction.mousePos}
                  mode={ruler.mode}
                  distance={ruler.getDistance()}
                  midpoint={ruler.getMidpoint()}
                  previewLabel={previewLabel}
                  showPreviewLine={showPreviewLine}
                  currentScale={currentScale}
                />
              )}
            </div>
          </TransformComponent>
        </TransformWrapper>

        {ruler.showCalibInput && (
          <MapCalibrationModal
            calibMiles={ruler.calibMiles}
            onCalibMilesChange={ruler.setCalibMiles}
            onConfirm={ruler.confirmCalibration}
            onCancel={ruler.cancelCalibration}
          />
        )}
      </div>
    </div>
  )
}

export default Mapa
