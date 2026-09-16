import { useState } from 'react'
import { HP_DELTAS } from '../../../constants/initiative'
import { hpPercent, resolveHpBarColor } from '../../../utils/character'
import PencilIcon from '../../atoms/icons/PencilIcon'
import CombatantHpEditor from './CombatantHpEditor'

interface CombatantHpControlsProps {
  hp: number
  maxHp: number
  canEdit: boolean
  onAdjustHp: (delta: number) => void
  onSetHp: (hp: number, maxHp: number) => void
}

function CombatantHpControls({
  hp,
  maxHp,
  canEdit,
  onAdjustHp,
  onSetHp,
}: CombatantHpControlsProps) {
  const [editOpen, setEditOpen] = useState(false)

  const percent = hpPercent(hp, maxHp)
  const color = resolveHpBarColor(percent)

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-medium" style={{ color }}>
            ♥ HP
            {canEdit && (
              <button
                onClick={() => setEditOpen((value) => !value)}
                title="Editar HP atual e máximo"
                className={`flex h-5 w-5 items-center justify-center rounded transition-colors cursor-pointer ${
                  editOpen ? 'text-white-100' : 'text-white-300/30 hover:text-white-300/70'
                }`}
              >
                <PencilIcon size={11} />
              </button>
            )}
          </span>
          <span className="tabular-nums font-semibold" style={{ color }}>
            {hp} / {maxHp}
          </span>
        </div>
        <div className="h-1.5 w-full bg-black-500/80 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${percent}%`, backgroundColor: color }}
          />
        </div>
      </div>

      {editOpen && canEdit ? (
        <CombatantHpEditor
          hp={hp}
          maxHp={maxHp}
          onConfirm={(newHp, newMaxHp) => {
            onSetHp(newHp, newMaxHp)
            setEditOpen(false)
          }}
          onCancel={() => setEditOpen(false)}
        />
      ) : (
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            {HP_DELTAS.filter((delta) => delta < 0).map((delta) => (
              <button
                key={delta}
                onClick={() => onAdjustHp(delta)}
                className="flex-1 text-xs font-semibold py-1.5 rounded-lg border transition-colors cursor-pointer border-red-400/40 text-red-100/80 bg-black-500/60 hover:text-white-100 hover:bg-red-100 hover:border-red-100"
              >
                {delta}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {HP_DELTAS.filter((delta) => delta > 0).map((delta) => (
              <button
                key={delta}
                onClick={() => onAdjustHp(delta)}
                className="flex-1 text-xs font-semibold py-1.5 rounded-lg border transition-colors cursor-pointer border-black-100/60 text-white-300/70 hover:text-white-100 bg-black-500/60 hover:bg-black-400/80"
              >
                +{delta}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default CombatantHpControls
