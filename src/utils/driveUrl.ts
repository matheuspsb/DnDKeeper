const DRIVE_ID_RE = /\/d\/([a-zA-Z0-9_-]+)/

export const DRIVE_THUMB_SIZE = 'w800'
export const DRIVE_FULL_SIZE = 'w2000'

export function driveIdFromUrl(url: string): string | null {
  return url.match(DRIVE_ID_RE)?.[1] ?? null
}

export function driveImageUrl(id: string, size: string = DRIVE_THUMB_SIZE): string {
  return `/drive-img?id=${id}&sz=${size}`
}

export function resolveDriveUrl(url: string): string {
  const id = driveIdFromUrl(url)
  return id ? driveImageUrl(id) : url
}
