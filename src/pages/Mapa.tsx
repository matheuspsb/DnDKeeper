import { useRef, useState } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'
import GalleryEmpty from '../components/molecules/GalleryEmpty'

const MAP_FILE_ID = import.meta.env.VITE_GOOGLE_DRIVE_MAP_FILE_ID as string

function toMapUrl(id: string): string {
  const base = import.meta.env.DEV
    ? '/drive-img'
    : 'https://drive.google.com/thumbnail'
  return `${base}?id=${id}&sz=w6000`
}

function Mapa() {
  const containerRef = useRef<HTMLDivElement>(null)
  const transformRef = useRef<ReactZoomPanPinchRef>(null)
  const [minScale, setMinScale] = useState(0.01)
  const [imageReady, setImageReady] = useState(false)

  function handleImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget
    const container = containerRef.current
    const transform = transformRef.current
    if (!container || !transform) return

    const scale = Math.min(
      container.clientWidth / img.naturalWidth,
      container.clientHeight / img.naturalHeight
    )
    setMinScale(scale)
    transform.centerView(scale, 0)
    setImageReady(true)
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
      <div className="p-8 pb-4 shrink-0">
        <h2 className="text-white-100 text-3xl font-bold">Mapa</h2>
      </div>

      <div ref={containerRef} className="flex-1 overflow-hidden relative bg-black-500">
        <TransformWrapper
          ref={transformRef}
          initialScale={0.01}
          minScale={minScale}
          maxScale={10}
          limitToBounds={true}
          wheel={{ step: 0.001 }}
          doubleClick={{ disabled: true }}
        >
          {({ zoomIn, zoomOut }) => (
            <>
              <div className="absolute bottom-4 right-4 z-10 flex gap-2">
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
                contentStyle={{ cursor: 'grab' }}
              >
                <img
                  src={toMapUrl(MAP_FILE_ID)}
                  alt="Mapa"
                  draggable={false}
                  onLoad={handleImageLoad}
                  className={`select-none max-w-none transition-opacity duration-500 ${imageReady ? 'opacity-100' : 'opacity-0'}`}
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
    </div>
  )
}

export default Mapa
