import type { Combatant, CombatantStatus } from '../../../types/initiative'
import { useScrollIntoViewOnChange } from '../../../hooks/useScrollIntoViewOnChange'
import CombatantOrderCard from './CombatantOrderCard'

interface InitiativeOrderListProps {
  combatants: Combatant[]
  currentIndex: number
}

function statusFor(index: number, currentIndex: number): CombatantStatus {
  if (index === currentIndex) return 'current'
  return index < currentIndex ? 'done' : 'pending'
}

function InitiativeOrderList({ combatants, currentIndex }: InitiativeOrderListProps) {
  const currentRef = useScrollIntoViewOnChange<HTMLDivElement>(currentIndex)

  return (
    <>
      <h2 className="mt-8 mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-white-300/40">
        Ordem de iniciativa
      </h2>
      <div className="grid grid-cols-1 gap-3 pb-4 sm:grid-cols-2 lg:grid-cols-3">
        {combatants.map((combatant, index) => (
          <div key={combatant.id} ref={index === currentIndex ? currentRef : undefined}>
            <CombatantOrderCard combatant={combatant} status={statusFor(index, currentIndex)} />
          </div>
        ))}
      </div>
    </>
  )
}

export default InitiativeOrderList
