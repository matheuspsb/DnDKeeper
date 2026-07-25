import { memo } from 'react'
import type { RulerMode } from '../../../hooks/useMapRuler'
import RefreshIcon from '../../atoms/icons/RefreshIcon'
import RulerIcon from '../../atoms/icons/RulerIcon'
import CheckCircleIcon from '../../atoms/icons/CheckCircleIcon'
import AlertIcon from '../../atoms/icons/AlertIcon'
import PencilIcon from '../../atoms/icons/PencilIcon'
import TrashIcon from '../../atoms/icons/TrashIcon'
import UndoIcon from '../../atoms/icons/UndoIcon'

const BRUSH_COLORS = [
  { value: '#D72334', label: 'Vermelho' },
  { value: '#ECC83B', label: 'Amarelo' },
  { value: '#F5F5F5', label: 'Branco' },
  { value: '#60a5fa', label: 'Azul' },
  { value: '#4ade80', label: 'Verde' },
]

const BRUSH_SIZES = [
  { value: 3, label: 'P' },
  { value: 6, label: 'M' },
  { value: 12, label: 'G' },
]

type MapToolbarProps = {
  rulerMode: RulerMode
  isCalibrated: boolean
  onCalibrateToggle: () => void
  onMeasureToggle: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
  isDrawingMode: boolean
  onDrawingToggle: () => void
  brushColor: string
  onBrushColorChange: (color: string) => void
  brushSize: number
  onBrushSizeChange: (size: number) => void
  onUndo: () => void
  onClearDrawings: () => void
}

const MapToolbar = memo(function MapToolbar({
  rulerMode,
  isCalibrated,
  onCalibrateToggle,
  onMeasureToggle,
  onZoomIn,
  onZoomOut,
  onReset,
  isDrawingMode,
  onDrawingToggle,
  brushColor,
  onBrushColorChange,
  brushSize,
  onBrushSizeChange,
  onUndo,
  onClearDrawings,
}: MapToolbarProps) {
  const baseBtn =
    'bg-black-300 border border-black-100 text-white-300 hover:bg-black-200 hover:text-white-100 transition-colors cursor-pointer'

  const drawingPanel = (
    <div className="flex items-center gap-1.5 px-2 py-1.5 bg-black-300 border border-black-100 rounded">
      {BRUSH_COLORS.map((c) => (
        <button
          key={c.value}
          title={c.label}
          onClick={() => onBrushColorChange(c.value)}
          className="w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer shrink-0"
          style={{
            backgroundColor: c.value,
            borderColor: brushColor === c.value ? 'white' : 'transparent',
          }}
        />
      ))}
      <div className="w-px h-4 bg-black-100 mx-0.5 shrink-0" />
      {BRUSH_SIZES.map((s) => (
        <button
          key={s.value}
          title={`Tamanho ${s.label}`}
          onClick={() => onBrushSizeChange(s.value)}
          className={`w-6 h-6 rounded text-xs font-bold cursor-pointer transition-colors ${
            brushSize === s.value
              ? 'bg-white-100 text-black-500'
              : 'text-white-300 hover:text-white-100'
          }`}
        >
          {s.label}
        </button>
      ))}
      <div className="w-px h-4 bg-black-100 mx-0.5 shrink-0" />
      <button
        onClick={onUndo}
        title="Desfazer último traço"
        className="text-white-300 hover:text-white-100 transition-colors cursor-pointer"
      >
        <UndoIcon size={14} />
      </button>
      <button
        onClick={onClearDrawings}
        title="Limpar todos os desenhos"
        className="text-white-300 hover:text-red-100 transition-colors cursor-pointer"
      >
        <TrashIcon size={14} />
      </button>
    </div>
  )

  return (
    <>
      <div className="hidden md:flex flex-col absolute bottom-4 right-4 z-10 items-end gap-2">
        {isDrawingMode && drawingPanel}
        <div className="flex items-center gap-2">
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
              {isCalibrated ? (
                <CheckCircleIcon size={13} strokeWidth={2.5} className="text-green-400 shrink-0" />
              ) : (
                <AlertIcon size={13} strokeWidth={2.5} className="text-yellow shrink-0" />
              )}
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
          <div className="w-px h-6 bg-black-100" />
          <button
            onClick={onDrawingToggle}
            title="Modo de desenho"
            className={`w-8 h-8 rounded flex items-center justify-center ${
              isDrawingMode ? 'bg-red-100 border border-red-100 text-white-100' : baseBtn
            }`}
          >
            <PencilIcon size={14} />
          </button>
        </div>
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
          {isCalibrated ? (
            <CheckCircleIcon size={16} strokeWidth={2.5} className="text-green-400" />
          ) : (
            <AlertIcon size={16} strokeWidth={2.5} className="text-yellow" />
          )}
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

        <div className="w-full h-px bg-black-100 my-0.5" />

        <button
          onClick={onDrawingToggle}
          title="Modo de desenho"
          className={`w-9 h-9 rounded flex items-center justify-center ${
            isDrawingMode ? 'bg-red-100 border border-red-100 text-white-100' : baseBtn
          }`}
        >
          <PencilIcon size={16} />
        </button>

        {isDrawingMode && (
          <>
            {BRUSH_COLORS.map((c) => (
              <button
                key={c.value}
                title={c.label}
                onClick={() => onBrushColorChange(c.value)}
                className="w-6 h-6 rounded-full border-2 cursor-pointer"
                style={{
                  backgroundColor: c.value,
                  borderColor: brushColor === c.value ? 'white' : 'transparent',
                }}
              />
            ))}
            <div className="w-full h-px bg-black-100 my-0.5" />
            {BRUSH_SIZES.map((s) => (
              <button
                key={s.value}
                onClick={() => onBrushSizeChange(s.value)}
                className={`w-9 h-7 rounded text-xs font-bold cursor-pointer transition-colors ${
                  brushSize === s.value ? 'bg-white-100 text-black-500' : baseBtn
                }`}
              >
                {s.label}
              </button>
            ))}
            <div className="w-full h-px bg-black-100 my-0.5" />
            <button
              onClick={onUndo}
              title="Desfazer"
              className={`w-9 h-9 rounded flex items-center justify-center ${baseBtn}`}
            >
              <UndoIcon size={16} />
            </button>
            <button
              onClick={onClearDrawings}
              title="Limpar"
              className={`w-9 h-9 rounded flex items-center justify-center hover:text-red-100 ${baseBtn}`}
            >
              <TrashIcon size={16} />
            </button>
          </>
        )}
      </div>
    </>
  )
})

export default MapToolbar
