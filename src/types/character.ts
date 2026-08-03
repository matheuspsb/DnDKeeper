export interface Character {
  id: string
  name: string
  playerName: string
  characterClass: string
  race: string
  currentHP: number
  maxHP: number
  xp: number
  imageUrl?: string
  notes: string
}
