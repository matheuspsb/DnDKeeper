import { resolveDriveUrl } from '../utils/driveUrl'

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

export function resolveImageUrl(imageUrl: string): string {
  if (imageUrl.startsWith(LOCAL_ART_PREFIX)) {
    const key = imageUrl.slice(LOCAL_ART_PREFIX.length)
    return LOCAL_ARTS.find((a) => a.key === key)?.url ?? ''
  }

  if (imageUrl.startsWith('/src/assets/arts/')) {
    const filename = imageUrl.split('/').pop()!
    return LOCAL_ARTS.find((a) => a.key === filename)?.url ?? ''
  }

  return resolveDriveUrl(imageUrl)
}

export function toLocalArtUrl(key: string): string {
  return `${LOCAL_ART_PREFIX}${key}`
}

export { resolveDriveUrl }
