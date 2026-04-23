import { Handle, Position, type NodeTypes } from '@xyflow/react'
import type { Npc } from '../../types/npc.types'
import { FACTION_COLOR, NPC_STATUS_COLOR } from '../../constants/npc.constants'
import { resolveImageUrl } from '../../constants/arts'
import MaskIcon from '../atoms/icons/MaskIcon'

export interface NpcNodeData {
  npc: Npc
  [key: string]: unknown
}

interface NpcNodeProps {
  data: NpcNodeData
}

function NpcNode({ data }: NpcNodeProps) {
  const { npc } = data
  const factionColor = FACTION_COLOR[npc.faction]
  const statusColor = NPC_STATUS_COLOR[npc.status]

  return (
    <>
      <Handle type="source" id="s-top"    position={Position.Top}    style={{ opacity: 0 }} />
      <Handle type="source" id="s-bottom" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="source" id="s-left"   position={Position.Left}   style={{ opacity: 0 }} />
      <Handle type="source" id="s-right"  position={Position.Right}  style={{ opacity: 0 }} />
      <Handle type="target" id="t-top"    position={Position.Top}    style={{ opacity: 0 }} />
      <Handle type="target" id="t-bottom" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="target" id="t-left"   position={Position.Left}   style={{ opacity: 0 }} />
      <Handle type="target" id="t-right"  position={Position.Right}  style={{ opacity: 0 }} />
      <div
        className="bg-black-300 border-2 rounded-xl overflow-hidden shadow-xl w-36"
        style={{ borderColor: factionColor }}
      >
        <div className="h-24 relative bg-black-400">
          {npc.imageUrl ? (
            <img
              src={resolveImageUrl(npc.imageUrl)}
              alt={npc.name}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white-300/20">
              <MaskIcon size={32} />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-black-300 to-transparent pointer-events-none" />
          <span
            className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full border border-black-300"
            style={{ backgroundColor: statusColor }}
            title={npc.status}
          />
        </div>
        <div className="px-2.5 py-2">
          <p className="text-white-100 text-xs font-bold leading-tight truncate">{npc.name}</p>
          <p className="text-xs mt-0.5 truncate font-medium" style={{ color: factionColor }}>
            {npc.faction}
          </p>
        </div>
      </div>
    </>
  )
}

export const npcNodeTypes: NodeTypes = { npc: NpcNode }
