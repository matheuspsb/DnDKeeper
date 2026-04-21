import { memo } from 'react'

type MapCalibrationModalProps = {
  calibMiles: string
  onCalibMilesChange: (value: string) => void
  onConfirm: () => void
  onCancel: () => void
}

const MapCalibrationModal = memo(function MapCalibrationModal({
  calibMiles,
  onCalibMilesChange,
  onConfirm,
  onCancel,
}: MapCalibrationModalProps) {
  return (
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
          value={calibMiles}
          onChange={e => onCalibMilesChange(e.target.value)}
          placeholder="Ex: 50"
          autoFocus
          onKeyDown={e => {
            if (e.key === 'Enter') onConfirm()
            if (e.key === 'Escape') onCancel()
          }}
          className="bg-black-400 border border-black-100 rounded-lg px-3 py-2 text-white-100 text-sm outline-none focus:border-red-100 transition-colors"
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-1.5 rounded border border-black-100 text-white-300 text-sm hover:text-white-100 hover:bg-black-200 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={!calibMiles || Number(calibMiles) <= 0}
            className="px-4 py-1.5 rounded bg-red-100 text-white-100 text-sm font-medium hover:bg-red-200 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
})

export default MapCalibrationModal
