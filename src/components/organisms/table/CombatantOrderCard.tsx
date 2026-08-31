import type { Combatant, CombatantStatus } from '../../../types/initiative'
import CombatantAvatar from '../../molecules/table/CombatantAvatar'
import CombatantConditions from '../../molecules/table/CombatantConditions'
import HealthReadout from '../../molecules/table/HealthReadout'

interface CombatantOrderCardProps {
  combatant: Combatant
  status: CombatantStatus
}

const CONTAINER: Record<CombatantStatus, string> = {
  current: 'border-red-100 bg-black-300',
  done: 'border-black-100 bg-black-400 opacity-40',
  pending: 'border-black-100 bg-black-400',
}

function CombatantOrderCard({ combatant, status }: CombatantOrderCardProps) {
  return (
    <div
      className={`relative flex items-center gap-3 rounded-xl border p-3 transition-opacity ${CONTAINER[status]}`}
    >
      <CombatantAvatar combatant={combatant} className="h-14 w-14" />

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-base font-semibold text-white-100">{combatant.name}</span>
          <span className="shrink-0 tabular-nums text-xs text-white-300/50">
            init {combatant.initiative}
          </span>
        </div>

        <HealthReadout combatant={combatant} variant="card" />

        <CombatantConditions conditions={combatant.conditions} size="sm" className="mt-1.5" />
      </div>
    </div>
  )
}

export default CombatantOrderCard
