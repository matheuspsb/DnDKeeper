import { useState } from 'react'
import type { DriveImage } from '../../../types/image'
import ChevronLeftIcon from '../../atoms/icons/ChevronLeftIcon'
import ChevronRightIcon from '../../atoms/icons/ChevronRightIcon'
import IconButton from '../../atoms/IconButton'
import ImageCard from './ImageCard'

const PAGE_SIZE = 50

interface GalleryCategorySectionProps {
  category: string
  images: DriveImage[]
  blurred: boolean
  onImageClick: (image: DriveImage) => void
  onCast?: (image: DriveImage) => void
  castUrl?: string | null
}

function GalleryCategorySection({
  category,
  images,
  blurred,
  onImageClick,
  onCast,
  castUrl,
}: GalleryCategorySectionProps) {
  const [page, setPage] = useState(0)

  const pageCount = Math.ceil(images.length / PAGE_SIZE)
  const currentPage = pageCount === 0 ? 0 : Math.min(page, pageCount - 1)
  const pagedImages = images.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE)

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-white-100 text-lg font-semibold tracking-wide">{category}</span>
        <div className="flex-1 h-px bg-black-200" />
        <span className="text-white-300/40 text-xs">{images.length}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {pagedImages.map((img) => (
          <ImageCard
            key={img.id}
            image={img}
            blurred={blurred}
            dead={img.name.includes('_dead')}
            onClick={onImageClick}
            onCast={onCast}
            isCast={!!castUrl && castUrl === img.fullUrl}
          />
        ))}
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <IconButton
            title="Página anterior"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
          >
            <ChevronLeftIcon />
          </IconButton>

          <span className="text-white-300 text-sm">
            Página {currentPage + 1} de {pageCount}
          </span>

          <IconButton
            title="Próxima página"
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={currentPage >= pageCount - 1}
          >
            <ChevronRightIcon />
          </IconButton>
        </div>
      )}
    </div>
  )
}

export default GalleryCategorySection
