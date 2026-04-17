interface TypeBadgeProps {
  isPlayer: boolean
}

function TypeBadge({ isPlayer }: TypeBadgeProps) {
  return isPlayer ? (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow/15 text-yellow border border-yellow/30">
      PC
    </span>
  ) : (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-400/20 text-red-100 border border-red-400/40">
      Monstro
    </span>
  )
}

export default TypeBadge
