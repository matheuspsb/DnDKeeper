export function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function formatNumber(value: number): string {
  return value.toLocaleString('pt-BR')
}
