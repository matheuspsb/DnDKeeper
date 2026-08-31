import { resolveImageUrl } from '../../../constants/arts'
import type { Combatant } from '../../../types/initiative'

interface CombatantAvatarProps {
  combatant: Combatant
  className?: string
}

function CombatantAvatar({ combatant, className = '' }: CombatantAvatarProps) {
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-lg bg-black-500 ${className}`}>
      {combatant.imageUrl ? (
        <img
          src={resolveImageUrl(combatant.imageUrl)}
          alt=""
          aria-hidden
          className="h-full w-full object-cover object-top"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-lg text-white-300/30">
          {combatant.name.charAt(0)}
        </span>
      )}
    </div>
  )
}

export default CombatantAvatar
