import { useState, type KeyboardEvent } from 'react'
import { HP_DELTA_OPTIONS } from '../../../constants/character'
import { clampNumber } from '../../../utils/number'
import { hpPercent, resolveHpBarColor } from '../../../utils/character'

interface CharacterHpControlsProps {
  currentHP: number
  maxHP: number
  onHpAdjust: (delta: number) => void
}

function CharacterHpControls({ currentHP, maxHP, onHpAdjust }: CharacterHpControlsProps) {
  const [isEditingHp, setIsEditingHp] = useState(false)
  const [hpInputValue, setHpInputValue] = useState('')

  const hpPercentage = hpPercent(currentHP, maxHP)
  const hpColor = resolveHpBarColor(hpPercentage)

  function startHpEdit() {
    setHpInputValue(String(currentHP))
    setIsEditingHp(true)
  }

  function commitHpEdit() {
    const newHp = parseInt(hpInputValue, 10)
    if (!isNaN(newHp)) {
      onHpAdjust(clampNumber(newHp, 0, maxHP) - currentHP)
    }
    setIsEditingHp(false)
  }

  function handleHpInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') commitHpEdit()
    if (e.key === 'Escape') setIsEditingHp(false)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-white-300/80 text-xs font-medium flex items-center gap-1.5">
          <span style={{ color: hpColor }}>♥</span> Pontos de Vida
        </span>
        <div className="flex items-center gap-1 text-sm">
          {isEditingHp ? (
            <input
              autoFocus
              type="number"
              value={hpInputValue}
              onChange={(e) => setHpInputValue(e.target.value)}
              onBlur={commitHpEdit}
              onKeyDown={handleHpInputKeyDown}
              className="w-14 bg-black-500 border border-red-100 rounded px-1.5 text-center text-white-100 text-sm focus:outline-none tabular-nums"
            />
          ) : (
            <button
              onClick={startHpEdit}
              title="Clique para editar HP"
              className="font-bold tabular-nums hover:opacity-70 transition-opacity"
              style={{ color: hpColor }}
            >
              {currentHP}
            </button>
          )}
          <span className="text-white-300/40 tabular-nums">/ {maxHP}</span>
          <span className="text-white-300/30 text-xs ml-1">({hpPercentage}%)</span>
        </div>
      </div>

      <div className="h-2 w-full bg-black-500 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${hpPercentage}%`,
            backgroundColor: hpColor,
            transition: 'width 0.35s ease, background-color 0.5s ease',
          }}
        />
      </div>

      <div className="flex gap-1">
        {HP_DELTA_OPTIONS.map((delta) => (
          <button
            key={delta}
            onClick={() => onHpAdjust(delta)}
            className={`flex-1 text-xs font-medium py-1 rounded border transition-colors cursor-pointer
              ${
                delta < 0
                  ? 'border-black-100 text-red-100/70 hover:text-red-100 hover:border-red-400/50 bg-black-500 hover:bg-red-400/10'
                  : 'border-black-100 text-white-300/70 hover:text-white-100 bg-black-500 hover:bg-black-400'
              }`}
          >
            {delta > 0 ? `+${delta}` : delta}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CharacterHpControls
