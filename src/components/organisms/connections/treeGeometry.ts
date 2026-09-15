export function getSpreadPosition(
  parentAcross: number,
  index: number,
  count: number,
  spacing: number,
): number {
  return parentAcross + (index - (count - 1) / 2) * spacing
}
