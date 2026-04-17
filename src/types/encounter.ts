export type CR =
  | '0' | '1/8' | '1/4' | '1/2'
  | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'
  | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20'
  | '21' | '22' | '23' | '24' | '25' | '26' | '27' | '28' | '29' | '30'

export type EncounterDifficulty = 'trivial' | 'easy' | 'medium' | 'hard' | 'deadly'

export interface PartyMember {
  id: string
  name: string
  level: number
}

export interface MonsterEntry {
  id: string
  name: string
  cr: CR
  quantity: number
}

export interface DifficultyThresholds {
  easy: number
  medium: number
  hard: number
  deadly: number
}

export interface EncounterResult {
  rawXp: number
  adjustedXp: number
  multiplier: number
  xpPerPlayer: number
  thresholds: DifficultyThresholds
  difficulty: EncounterDifficulty
}
