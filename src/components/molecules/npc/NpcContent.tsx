import type { Npc } from '../../../types/npc.types'
import NpcCard from './NpcCard'
import NpcEmpty from './NpcEmpty'

export interface NpcGroup {
  key: string
  label: string
  color: string
  npcs: Npc[]
}

interface NpcContentProps {
  npcs: Npc[]
  grouped: NpcGroup[]
  onAdd: () => void
  onEdit: (npc: Npc) => void
  onDelete: (id: string) => void
  onImageClick: (npc: Npc) => void
}

function NpcContent({ npcs, grouped, onAdd, onEdit, onDelete, onImageClick }: NpcContentProps) {
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
      {grouped.map(({ key, label, color, npcs: groupNpcs }) => (
        <div key={key}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-lg font-semibold tracking-wide" style={{ color }}>
              {label}
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: color + '33' }} />
            <span className="text-white-300/40 text-xs">{groupNpcs.length}</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {groupNpcs.map((npc) => (
              <NpcCard
                key={npc.id}
                npc={npc}
                onEdit={() => onEdit(npc)}
                onDelete={() => onDelete(npc.id)}
                onImageClick={() => onImageClick(npc)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default NpcContent
