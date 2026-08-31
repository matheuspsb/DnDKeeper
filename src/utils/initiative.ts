import type { Combatant } from '../types/initiative'

export function combatantHpPercent(combatant: Combatant): number | null {
  if (combatant.hp === null || combatant.maxHp === null || combatant.maxHp <= 0) return null
  return Math.max(0, Math.min(100, Math.round((combatant.hp / combatant.maxHp) * 100)))
}

export function isCombatantHpHidden(combatant: Combatant): boolean {
  return !combatant.isPlayer && !combatant.hpRevealed
}

export function combatantKindLabel(combatant: Combatant, long = false): string {
  if (combatant.isPlayer) return long ? 'Personagem' : 'PC'
  return 'Monstro'
}
