interface CombatantConditionsProps {
  conditions: string[] | undefined
  size?: 'sm' | 'lg'
  className?: string
}

const STYLES = {
  sm: 'gap-1 [&>span]:rounded [&>span]:px-1.5 [&>span]:py-0.5 [&>span]:text-[10px] [&>span]:leading-tight',
  lg: 'gap-2 [&>span]:rounded-md [&>span]:px-2.5 [&>span]:py-1 [&>span]:text-sm',
} as const

function CombatantConditions({
  conditions,
  size = 'sm',
  className = '',
}: CombatantConditionsProps) {
  if (!conditions || conditions.length === 0) return null

  return (
    <div className={`flex flex-wrap ${STYLES[size]} ${className}`}>
      {conditions.map((condition) => (
        <span key={condition} className="bg-amber-500/20 font-semibold text-amber-400">
          {condition}
        </span>
      ))}
    </div>
  )
}

export default CombatantConditions
