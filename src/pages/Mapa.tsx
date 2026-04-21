import { useRef, useState } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'
import GalleryEmpty from '../components/molecules/GalleryEmpty'
import { useMapRuler } from '../hooks/useMapRuler'
import { useMapInteraction } from '../hooks/useMapInteraction'
import { toImageUrl } from '../services/googleDrive'

const MAP_FILE_ID = import.meta.env.VITE_GOOGLE_DRIVE_MAP_FILE_ID as string
const MAP_SIZE = 'w6000'

const SVG_MARKER_PX = 7
const SVG_STROKE_PX = 2
const SVG_DASH_PX = 16
const SVG_GAP_PX = 8
const SVG_FONT_PX = 26

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
      container.clientHeight / img.naturalHeight
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

  // SVG sizes scale inversely with zoom to stay visually constant
  const markerRadius = SVG_MARKER_PX / currentScale
  const strokeWidth = SVG_STROKE_PX / currentScale
  const strokeDasharray = `${SVG_DASH_PX / currentScale} ${SVG_GAP_PX / currentScale}`
  const fontSize = SVG_FONT_PX / currentScale

  const rulerColor = ruler.mode === 'calibrating' ? '#ECC83B' : '#D72334'
  const rulerColorFill = ruler.mode === 'calibrating' ? '#ECC83B33' : '#D7233433'

  const distance = ruler.getDistance()
  const midpoint = ruler.getMidpoint()
  const previewLabel = interaction.mousePos !== null
    ? ruler.getPreviewDistance(interaction.mousePos)
    : null

  const inRulerMode = ruler.mode !== 'idle'
  const showPreviewLine = ruler.points.length === 1 && interaction.mousePos !== null

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

        {inRulerMode && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-full bg-black-300/90 border border-black-100 text-white-300 text-xs pointer-events-none">
            {ruler.mode === 'calibrating' && ruler.points.length === 0 && 'Clique no ponto inicial da distância de referência'}
            {ruler.mode === 'calibrating' && ruler.points.length === 1 && 'Clique no ponto final da distância de referência'}
            {ruler.mode === 'measuring' && ruler.points.length === 0 && 'Clique para marcar o ponto inicial'}
            {ruler.mode === 'measuring' && ruler.points.length === 1 && 'Clique para marcar o ponto final'}
            {ruler.mode === 'measuring' && ruler.points.length === 2 && 'Clique em qualquer lugar para medir nova distância'}
          </div>
        )}

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
          {({ zoomIn, zoomOut }) => (
            <>
              <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
                <div className="flex items-center gap-1.5 pr-2 border-r border-black-100">
                  {ruler.pixelsPerMile !== null && (
                    <span className="text-xs text-white-300 mr-1">Calibrado ✓</span>
                  )}
                  <button
                    onClick={ruler.mode === 'calibrating' ? ruler.exitRuler : ruler.enterCalibrate}
                    title="Calibrar régua"
                    className={`px-3 h-8 rounded border text-xs transition-colors cursor-pointer ${
                      ruler.mode === 'calibrating'
                        ? 'bg-yellow border-yellow text-black-500 font-medium'
                        : 'bg-black-300 border-black-100 text-white-300 hover:bg-black-200 hover:text-white-100'
                    }`}
                  >
                    Calibrar
                  </button>
                  <button
                    onClick={ruler.mode === 'measuring' ? ruler.exitRuler : ruler.enterMeasure}
                    title="Medir distância"
                    disabled={ruler.pixelsPerMile === null}
                    className={`px-3 h-8 rounded border text-xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                      ruler.mode === 'measuring'
                        ? 'bg-red-100 border-red-100 text-white-100 font-medium'
                        : 'bg-black-300 border-black-100 text-white-300 hover:bg-black-200 hover:text-white-100'
                    }`}
                  >
                    Régua
                  </button>
                </div>

                <button
                  onClick={() => zoomOut()}
                  className="w-8 h-8 rounded bg-black-300 border border-black-100 text-white-100 text-lg leading-none hover:bg-black-200 transition-colors cursor-pointer"
                >
                  −
                </button>
                <button
                  onClick={() => zoomIn()}
                  className="w-8 h-8 rounded bg-black-300 border border-black-100 text-white-100 text-lg leading-none hover:bg-black-200 transition-colors cursor-pointer"
                >
                  +
                </button>
                <button
                  onClick={() => transformRef.current?.centerView(minScale, 200)}
                  className="px-3 h-8 rounded bg-black-300 border border-black-100 text-white-300 text-xs hover:bg-black-200 hover:text-white-100 transition-colors cursor-pointer"
                >
                  Reset
                </button>
              </div>

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
                    <svg
                      width={imgSize.width}
                      height={imgSize.height}
                      viewBox={`0 0 ${imgSize.width} ${imgSize.height}`}
                      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', userSelect: 'none' }}
                    >
                      {showPreviewLine && (
                        <>
                          <line
                            x1={ruler.points[0].x} y1={ruler.points[0].y}
                            x2={interaction.mousePos!.x} y2={interaction.mousePos!.y}
                            stroke={rulerColor}
                            strokeWidth={strokeWidth * 2}
                            strokeDasharray={strokeDasharray}
                            strokeLinecap="round"
                            opacity={0.6}
                          />
                          {previewLabel && (
                            <text
                              x={(ruler.points[0].x + interaction.mousePos!.x) / 2}
                              y={(ruler.points[0].y + interaction.mousePos!.y) / 2 - markerRadius * 2.5}
                              fontSize={fontSize}
                              textAnchor="middle"
                              dominantBaseline="auto"
                              fill="white"
                              stroke="#17181C"
                              strokeWidth={fontSize * 0.18}
                              paintOrder="stroke"
                              fontWeight="600"
                              opacity={0.7}
                            >
                              {previewLabel}
                            </text>
                          )}
                        </>
                      )}

                      {ruler.points.length === 2 && (
                        <line
                          x1={ruler.points[0].x} y1={ruler.points[0].y}
                          x2={ruler.points[1].x} y2={ruler.points[1].y}
                          stroke={rulerColor}
                          strokeWidth={strokeWidth * 2}
                          strokeDasharray={strokeDasharray}
                          strokeLinecap="round"
                        />
                      )}

                      {ruler.points.map((point, index) => (
                        <g key={index}>
                          <circle cx={point.x} cy={point.y} r={markerRadius * 1.8} fill={rulerColorFill} />
                          <circle cx={point.x} cy={point.y} r={markerRadius} fill={rulerColor} stroke="white" strokeWidth={strokeWidth} />
                        </g>
                      ))}

                      {distance && midpoint && (
                        <text
                          x={midpoint.x}
                          y={midpoint.y - markerRadius * 2.5}
                          fontSize={fontSize}
                          textAnchor="middle"
                          dominantBaseline="auto"
                          fill="white"
                          stroke="#17181C"
                          strokeWidth={fontSize * 0.18}
                          paintOrder="stroke"
                          fontWeight="600"
                        >
                          {distance}
                        </text>
                      )}
                    </svg>
                  )}
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>

        {ruler.showCalibInput && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black-500/70">
            <div className="bg-black-300 border border-black-100 rounded-xl p-6 flex flex-col gap-4 w-80">
              <div>
                <h3 className="text-white-100 font-semibold text-base">Calibrar régua</h3>
                <p className="text-white-300 text-sm mt-1">
                  Quantas milhas corresponde à distância marcada no mapa?
                </p>
              </div>
              <input
                type="number"
                min="0.1"
                step="any"
                value={ruler.calibMiles}
                onChange={e => ruler.setCalibMiles(e.target.value)}
                placeholder="Ex: 50"
                autoFocus
                onKeyDown={e => {
                  if (e.key === 'Enter') ruler.confirmCalibration()
                  if (e.key === 'Escape') ruler.cancelCalibration()
                }}
                className="bg-black-400 border border-black-100 rounded-lg px-3 py-2 text-white-100 text-sm outline-none focus:border-red-100 transition-colors"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={ruler.cancelCalibration}
                  className="px-4 py-1.5 rounded border border-black-100 text-white-300 text-sm hover:text-white-100 hover:bg-black-200 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={ruler.confirmCalibration}
                  disabled={!ruler.calibMiles || Number(ruler.calibMiles) <= 0}
                  className="px-4 py-1.5 rounded bg-red-100 text-white-100 text-sm font-medium hover:bg-red-200 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Mapa
