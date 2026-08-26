import type { DriveImage } from '../types/image'
import api from './api'

const FOLDER_ID = import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID as string
const THUMBNAIL_SIZE = 'w800'
const FULLSIZE = 'w2000'
export const DEFAULT_IMAGE_CATEGORY = 'Geral'
const FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder'

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

async function fetchAllFiles(query: string): Promise<DriveFile[]> {
  const files: DriveFile[] = []
  let pageToken: string | undefined

  do {
    const { data } = await api.get<DriveFilesResponse>('/files', {
      params: {
        q: query,
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

function fetchSubfolders(folderId: string): Promise<DriveFile[]> {
  return fetchAllFiles(
    `'${folderId}' in parents and mimeType = '${FOLDER_MIME_TYPE}' and trashed = false`,
  )
}

function fetchImagesInFolder(folderId: string): Promise<DriveFile[]> {
  return fetchAllFiles(`'${folderId}' in parents and mimeType contains 'image/' and trashed = false`)
}

function toDriveImage(
  file: DriveFile,
  thumbSize: string,
  fullSize: string,
  category: string,
): DriveImage {
  return {
    id: file.id,
    name: file.name.replace(/\.[^.]+$/, ''),
    url: toImageUrl(file.id, thumbSize),
    fullUrl: toImageUrl(file.id, fullSize),
    category,
  }
}

async function fetchImages(
  folderId: string,
  thumbSize: string,
  fullSize: string,
): Promise<DriveImage[]> {
  const [rootFiles, subfolders] = await Promise.all([
    fetchImagesInFolder(folderId),
    fetchSubfolders(folderId),
  ])

  const rootImages = rootFiles.map((file) => toDriveImage(file, thumbSize, fullSize, DEFAULT_IMAGE_CATEGORY))

  const subfolderImages = await Promise.all(
    subfolders.map(async (folder) => {
      const files = await fetchImagesInFolder(folder.id)
      return files.map((file) => toDriveImage(file, thumbSize, fullSize, folder.name))
    }),
  )

  return [...rootImages, ...subfolderImages.flat()]
}

export const googleDriveService = {
  async getImages(): Promise<DriveImage[]> {
    return fetchImages(FOLDER_ID, THUMBNAIL_SIZE, FULLSIZE)
  },
}
