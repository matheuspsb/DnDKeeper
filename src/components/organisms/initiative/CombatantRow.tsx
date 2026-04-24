import type { Combatant, CombatantStatus } from '../../../types/initiative'
import { HP_DELTAS } from '../../../constants/initiative'
import { resolveImageUrl } from '../../../constants/arts'
import TrashIcon from '../../atoms/icons/TrashIcon'
import TypeBadge from '../../atoms/TypeBadge'
import InitiativeBadge from '../../molecules/initiative/InitiativeBadge'

interface CombatantRowProps {
  combatant: Combatant
  status: CombatantStatus
  onRemove: () => void
  onAdjustHp: (delta: number) => void
  onUpdateInitiative: (val: number) => void
}

function CombatantRow({
  combatant,
  status,
  onRemove,
  onAdjustHp,
  onUpdateInitiative,
}: CombatantRowProps) {
  const isCurrent = status === 'current'
  const isDone = status === 'done'

  const hpPercent =
    combatant.hp !== null && combatant.maxHp !== null && combatant.maxHp > 0
      ? Math.round((combatant.hp / combatant.maxHp) * 100)
      : null

  const hpColor =
    hpPercent === null
      ? '#C0C0C0'
      : hpPercent > 50
        ? '#4ade80'
        : hpPercent > 25
          ? '#facc15'
          : '#D72334'

  return (
    <div
      className={`rounded-xl overflow-hidden ${isCurrent ? 'p-0.5 current-turn-border' : ''} ${isDone ? 'opacity-40' : ''}`}
    >
      <div
        className={`relative overflow-hidden min-h-44
          ${
            isCurrent
              ? 'bg-black-300 rounded-[10px]'
              : 'bg-black-300 rounded-xl border border-black-100'
          }`}
      >
        {combatant.imageUrl && (
          <div className="absolute inset-0 pointer-events-none">
            <img
              src={resolveImageUrl(combatant.imageUrl)}
              alt="combatent image"
              aria-hidden
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-black-300/82" />
          </div>
        )}

        <div className="relative z-10 flex flex-col gap-3 p-4 h-full">
          <div className="flex items-start justify-between gap-2">
            <InitiativeBadge
              value={combatant.initiative}
              isCurrent={isCurrent}
              onUpdate={onUpdateInitiative}
            />
            <button
              onClick={onRemove}
              title="Remover"
              className="flex items-center justify-center w-7 h-7 rounded-lg text-white-300/40 hover:text-white-300 transition-colors cursor-pointer shrink-0"
            >
              <TrashIcon size={13} />
            </button>
          </div>

          <div className="flex-1">
            <span
              className={`font-bold leading-tight block ${isCurrent ? 'text-white-100 text-base' : 'text-white-100 text-sm'}`}
            >
              {combatant.name}
            </span>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <TypeBadge isPlayer={combatant.isPlayer} />
            </div>
          </div>

          {combatant.hp !== null && combatant.maxHp !== null && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium" style={{ color: hpColor }}>
                  ♥ HP
                </span>
                <span className="tabular-nums font-semibold" style={{ color: hpColor }}>
                  {combatant.hp} / {combatant.maxHp}
                </span>
              </div>
              <div className="h-1.5 w-full bg-black-500/80 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${hpPercent}%`, backgroundColor: hpColor }}
                />
              </div>
            </div>
          )}

          {combatant.hp !== null && (
            <div className="flex gap-1">
              {HP_DELTAS.map((delta) => (
                <button
                  key={delta}
                  onClick={() => onAdjustHp(delta)}
                  className={`flex-1 text-xs font-semibold py-1.5 rounded-lg border transition-colors cursor-pointer
                    ${
                      delta < 0
                        ? 'border-red-400/40 text-red-100/80 hover:text-red-100 hover:bg-red-400/10 bg-black-500/60'
                        : 'border-black-100/60 text-white-300/70 hover:text-white-100 bg-black-500/60 hover:bg-black-400/80'
                    }`}
                >
                  {delta > 0 ? `+${delta}` : delta}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CombatantRow
