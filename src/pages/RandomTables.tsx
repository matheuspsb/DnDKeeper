import { useCallback, useState } from 'react'
import { TABLE_CATEGORIES, TABLES_BY_CATEGORY, TABLES_BY_ID } from '../constants/randomTables'
import type { RollEntry } from '../types/randomTables'
import { pickRandom } from '../utils/random'
import Button from '../components/atoms/Button'
import DiceIcon from '../components/atoms/icons/DiceIcon'
import RandomTableCard from '../components/molecules/RandomTableCard'

function RandomTables() {
  const [rolls, setRolls] = useState<Record<string, RollEntry>>({})

  const handleRoll = useCallback((tableId: string) => {
    setRolls(prev => ({
      ...prev,
      [tableId]: {
        result: pickRandom(TABLES_BY_ID[tableId].entries),
        key: (prev[tableId]?.key ?? 0) + 1,
      },
    }))
  }, [])

  const rollAll = useCallback(() => {
    setRolls(prev => {
      const next: Record<string, RollEntry> = {}
      for (const tableId in TABLES_BY_ID) {
        next[tableId] = {
          result: pickRandom(TABLES_BY_ID[tableId].entries),
          key: (prev[tableId]?.key ?? 0) + 1,
        }
      }
      return next
    })
  }, [])

  return (
    <div className="flex flex-col gap-8 p-8 min-h-full">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-white-100 text-3xl font-bold">Tabelas Aleatórias</h2>
          <p className="text-white-300/60 text-sm mt-1">
            Clique em qualquer card para rolar ou role tudo de uma vez
          </p>
        </div>
        <Button variant="primary" onClick={rollAll} className="w-auto! px-5 gap-2 shrink-0">
          <DiceIcon size={15} /> Rolar Tudo
        </Button>
      </div>

      {TABLE_CATEGORIES.map(category => (
        <section key={category} className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <h3 className="text-red-100 text-xs font-semibold uppercase tracking-widest whitespace-nowrap">
              {category}
            </h3>
            <div className="flex-1 h-px bg-black-100" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {TABLES_BY_CATEGORY[category].map(table => (
              <RandomTableCard
                key={table.id}
                table={table}
                roll={rolls[table.id]}
                onRoll={handleRoll}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default RandomTables
