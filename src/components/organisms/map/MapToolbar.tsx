import { memo } from 'react'
import type { RulerMode } from '../../../hooks/useMapRuler'

type MapToolbarProps = {
  rulerMode: RulerMode
  isCalibrated: boolean
  onCalibrateToggle: () => void
  onMeasureToggle: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
}

const MapToolbar = memo(function MapToolbar({
  rulerMode,
  isCalibrated,
  onCalibrateToggle,
  onMeasureToggle,
  onZoomIn,
  onZoomOut,
  onReset,
}: MapToolbarProps) {
  return (
    <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
      <div className="flex items-center gap-1.5 pr-2 border-r border-black-100">
        {isCalibrated && (
          <span className="text-xs font-semibold text-red-100 mr-1">Calibrado ✓</span>
        )}
        <button
          onClick={onCalibrateToggle}
          title="Calibrar régua"
          className={`px-3 h-8 rounded border text-xs transition-colors cursor-pointer ${
            rulerMode === 'calibrating'
              ? 'bg-yellow border-yellow text-black-500 font-medium'
              : 'bg-black-300 border-black-100 text-white-300 hover:bg-black-200 hover:text-white-100'
          }`}
        >
          Calibrar
        </button>
        <button
          onClick={onMeasureToggle}
          title="Medir distância"
          disabled={!isCalibrated}
          className={`px-3 h-8 rounded border text-xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            rulerMode === 'measuring'
              ? 'bg-red-100 border-red-100 text-white-100 font-medium'
              : 'bg-black-300 border-black-100 text-white-300 hover:bg-black-200 hover:text-white-100'
          }`}
        >
          Régua
        </button>
      </div>

      <button
        onClick={onZoomOut}
        className="w-8 h-8 rounded bg-black-300 border border-black-100 text-white-100 text-lg leading-none hover:bg-black-200 transition-colors cursor-pointer"
      >
        −
      </button>
      <button
        onClick={onZoomIn}
        className="w-8 h-8 rounded bg-black-300 border border-black-100 text-white-100 text-lg leading-none hover:bg-black-200 transition-colors cursor-pointer"
      >
        +
      </button>
      <button
        onClick={onReset}
        className="px-3 h-8 rounded bg-black-300 border border-black-100 text-white-300 text-xs hover:bg-black-200 hover:text-white-100 transition-colors cursor-pointer"
      >
        Reset
      </button>
    </div>
  )
})

export default MapToolbar
