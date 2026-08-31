import type { Combatant } from '../types/initiative'
import { hpPercent } from './character'

export function combatantHpPercent(combatant: Combatant): number | null {
  if (combatant.hp === null || combatant.maxHp === null || combatant.maxHp <= 0) return null
  return hpPercent(combatant.hp, combatant.maxHp)
}

export function isCombatantHpHidden(combatant: Combatant): boolean {
  return !combatant.isPlayer && !combatant.hpRevealed
}

export function combatantKindLabel(combatant: Combatant, long = false): string {
  if (combatant.isPlayer) return long ? 'Personagem' : 'PC'
  return 'Monstro'
}
