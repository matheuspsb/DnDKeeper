export const XP_THRESHOLDS: number[] = [
  0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000, 120000, 140000, 165000,
  195000, 225000, 265000, 305000, 355000,
]

export function getLevel(xp: number): number {
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= XP_THRESHOLDS[i]) return i + 1
  }
  return 1
}

export interface XpProgress {
  level: number
  xpIntoLevel: number
  xpNeeded: number
  percentage: number
  isMaxLevel: boolean
}

export function getXpProgress(xp: number): XpProgress {
  const level = getLevel(xp)

  if (level === 20) {
    return {
      level,
      xpIntoLevel: xp - XP_THRESHOLDS[19],
      xpNeeded: 0,
      percentage: 100,
      isMaxLevel: true,
    }
  }

  const currentThreshold = XP_THRESHOLDS[level - 1]
  const nextThreshold = XP_THRESHOLDS[level]
  const xpIntoLevel = xp - currentThreshold
  const xpNeeded = nextThreshold - currentThreshold
  const percentage = Math.min(100, Math.max(0, (xpIntoLevel / xpNeeded) * 100))

  return { level, xpIntoLevel, xpNeeded, percentage, isMaxLevel: false }
}
