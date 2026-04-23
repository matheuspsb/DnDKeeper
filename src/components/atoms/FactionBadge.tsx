import { FACTION_COLOR } from '../../constants/npc.constants'
import type { Faction } from '../../types/npc.types'

interface FactionBadgeProps {
  faction: Faction
}

function FactionBadge({ faction }: FactionBadgeProps) {
  const color = FACTION_COLOR[faction]
  return (
    <span
      className="text-xs font-semibold px-2 py-0.5 rounded-full border"
      style={{
        color,
        borderColor: `${color}40`,
        backgroundColor: `${color}18`,
      }}
    >
      {faction}
    </span>
  )
}

export default FactionBadge
