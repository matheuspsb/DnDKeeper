export function resolveHpBarColor(hpPercentage: number): string {
  if (hpPercentage > 75) return '#22c55e'
  if (hpPercentage > 25) return '#ECC83B'
  return '#D72334'
}
