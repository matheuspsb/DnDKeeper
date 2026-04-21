import type { DriveImage } from '../types/image'
import api from './api'

const FOLDER_ID = import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID as string
const THUMBNAIL_SIZE = 'w800'
const FULLSIZE = 'w2000'

interface DriveFile {
  id: string
  name: string
}

interface DriveFilesResponse {
  files: DriveFile[]
}

function toImageUrl(id: string, size: string): string {
  const base = import.meta.env.DEV
    ? '/drive-img'
    : 'https://drive.google.com/thumbnail'
  return `${base}?id=${id}&sz=${size}`
}


async function fetchImages(folderId: string, thumbSize: string, fullSize: string): Promise<DriveImage[]> {
  const { data } = await api.get<DriveFilesResponse>('/files', {
    params: {
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
      fields: 'files(id,name)',
      pageSize: 100,
    },
  })
  return data.files.map((file) => ({
    id: file.id,
    name: file.name.replace(/\.[^.]+$/, ''),
    url: toImageUrl(file.id, thumbSize),
    fullUrl: toImageUrl(file.id, fullSize),
  }))
}

export const googleDriveService = {
  async getImages(): Promise<DriveImage[]> {
    return fetchImages(FOLDER_ID, THUMBNAIL_SIZE, FULLSIZE)
  },

}
