export interface Combatant {
  id: string
  name: string
  initiative: number
  hp: number | null
  maxHp: number | null
  isPlayer: boolean
  imageUrl?: string
}

export type CombatantStatus = 'current' | 'pending' | 'done'
