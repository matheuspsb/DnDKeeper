const modules = import.meta.glob<{ default: string }>('../assets/arts/*', { eager: true })

export interface LocalArt {
  name: string
  url: string
}

export const LOCAL_ARTS: LocalArt[] = Object.entries(modules).map(([path, mod]) => ({
  name: path.split('/').pop()!.replace(/\.[^.]+$/, ''),
  url: mod.default,
}))
