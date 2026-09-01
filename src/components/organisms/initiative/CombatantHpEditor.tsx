import { useState } from 'react'
import type { KeyboardEvent } from 'react'

interface CombatantHpEditorProps {
  hp: number
  maxHp: number
  onConfirm: (hp: number, maxHp: number) => void
  onCancel: () => void
}

const inputClass =
  'w-full min-w-0 tabular-nums text-xs bg-black-500 border border-black-100 rounded-lg px-2 py-1.5 text-white-100 outline-none focus:border-white-300/40'

function CombatantHpEditor({ hp, maxHp, onConfirm, onCancel }: CombatantHpEditorProps) {
  const [hpValue, setHpValue] = useState(String(hp))
  const [maxValue, setMaxValue] = useState(String(maxHp))

  const parsedHp = Math.round(Number(hpValue))
  const parsedMax = Math.round(Number(maxValue))
  const valid =
    hpValue.trim() !== '' &&
    maxValue.trim() !== '' &&
    Number.isFinite(parsedHp) &&
    Number.isFinite(parsedMax) &&
    parsedHp >= 0 &&
    parsedMax >= 1

  function confirm() {
    if (!valid) return
    onConfirm(Math.min(parsedHp, parsedMax), parsedMax)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') confirm()
    if (e.key === 'Escape') onCancel()
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-1.5">
        <label className="flex flex-1 flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-wide text-white-300/50">HP atual</span>
          <input
            type="number"
            min={0}
            autoFocus
            value={hpValue}
            onChange={(e) => setHpValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={inputClass}
          />
        </label>
        <label className="flex flex-1 flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-wide text-white-300/50">HP máx</span>
          <input
            type="number"
            min={1}
            value={maxValue}
            onChange={(e) => setMaxValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={inputClass}
          />
        </label>
      </div>
      <div className="flex gap-1">
        <button
          onClick={onCancel}
          className="flex-1 rounded-lg border border-black-100/60 py-1.5 text-xs font-semibold text-white-300/70 transition-colors hover:bg-black-400/80 hover:text-white-100"
        >
          Cancelar
        </button>
        <button
          onClick={confirm}
          disabled={!valid}
          className="flex-1 rounded-lg bg-red-100 py-1.5 text-xs font-semibold text-white-100 transition-colors hover:bg-red-200 disabled:opacity-40 disabled:hover:bg-red-100"
        >
          Confirmar
        </button>
      </div>
    </div>
  )
}

export default CombatantHpEditor
