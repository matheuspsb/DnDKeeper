import { useState } from 'react'
import ConditionBadge from '../../molecules/initiative/ConditionBadge'
import ConditionModal from './ConditionModal'

interface CombatantConditionsProps {
  combatantName: string
  conditions: string[]
  onSave: (conditions: string[]) => void
}

function CombatantConditions({ combatantName, conditions, onSave }: CombatantConditionsProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
        {conditions.map((c) => (
          <ConditionBadge key={c} label={c} />
        ))}
        <button
          onClick={() => setModalOpen(true)}
          className="text-[10px] font-medium px-1.5 py-0.5 rounded border border-dashed border-white-300/30 text-white-300/60 hover:text-white-300 hover:border-white-300/60 transition-colors cursor-pointer leading-tight shrink-0"
        >
          {conditions.length > 0 ? 'Editar' : '+ Condição'}
        </button>
      </div>

      {modalOpen && (
        <ConditionModal
          combatantName={combatantName}
          active={conditions}
          onSave={onSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}

export default CombatantConditions
