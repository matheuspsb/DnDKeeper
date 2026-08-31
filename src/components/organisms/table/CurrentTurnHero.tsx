import { resolveImageUrl } from '../../../constants/arts'
import { combatantKindLabel } from '../../../utils/initiative'
import CombatantConditions from '../../molecules/table/CombatantConditions'
import HealthReadout from '../../molecules/table/HealthReadout'
import type { Combatant } from '../../../types/initiative'

interface CurrentTurnHeroProps {
  combatant: Combatant
}

function CurrentTurnHero({ combatant }: CurrentTurnHeroProps) {
  return (
    <div className="mt-6 rounded-2xl p-0.5 current-turn-border">
      <div className="relative overflow-hidden rounded-[14px] bg-black-300">
        {combatant.imageUrl && (
          <div className="absolute inset-0">
            <img
              src={resolveImageUrl(combatant.imageUrl)}
              alt=""
              aria-hidden
              className="h-full w-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-black-500/60" />
          </div>
        )}

        <div className="relative z-10 flex flex-col gap-5 p-6 md:p-9">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-red-100">
            Turno atual
          </span>

          <div>
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">{combatant.name}</h1>
            <p className="mt-1 text-sm uppercase tracking-wide text-white-300/50">
              {combatantKindLabel(combatant, true)} · iniciativa {combatant.initiative}
            </p>
          </div>

          <CombatantConditions conditions={combatant.conditions} size="lg" />

          <HealthReadout combatant={combatant} variant="hero" />
        </div>
      </div>
    </div>
  )
}

export default CurrentTurnHero
