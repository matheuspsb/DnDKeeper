import type { CR, EncounterDifficulty } from '../types/encounter'

export const CR_OPTIONS: CR[] = [
  '0',
  '1/8',
  '1/4',
  '1/2',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
]

export const CR_XP: Record<CR, number> = {
  '0': 10,
  '1/8': 25,
  '1/4': 50,
  '1/2': 100,
  '1': 200,
  '2': 450,
  '3': 700,
  '4': 1100,
  '5': 1800,
  '6': 2300,
  '7': 2900,
  '8': 3900,
  '9': 5000,
  '10': 5900,
  '11': 7200,
  '12': 8400,
  '13': 10000,
  '14': 11500,
  '15': 13000,
  '16': 15000,
  '17': 18000,
  '18': 20000,
  '19': 22000,
  '20': 25000,
  '21': 33000,
  '22': 41000,
  '23': 50000,
  '24': 62000,
  '25': 75000,
  '26': 90000,
  '27': 105000,
  '28': 120000,
  '29': 135000,
  '30': 155000,
}

// [easy, medium, hard, deadly] per character level
export const THRESHOLDS_PER_LEVEL: [number, number, number, number][] = [
  [25, 50, 75, 100],
  [50, 100, 150, 200],
  [75, 150, 225, 400],
  [125, 250, 375, 500],
  [250, 500, 750, 1100],
  [300, 600, 900, 1400],
  [350, 750, 1100, 1700],
  [450, 900, 1400, 2100],
  [550, 1100, 1600, 2400],
  [600, 1200, 1900, 2800],
  [800, 1600, 2400, 3600],
  [1000, 2000, 3000, 4500],
  [1100, 2200, 3400, 5100],
  [1250, 2500, 3800, 5700],
  [1400, 2800, 4300, 6400],
  [1600, 3200, 4800, 7200],
  [2000, 3900, 5900, 8800],
  [2100, 4200, 6300, 9500],
  [2400, 4900, 7300, 10900],
  [2800, 5700, 8500, 12700],
]

// Multiplier steps indexed 0-5
const MULTIPLIER_STEPS = [1, 1.5, 2, 2.5, 3, 4]

function baseMultiplierIndex(monsterCount: number): number {
  if (monsterCount <= 1) return 0
  if (monsterCount === 2) return 1
  if (monsterCount <= 6) return 2
  if (monsterCount <= 10) return 3
  if (monsterCount <= 14) return 4
  return 5
}

export function getEncounterMultiplier(monsterCount: number, partySize: number): number {
  let index = baseMultiplierIndex(monsterCount)
  if (partySize <= 2) index = Math.min(index + 1, MULTIPLIER_STEPS.length - 1)
  else if (partySize >= 6) index = Math.max(index - 1, 0)
  return MULTIPLIER_STEPS[index]
}

export const DIFFICULTY_LABEL: Record<EncounterDifficulty, string> = {
  trivial: 'Trivial',
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
  deadly: 'Mortal',
}

export const DIFFICULTY_COLOR: Record<EncounterDifficulty, string> = {
  trivial: 'text-white-300',
  easy: 'text-emerald-400',
  medium: 'text-yellow',
  hard: 'text-orange-400',
  deadly: 'text-red-100',
}

export const DIFFICULTY_ORDER: EncounterDifficulty[] = [
  'trivial',
  'easy',
  'medium',
  'hard',
  'deadly',
]

export const DIFFICULTY_BG: Record<EncounterDifficulty, string> = {
  trivial: 'bg-black-200',
  easy: 'bg-emerald-600/20 border-emerald-600/40',
  medium: 'bg-yellow/10 border-yellow/30',
  hard: 'bg-orange-500/20 border-orange-500/40',
  deadly: 'bg-red-100/15 border-red-100/40',
}
