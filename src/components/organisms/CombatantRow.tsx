import type { Combatant, CombatantStatus } from '../../types/initiative'
import { HP_DELTAS } from '../../constants/initiative'
import IconButton from '../atoms/IconButton'
import TrashIcon from '../atoms/icons/TrashIcon'
import TypeBadge from '../atoms/TypeBadge'
import InitiativeBadge from '../molecules/InitiativeBadge'

interface CombatantRowProps {
  combatant: Combatant
  status: CombatantStatus
  onRemove: () => void
  onAdjustHp: (delta: number) => void
  onUpdateInitiative: (val: number) => void
}

function CombatantRow({ combatant, status, onRemove, onAdjustHp, onUpdateInitiative }: CombatantRowProps) {
  const isCurrent = status === 'current'
  const isDone = status === 'done'

  const hpPercent =
    combatant.hp !== null && combatant.maxHp !== null && combatant.maxHp > 0
      ? Math.round((combatant.hp / combatant.maxHp) * 100)
      : null

  const hpColor =
    hpPercent === null ? '#C0C0C0'
    : hpPercent > 50 ? '#4ade80'
    : hpPercent > 25 ? '#facc15'
    : '#D72334'

  const containerClass = isCurrent
    ? 'bg-red-500/10 border-2 border-red-100/40 rounded-xl p-4'
    : `bg-black-300 border border-black-100 rounded-xl px-4 py-3 ${isDone ? 'opacity-40' : ''}`

  return (
    <div className={containerClass}>
      <div className="flex items-center gap-3">
        <InitiativeBadge value={combatant.initiative} isCurrent={isCurrent} onUpdate={onUpdateInitiative} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-bold truncate ${isCurrent ? 'text-white-100 text-base' : 'text-white-100 text-sm'}`}>
              {combatant.name}
            </span>
            <TypeBadge isPlayer={combatant.isPlayer} />
            {isCurrent && (
              <span className="text-xs font-bold tracking-widest text-red-100/70 ml-1">TURNO ATUAL</span>
            )}
          </div>

          {combatant.hp !== null && combatant.maxHp !== null && (
            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-xs tabular-nums" style={{ color: hpColor }}>
                {combatant.hp} / {combatant.maxHp}
              </span>
              <div className="flex-1 h-1.5 bg-black-500 rounded-full overflow-hidden max-w-32">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${hpPercent}%`, backgroundColor: hpColor }}
                />
              </div>
            </div>
          )}
        </div>

        <IconButton onClick={onRemove} title="Remover">
          <TrashIcon size={14} />
        </IconButton>
      </div>

      {isCurrent && combatant.hp !== null && (
        <div className="flex gap-1 mt-3">
          {HP_DELTAS.map(delta => (
            <button
              key={delta}
              onClick={() => onAdjustHp(delta)}
              className={`flex-1 text-xs font-semibold py-1.5 rounded-lg border transition-colors cursor-pointer
                ${delta < 0
                  ? 'border-red-400/40 text-red-100/80 hover:text-red-100 hover:bg-red-400/10 bg-black-500'
                  : 'border-black-100 text-white-300/70 hover:text-white-100 bg-black-500 hover:bg-black-400'
                }`}
            >
              {delta > 0 ? `+${delta}` : delta}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default CombatantRow
