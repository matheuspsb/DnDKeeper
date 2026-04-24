import type { Npc, Faction } from '../../../types/npc.types'
import { FACTION_COLOR } from '../../../constants/npc.constants'
import NpcCard from './NpcCard'
import NpcEmpty from './NpcEmpty'

interface NpcContentProps {
  npcs: Npc[]
  grouped: { faction: Faction; npcs: Npc[] }[]
  onAdd: () => void
  onEdit: (npc: Npc) => void
  onDelete: (id: string) => void
}

function NpcContent({ npcs, grouped, onAdd, onEdit, onDelete }: NpcContentProps) {
  if (npcs.length === 0) return <NpcEmpty onAdd={onAdd} />

  if (grouped.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-white-300/60 text-sm">
          Nenhum NPC encontrado com os filtros selecionados.
        </p>
      </div>
    )

  return (
    <div className="flex flex-col gap-10">
      {grouped.map(({ faction, npcs: factionNpcs }) => (
        <div key={faction}>
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-lg font-semibold tracking-wide"
              style={{ color: FACTION_COLOR[faction] }}
            >
              {faction}
            </span>
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: FACTION_COLOR[faction] + '33' }}
            />
            <span className="text-white-300/40 text-xs">{factionNpcs.length}</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {factionNpcs.map((npc) => (
              <NpcCard
                key={npc.id}
                npc={npc}
                onEdit={() => onEdit(npc)}
                onDelete={() => onDelete(npc.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default NpcContent
