import { memo } from 'react'
import type { RulerMode } from '../../../hooks/useMapRuler'
import RefreshIcon from '../../atoms/icons/RefreshIcon'
import RulerIcon from '../../atoms/icons/RulerIcon'
import CheckCircleIcon from '../../atoms/icons/CheckCircleIcon'
import AlertIcon from '../../atoms/icons/AlertIcon'

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
  const baseBtn =
    'bg-black-300 border border-black-100 text-white-300 hover:bg-black-200 hover:text-white-100 transition-colors cursor-pointer'

  return (
    <>
      <div className="hidden md:flex absolute bottom-4 right-4 z-10 items-center gap-2">
        <div className="flex items-center gap-1.5 pr-2 border-r border-black-100">
          <button
            onClick={onCalibrateToggle}
            title="Calibrar régua"
            className={`flex items-center gap-1.5 px-3 h-8 rounded text-xs ${
              rulerMode === 'calibrating'
                ? 'bg-yellow border-yellow text-black-500 font-medium border'
                : baseBtn
            }`}
          >
            {isCalibrated
              ? <CheckCircleIcon size={13} strokeWidth={2.5} className="text-green-400 shrink-0" />
              : <AlertIcon size={13} strokeWidth={2.5} className="text-yellow shrink-0" />
            }
            Calibrar
          </button>
          <button
            onClick={onMeasureToggle}
            title="Medir distância"
            disabled={!isCalibrated}
            className={`px-3 h-8 rounded text-xs disabled:opacity-40 disabled:cursor-not-allowed ${
              rulerMode === 'measuring'
                ? 'bg-red-100 border-red-100 text-white-100 font-medium border'
                : baseBtn
            }`}
          >
            Régua
          </button>
        </div>
        <button onClick={onZoomOut} className={`w-8 h-8 rounded text-lg leading-none ${baseBtn}`}>
          −
        </button>
        <button onClick={onZoomIn} className={`w-8 h-8 rounded text-lg leading-none ${baseBtn}`}>
          +
        </button>
        <button onClick={onReset} className={`px-3 h-8 rounded text-xs ${baseBtn}`}>
          Reset
        </button>
      </div>

      <div className="md:hidden absolute bottom-4 right-4 z-10 flex flex-col items-center gap-1.5">
        <button
          onClick={onZoomIn}
          title="Aproximar"
          className={`w-9 h-9 rounded text-lg leading-none ${baseBtn}`}
        >
          +
        </button>
        <button
          onClick={onZoomOut}
          title="Afastar"
          className={`w-9 h-9 rounded text-lg leading-none ${baseBtn}`}
        >
          −
        </button>
        <button
          onClick={onReset}
          title="Resetar vista"
          className={`w-9 h-9 rounded flex items-center justify-center ${baseBtn}`}
        >
          <RefreshIcon size={16} />
        </button>

        <div className="w-full h-px bg-black-100 my-0.5" />

        <button
          onClick={onCalibrateToggle}
          title="Calibrar régua"
          className={`w-9 h-9 rounded flex items-center justify-center ${
            rulerMode === 'calibrating' ? 'bg-yellow border border-yellow text-black-500' : baseBtn
          }`}
        >
          {isCalibrated
            ? <CheckCircleIcon size={16} strokeWidth={2.5} className="text-green-400" />
            : <AlertIcon size={16} strokeWidth={2.5} className="text-yellow" />
          }
        </button>
        <button
          onClick={onMeasureToggle}
          title="Medir distância"
          disabled={!isCalibrated}
          className={`w-9 h-9 rounded flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed ${
            rulerMode === 'measuring' ? 'bg-red-100 border border-red-100 text-white-100' : baseBtn
          }`}
        >
          <RulerIcon size={16} />
        </button>
      </div>
    </>
  )
})

export default MapToolbar
