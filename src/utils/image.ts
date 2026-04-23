export function stripImageFlags(name: string): string {
  return name
    .replace(/_dead/gi, '')
    .replace(/\.[^.]+$/, '')
    .trim()
}
