import { useState } from 'react'
import type { Npc, Faction } from '../../../types/npc.types'
import NpcFactionChannel from './NpcFactionChannel'
import NpcDossierRow from './NpcDossierRow'
import NpcEmpty from './NpcEmpty'

interface NpcContentProps {
  npcs: Npc[]
  grouped: { faction: Faction; npcs: Npc[] }[]
  canEdit: boolean
  onAdd: () => void
  onEdit: (npc: Npc) => void
  onDelete: (id: string) => void
  onImageClick: (npc: Npc) => void
}

function NpcContent({
  npcs,
  grouped,
  canEdit,
  onAdd,
  onEdit,
  onDelete,
  onImageClick,
}: NpcContentProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (npcs.length === 0) return <NpcEmpty onAdd={onAdd} />

  if (grouped.length === 0)
    return (
      <div className="flex flex-col items-center gap-1 py-24 text-center">
        <p className="font-display text-sm tracking-[0.15em] text-bone-400 uppercase">
          Nenhuma ficha corresponde
        </p>
        <p className="font-body text-[13px] text-bone-400/70">
          Ajuste a busca ou os filtros para reabrir o arquivo.
        </p>
      </div>
    )

  return (
    <div className="flex flex-col gap-9">
      {grouped.map(({ faction, npcs: factionNpcs }) => (
        <NpcFactionChannel key={faction} faction={faction} count={factionNpcs.length}>
          {factionNpcs.map((npc) => (
            <NpcDossierRow
              key={npc.id}
              npc={npc}
              canEdit={canEdit}
              expanded={expandedId === npc.id}
              onToggle={() => setExpandedId((id) => (id === npc.id ? null : npc.id))}
              onEdit={() => onEdit(npc)}
              onDelete={() => onDelete(npc.id)}
              onImageClick={() => onImageClick(npc)}
            />
          ))}
        </NpcFactionChannel>
      ))}
    </div>
  )
}

export default NpcContent
