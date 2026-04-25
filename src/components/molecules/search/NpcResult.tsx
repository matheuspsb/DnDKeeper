import { memo } from 'react'
import { Link } from 'react-router-dom'
import { FACTION_COLOR, NPC_STATUS_LABEL, NPC_STATUS_COLOR } from '../../../constants/npc.constants'
import { resolveImageUrl } from '../../../constants/arts'
import type { Npc } from '../../../types/npc.types'
import MaskIcon from '../../atoms/icons/MaskIcon'

const NpcResult = memo(function NpcResult({ npc }: { npc: Npc }) {
  return (
    <Link
      to="/npcs"
      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-black-300 transition-colors group"
    >
      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-black-300">
        {npc.imageUrl ? (
          <img
            src={resolveImageUrl(npc.imageUrl)}
            alt={npc.name}
            className="w-full h-full object-cover"
            style={{ objectPosition: npc.imagePosition ?? 'top' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white-300/30">
            <MaskIcon size={20} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-white-100 text-sm font-medium truncate">{npc.name}</span>
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0"
            style={{ color: NPC_STATUS_COLOR[npc.status], backgroundColor: NPC_STATUS_COLOR[npc.status] + '22' }}
          >
            {NPC_STATUS_LABEL[npc.status]}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className="text-[10px] font-semibold"
            style={{ color: FACTION_COLOR[npc.faction] }}
          >
            {npc.faction}
          </span>
          {npc.description && (
            <>
              <span className="text-white-300/30 text-[10px]">·</span>
              <span className="text-white-300/50 text-xs truncate">{npc.description}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
})

export default NpcResult
