export interface Combatant {
  id: string
  name: string
  initiative: number
  hp: number | null
  maxHp: number | null
  isPlayer: boolean
}

export type CombatantStatus = 'current' | 'pending' | 'done'
