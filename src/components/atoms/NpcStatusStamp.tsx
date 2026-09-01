import type { CSSProperties } from 'react'
import type { NpcStatus } from '../../types/npc.types'
import {
  NPC_STATUS_LABEL,
  NPC_STATUS_STAMP_COLOR,
  NPC_STATUS_STAMP_ROT,
} from '../../constants/npc.constants'

interface NpcStatusStampProps {
  status: NpcStatus
  animate?: boolean
}

function NpcStatusStamp({ status, animate = true }: NpcStatusStampProps) {
  const color = NPC_STATUS_STAMP_COLOR[status]
  const rot = NPC_STATUS_STAMP_ROT[status]

  return (
    <span
      className={`relative inline-flex shrink-0 items-center border-2 px-2 py-1 font-display text-[11px] font-semibold uppercase leading-none tracking-[0.13em] select-none ${
        animate ? 'dossier-stamp' : ''
      }`}
      style={{ color, borderColor: color, '--stamp-rot': rot } as CSSProperties}
      title={NPC_STATUS_LABEL[status]}
    >
      {NPC_STATUS_LABEL[status]}
      {status === 'morto' && (
        <span
          aria-hidden
          className="absolute inset-x-0.5 top-1/2 h-0.5 -translate-y-1/2 -rotate-[9deg]"
          style={{ background: color }}
        />
      )}
    </span>
  )
}

export default NpcStatusStamp
