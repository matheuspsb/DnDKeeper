export function formatRelativeTime(deltaMs: number): string {
  const seconds = Math.max(0, Math.round(deltaMs / 1000))
  if (seconds < 5) return 'agora'
  if (seconds < 60) return `há ${seconds}s`
  return `há ${Math.round(seconds / 60)} min`
}

export function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date
    .toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    .replace('.', '')
    .toLowerCase()
}

export function formatTimestamp(ms: number): string {
  const date = new Date(ms)
  if (Number.isNaN(date.getTime())) return ''
  const isToday = date.toDateString() === new Date().toDateString()
  if (isToday) return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
