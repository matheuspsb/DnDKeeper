const modules = import.meta.glob<{ default: string }>('../assets/arts/*', { eager: true })

export interface LocalArt {
  key: string
  name: string
  url: string
}

export const LOCAL_ARTS: LocalArt[] = Object.entries(modules).map(([path, mod]) => {
  const filename = path.split('/').pop()!
  return {
    key: filename,
    name: filename.replace(/\.[^.]+$/, ''),
    url: mod.default,
  }
})

export const LOCAL_ART_PREFIX = 'local:'

/**
 * Resolve imageUrl para a URL real usada no <img src>.
 * - "local:1_dante.jpeg"         → URL com hash do Vite
 * - "/src/assets/arts/1_dante.jpeg" → fallback para JSONs exportados antes da correção
 * - qualquer outra string        → retorna como está (URL externa)
 */
export function resolveImageUrl(imageUrl: string): string {
  if (imageUrl.startsWith(LOCAL_ART_PREFIX)) {
    const key = imageUrl.slice(LOCAL_ART_PREFIX.length)
    return LOCAL_ARTS.find(a => a.key === key)?.url ?? ''
  }

  if (imageUrl.startsWith('/src/assets/arts/')) {
    const filename = imageUrl.split('/').pop()!
    return LOCAL_ARTS.find(a => a.key === filename)?.url ?? ''
  }

  return imageUrl
}

export function toLocalArtUrl(key: string): string {
  return `${LOCAL_ART_PREFIX}${key}`
}
