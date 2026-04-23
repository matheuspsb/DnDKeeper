import type { Npc } from '../../../types/npc.types'
import FactionBadge from '../../atoms/FactionBadge'
import StatusDot from '../../atoms/StatusDot'

interface NpcCardBodyProps {
  npc: Npc
}

function NpcCardBody({ npc }: NpcCardBodyProps) {
  return (
    <div className="flex-1 p-4 flex flex-col gap-3 min-w-0">
      <div className="min-w-0">
        <h3 className="text-white-100 font-bold text-base leading-tight truncate">{npc.name}</h3>
        <div className="mt-1.5 flex items-center gap-2 flex-wrap">
          <StatusDot status={npc.status} />
        </div>
      </div>

      <FactionBadge faction={npc.faction} />

      {npc.description && (
        <p className="text-white-300/60 text-xs leading-relaxed line-clamp-2">{npc.description}</p>
      )}

      {npc.notes && (
        <div className="border-t border-black-200 pt-2.5">
          <p className="text-white-300/40 text-xs leading-relaxed line-clamp-2 italic">
            {npc.notes}
          </p>
        </div>
      )}
    </div>
  )
}

export default NpcCardBody
