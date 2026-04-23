import { NPC_STATUS_COLOR, NPC_STATUS_LABEL } from '../../constants/npc.constants'
import type { NpcStatus } from '../../types/npc.types'

interface StatusDotProps {
  status: NpcStatus
}

function StatusDot({ status }: StatusDotProps) {
  const color = NPC_STATUS_COLOR[status]
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="inline-block w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs text-white-300">{NPC_STATUS_LABEL[status]}</span>
    </span>
  )
}

export default StatusDot
