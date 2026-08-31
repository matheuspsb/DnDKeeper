export function hpPercent(currentHp: number, maxHp: number): number {
  if (maxHp <= 0) return 0
  return Math.max(0, Math.min(100, Math.round((currentHp / maxHp) * 100)))
}

export function resolveHpBarColor(hpPercentage: number): string {
  if (hpPercentage > 75) return '#22c55e'
  if (hpPercentage > 25) return '#ECC83B'
  return '#D72334'
}
