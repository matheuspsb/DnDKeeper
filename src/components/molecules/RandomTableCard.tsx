import { memo, useCallback } from 'react'
import type { RandomTable } from '../../constants/randomTables'
import type { RollEntry } from '../../types/randomTables'
import DiceIcon from '../atoms/icons/DiceIcon'

interface RandomTableCardProps {
  table: RandomTable
  roll: RollEntry | undefined
  onRoll: (id: string) => void
}

const RandomTableCard = memo(function RandomTableCard({
  table,
  roll,
  onRoll,
}: RandomTableCardProps) {
  const handleClick = useCallback(() => onRoll(table.id), [onRoll, table.id])

  return (
    <div
      onClick={handleClick}
      className="bg-black-300 border border-black-100 rounded-xl p-4 cursor-pointer hover:border-black-200 transition-colors duration-150 group select-none"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <span className="text-white-300/40 text-xs">{table.category}</span>
          <h3 className="text-white-100 font-semibold text-sm mt-0.5 leading-snug">
            {table.title}
          </h3>
        </div>
        <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/20 border border-red-400/30 text-red-100/70 group-hover:bg-red-100 group-hover:border-red-100 group-hover:text-white-100 transition-all duration-150">
          <DiceIcon size={15} />
        </div>
      </div>

      {roll ? (
        <div key={roll.key} className="roll-result bg-black-500 rounded-lg px-3 py-2.5">
          <p className="text-white-200 text-sm leading-relaxed">{roll.result}</p>
        </div>
      ) : (
        <div className="bg-black-500/50 border border-dashed border-black-100/40 rounded-lg px-3 py-2.5">
          <p className="text-white-300/30 text-xs">Clique para rolar...</p>
        </div>
      )}

      <p className="text-white-300/20 text-xs mt-2 text-right tabular-nums">
        {table.entries.length} entradas
      </p>
    </div>
  )
})

export default RandomTableCard
