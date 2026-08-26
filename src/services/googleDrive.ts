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
  nextPageToken?: string
}

export function toImageUrl(id: string, size: string): string {
  return `/drive-img?id=${id}&sz=${size}`
}

async function fetchAllFiles(folderId: string): Promise<DriveFile[]> {
  const files: DriveFile[] = []
  let pageToken: string | undefined

  do {
    const { data } = await api.get<DriveFilesResponse>('/files', {
      params: {
        q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
        fields: 'nextPageToken, files(id,name)',
        pageSize: 100,
        pageToken,
      },
    })
    files.push(...data.files)
    pageToken = data.nextPageToken
  } while (pageToken)

  return files
}

async function fetchImages(
  folderId: string,
  thumbSize: string,
  fullSize: string,
): Promise<DriveImage[]> {
  const files = await fetchAllFiles(folderId)
  return files.map((file) => ({
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
