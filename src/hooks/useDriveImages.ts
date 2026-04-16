import { useCallback, useState } from 'react'
import type { DriveImage } from '../types/image'
import { googleDriveService } from '../services/googleDrive'

interface UseDriveImagesResult {
  images: DriveImage[]
  loading: boolean
  error: string | null
  sync: () => Promise<void>
}

export function useDriveImages(): UseDriveImagesResult {
  const [images, setImages] = useState<DriveImage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sync = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await googleDriveService.getImages()
      setImages(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  return { images, loading, error, sync }
}
