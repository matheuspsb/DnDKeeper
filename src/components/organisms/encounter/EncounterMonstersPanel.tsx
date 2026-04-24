import type { MonsterEntry } from '../../../types/encounter'
import type { CR } from '../../../types/encounter'
import { CR_OPTIONS, CR_XP } from '../../../constants/encounter'
import { formatNumber } from '../../../utils/number'
import Button from '../../atoms/Button'
import PlusIcon from '../../atoms/icons/PlusIcon'
import TrashIcon from '../../atoms/icons/TrashIcon'
import SwordsIcon from '../../atoms/icons/SwordsIcon'

interface XpMonstersPanelProps {
  monsters: MonsterEntry[]
  onAdd: () => void
  onUpdate: (id: string, data: Partial<Omit<MonsterEntry, 'id'>>) => void
  onRemove: (id: string) => void
  onClear: () => void
}

const inputClass = `
  bg-black-500 border border-black-100 rounded-lg px-3 py-2
  text-white-100 text-sm placeholder:text-white-300/30
  focus:outline-none focus:border-red-100 transition-colors
`

function XpMonstersPanel({ monsters, onAdd, onUpdate, onRemove, onClear }: XpMonstersPanelProps) {
  return (
    <div className="bg-black-300 border border-black-100 rounded-xl flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-black-100">
        <div className="flex items-center gap-2">
          <span className="text-white-100 font-semibold text-sm">Monstros</span>
          {monsters.length > 0 && (
            <span className="text-[10px] bg-black-400 border border-black-100 text-white-300 px-2 py-0.5 rounded-full">
              {monsters.reduce((total, monster) => total + monster.quantity, 0)} total
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {monsters.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="text-xs text-white-300/40 hover:text-red-100 transition-colors"
            >
              Limpar
            </button>
          )}
          <button
            type="button"
            onClick={onAdd}
            className="flex items-center gap-1 text-xs text-red-100 hover:text-red-200 transition-colors font-medium"
          >
            <PlusIcon size={13} />
            Adicionar
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4">
        {monsters.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
            <SwordsIcon size={28} className="text-white-300/20" />
            <p className="text-white-300/40 text-xs max-w-35">
              Adicione os monstros do encontro com seu CR
            </p>
            <Button variant="primary" onClick={onAdd} className="w-auto! px-4 gap-2 h-9 text-xs">
              <PlusIcon size={12} /> Adicionar monstro
            </Button>
          </div>
        )}

        {monsters.map((monster) => (
          <div key={monster.id} className="flex items-center gap-2">
            <input
              value={monster.name}
              onChange={(e) => onUpdate(monster.id, { name: e.target.value })}
              placeholder="Nome do monstro..."
              className={`flex-1 min-w-0 ${inputClass}`}
            />

            <div className="relative shrink-0">
              <select
                value={monster.cr}
                onChange={(e) => onUpdate(monster.id, { cr: e.target.value as CR })}
                className={`w-20 appearance-none pr-6 ${inputClass} cursor-pointer`}
              >
                {CR_OPTIONS.map((cr) => (
                  <option key={cr} value={cr} className="bg-black-500">
                    CR {cr}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white-300/40 text-[10px]">
                ▾
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() =>
                  onUpdate(monster.id, { quantity: Math.max(1, monster.quantity - 1) })
                }
                className="w-7 h-8 flex items-center justify-center rounded-l-lg bg-black-500 border border-black-100 text-white-300 hover:text-white-100 hover:border-black-200 transition-colors text-base leading-none"
              >
                −
              </button>
              <div className="w-8 h-8 flex items-center justify-center bg-black-500 border-y border-black-100 text-white-100 text-sm font-medium">
                {monster.quantity}
              </div>
              <button
                type="button"
                onClick={() => onUpdate(monster.id, { quantity: monster.quantity + 1 })}
                className="w-7 h-8 flex items-center justify-center rounded-r-lg bg-black-500 border border-black-100 text-white-300 hover:text-white-100 hover:border-black-200 transition-colors text-base leading-none"
              >
                +
              </button>
            </div>

            <span className="text-[10px] text-white-300/40 shrink-0 w-14 text-right tabular-nums">
              {formatNumber(CR_XP[monster.cr] * monster.quantity)} xp
            </span>

            <button
              type="button"
              onClick={() => onRemove(monster.id)}
              className="shrink-0 text-white-300/40 hover:text-red-100 transition-colors"
            >
              <TrashIcon size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default XpMonstersPanel
