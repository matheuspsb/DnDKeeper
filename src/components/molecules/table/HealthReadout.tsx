import { resolveHpBarColor } from '../../../utils/character'
import { getHealthBand } from '../../../constants/initiative'
import {
  combatantHpPercent,
  combatantKindLabel,
  isCombatantHpHidden,
} from '../../../utils/initiative'
import type { Combatant } from '../../../types/initiative'

interface HealthReadoutProps {
  combatant: Combatant
  variant: 'card' | 'hero'
}

function HealthReadout({ combatant, variant }: HealthReadoutProps) {
  const pct = combatantHpPercent(combatant)
  const isHero = variant === 'hero'

  if (pct === null) {
    return isHero ? null : (
      <span className="mt-1 block text-xs text-white-300/40">{combatantKindLabel(combatant)}</span>
    )
  }

  if (isCombatantHpHidden(combatant)) {
    const band = getHealthBand(pct)
    return isHero ? (
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium uppercase tracking-wide text-white-300/50">
          Estado
        </span>
        <span
          className="text-3xl font-bold uppercase tracking-wide md:text-4xl"
          style={{ color: band.color }}
        >
          {band.label}
        </span>
      </div>
    ) : (
      <div className="mt-1.5 flex items-center justify-between text-xs">
        <span className="font-semibold uppercase tracking-wide" style={{ color: band.color }}>
          {band.label}
        </span>
        <span className="text-white-300/40">Monstro</span>
      </div>
    )
  }

  const color = resolveHpBarColor(pct)

  if (isHero) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-end justify-between">
          <span className="text-sm font-medium uppercase tracking-wide text-white-300/50">
            Pontos de vida
          </span>
          <span className="tabular-nums text-3xl font-bold md:text-4xl" style={{ color }}>
            {combatant.hp} <span className="text-xl text-white-300/40">/ {combatant.maxHp}</span>
          </span>
        </div>
        <div className="h-4 w-full overflow-hidden rounded-full bg-black-500">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mt-1.5 flex items-center justify-between text-xs">
        <span className="tabular-nums font-semibold" style={{ color }}>
          {combatant.hp} / {combatant.maxHp}
        </span>
        <span className="text-white-300/40">{combatantKindLabel(combatant)}</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-black-500">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </>
  )
}

export default HealthReadout
