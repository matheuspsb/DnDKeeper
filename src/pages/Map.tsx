import { useCallback, useEffect, useRef, useState } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'
import GalleryEmpty from '../components/molecules/gallery/GalleryEmpty'
import MapHintBar from '../components/molecules/MapHintBar'
import MapToolbar from '../components/organisms/map/MapToolbar'
import MapSvgOverlay from '../components/organisms/map/MapSvgOverlay'
import MapCalibrationModal from '../components/organisms/map/MapCalibrationModal'
import { useMapRuler } from '../hooks/useMapRuler'
import { useMapInteraction } from '../hooks/useMapInteraction'
import { useMapDrawing } from '../hooks/useMapDrawing'
import { toImageUrl } from '../services/googleDrive'

const MAP_FILE_ID = import.meta.env.VITE_GOOGLE_DRIVE_MAP_FILE_ID as string
const MAP_SIZE = 'w6000'

function Mapa() {
  const containerRef = useRef<HTMLDivElement>(null)
  const transformRef = useRef<ReactZoomPanPinchRef>(null)
  const [minScale, setMinScale] = useState(0.01)
  const [currentScale, setCurrentScale] = useState(1)
  const [imageReady, setImageReady] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imgSize, setImgSize] = useState<{ width: number; height: number } | null>(null)

  const ruler = useMapRuler()
  const interaction = useMapInteraction(transformRef, currentScale)
  const drawing = useMapDrawing()

  function handleImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget
    setImgSize({ width: img.naturalWidth, height: img.naturalHeight })
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
  }, [imgSize])

  function handleMapClick(e: React.MouseEvent<HTMLDivElement>) {
    if (drawing.isDrawingMode) return
    if (ruler.mode === 'idle') return
    ruler.addPoint(interaction.getImageCoords(e))
    interaction.clearMousePos()
  }

  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (!drawing.isDrawingMode) return
    drawing.startStroke(interaction.getImageCoords(e))
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    interaction.handleMouseMove(e)
    if (!drawing.isDrawingMode || e.buttons !== 1) return
    drawing.addToStroke(interaction.getImageCoords(e))
  }

  function handleMouseUp() {
    if (!drawing.isDrawingMode) return
    drawing.endStroke()
  }

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

  function getCursor() {
    if (drawing.isDrawingMode) return 'crosshair'
    if (inRulerMode) return 'crosshair'
    return 'grab'
  }

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
      <div ref={containerRef} className="flex-1 overflow-hidden relative bg-black-500">
        {!imageReady && !imageError && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 pointer-events-none">
            <div className="w-10 h-10 rounded-full border-2 border-black-100 border-t-red-100 animate-spin" />
            <span className="text-white-300 text-sm">Carregando mapa...</span>
          </div>
        )}
        {imageError && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 pointer-events-none">
            <span className="text-white-300 text-sm">
              Erro ao carregar o mapa. Verifique o VITE_GOOGLE_DRIVE_MAP_FILE_ID e reinicie o
              servidor.
            </span>
          </div>
        )}

        <MapHintBar mode={ruler.mode} pointCount={ruler.points.length} />
        <MapToolbar
          rulerMode={ruler.mode}
          isCalibrated={ruler.pixelsPerMile !== null}
          onCalibrateToggle={handleCalibrateToggle}
          onMeasureToggle={handleMeasureToggle}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleReset}
          isDrawingMode={drawing.isDrawingMode}
          onDrawingToggle={drawing.toggleDrawingMode}
          brushColor={drawing.brushColor}
          onBrushColorChange={drawing.setBrushColor}
          brushSize={drawing.brushSize}
          onBrushSizeChange={drawing.setBrushSize}
          onUndo={drawing.undoLast}
          onClearDrawings={drawing.clearDrawings}
        />

        <TransformWrapper
          ref={transformRef}
          initialScale={0.01}
          minScale={minScale}
          maxScale={10}
          limitToBounds={true}
          wheel={{ step: 0.001 }}
          doubleClick={{ disabled: true }}
          panning={{ disabled: drawing.isDrawingMode }}
          onTransform={(ref) => setCurrentScale(ref.state.scale)}
        >
          <TransformComponent
            wrapperStyle={{ width: '100%', height: '100%' }}
            contentStyle={{ cursor: getCursor() }}
          >
            <div
              style={{ position: 'relative', display: 'inline-block' }}
              onClick={handleMapClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={interaction.handleMouseLeave}
            >
              <img
                src={toImageUrl(MAP_FILE_ID, MAP_SIZE)}
                alt="Mapa"
                draggable={false}
                onLoad={handleImageLoad}
                onError={() => setImageError(true)}
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
                  drawnPaths={drawing.paths}
                  currentDrawPath={drawing.currentPath}
                  currentDrawColor={drawing.brushColor}
                  currentDrawWidth={drawing.brushSize}
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
