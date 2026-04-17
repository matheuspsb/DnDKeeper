export function pickRandom<T>(entries: T[]): T {
  return entries[Math.floor(Math.random() * entries.length)]
}
