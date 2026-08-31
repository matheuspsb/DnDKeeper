export function formatRelativeTime(deltaMs: number): string {
  const seconds = Math.max(0, Math.round(deltaMs / 1000))
  if (seconds < 5) return 'agora'
  if (seconds < 60) return `há ${seconds}s`
  return `há ${Math.round(seconds / 60)} min`
}
