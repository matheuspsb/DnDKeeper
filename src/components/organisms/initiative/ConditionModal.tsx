import { useState } from 'react'
import { CONDITIONS } from '../../../constants/initiative'
import Button from '../../atoms/Button'
import XIcon from '../../atoms/icons/XIcon'

interface ConditionModalProps {
  combatantName: string
  active: string[]
  onSave: (conditions: string[]) => void
  onClose: () => void
}

function ConditionModal({ combatantName, active, onSave, onClose }: ConditionModalProps) {
  const [selected, setSelected] = useState<string[]>(active)

  function toggle(condition: string) {
    setSelected((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition],
    )
  }

  function handleSave() {
    onSave(selected)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-black-400 border border-black-100 rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-black-200">
          <div>
            <h3 className="text-white-100 font-semibold">Condições</h3>
            <p className="text-white-300/50 text-xs mt-0.5">{combatantName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white-300/50 hover:text-white-100 transition-colors cursor-pointer"
          >
            <XIcon size={16} />
          </button>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-3 gap-2">
            {CONDITIONS.map((condition) => {
              const isActive = selected.includes(condition)
              return (
                <button
                  key={condition}
                  onClick={() => toggle(condition)}
                  className={`text-xs font-medium px-2 py-2 rounded-lg border transition-colors cursor-pointer text-center
                    ${
                      isActive
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                        : 'bg-black-500/60 border-black-100/60 text-white-300/60 hover:text-white-300 hover:border-black-100'
                    }`}
                >
                  {condition}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex gap-3 px-5 pb-5">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} className="flex-1">
            Salvar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConditionModal
