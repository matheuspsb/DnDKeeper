import { memo } from 'react'
import type { RulerMode } from '../../hooks/useMapRuler'

type MapHintBarProps = {
  mode: RulerMode
  pointCount: number
}

const HINTS: Record<string, string> = {
  'calibrating-0': 'Clique no ponto inicial da distância de referência',
  'calibrating-1': 'Clique no ponto final da distância de referência',
  'measuring-0': 'Clique para marcar o ponto inicial',
  'measuring-1': 'Clique para marcar o ponto final',
  'measuring-2': 'Clique em qualquer lugar para medir nova distância',
}

const MapHintBar = memo(function MapHintBar({ mode, pointCount }: MapHintBarProps) {
  const hint = HINTS[`${mode}-${pointCount}`]
  if (!hint) return null

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-full bg-black-300/90 border border-black-100 text-white-300 text-xs pointer-events-none whitespace-nowrap">
      {hint}
    </div>
  )
})

export default MapHintBar
