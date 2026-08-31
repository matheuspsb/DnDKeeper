export interface Combatant {
  id: string
  name: string
  initiative: number
  hp: number | null
  maxHp: number | null
  isPlayer: boolean
  imageUrl?: string
  characterId?: string
  conditions?: string[]
  hpRevealed?: boolean
}

export type CombatantStatus = 'current' | 'pending' | 'done'
