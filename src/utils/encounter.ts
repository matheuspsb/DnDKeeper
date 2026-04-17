import type { EncounterDifficulty, EncounterResult, DifficultyThresholds, PartyMember, MonsterEntry } from '../types/encounter'
import { CR_XP, THRESHOLDS_PER_LEVEL, getEncounterMultiplier } from '../constants/encounter'

export function getThresholdsForLevel(level: number): [number, number, number, number] {
  return THRESHOLDS_PER_LEVEL[Math.max(1, Math.min(20, level)) - 1]
}

export function calculatePartyThresholds(party: PartyMember[]): DifficultyThresholds {
  return party.reduce(
    (acc, member) => {
      const [easy, medium, hard, deadly] = getThresholdsForLevel(member.level)
      return {
        easy: acc.easy + easy,
        medium: acc.medium + medium,
        hard: acc.hard + hard,
        deadly: acc.deadly + deadly,
      }
    },
    { easy: 0, medium: 0, hard: 0, deadly: 0 },
  )
}

export function getDifficulty(adjustedXp: number, thresholds: DifficultyThresholds): EncounterDifficulty {
  if (adjustedXp <= 0 || thresholds.easy === 0) return 'trivial'
  if (adjustedXp < thresholds.easy) return 'trivial'
  if (adjustedXp < thresholds.medium) return 'easy'
  if (adjustedXp < thresholds.hard) return 'medium'
  if (adjustedXp < thresholds.deadly) return 'hard'
  return 'deadly'
}

export function calculateEncounter(party: PartyMember[], monsters: MonsterEntry[]): EncounterResult {
  const rawXp = monsters.reduce((sum, m) => sum + CR_XP[m.cr] * m.quantity, 0)
  const totalMonsters = monsters.reduce((sum, m) => sum + m.quantity, 0)
  const multiplier = getEncounterMultiplier(totalMonsters, party.length)
  const adjustedXp = Math.round(rawXp * multiplier)
  const thresholds = calculatePartyThresholds(party)
  const difficulty = getDifficulty(adjustedXp, thresholds)
  const xpPerPlayer = party.length > 0 ? Math.round(rawXp / party.length) : 0

  return { rawXp, adjustedXp, multiplier, xpPerPlayer, thresholds, difficulty }
}
