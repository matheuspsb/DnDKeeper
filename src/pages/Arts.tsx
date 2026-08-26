import { useState } from 'react'
import type { DriveImage } from '../types/image'
import Button from '../components/atoms/Button'
import ChevronLeftIcon from '../components/atoms/icons/ChevronLeftIcon'
import ChevronRightIcon from '../components/atoms/icons/ChevronRightIcon'
import EyeIcon from '../components/atoms/icons/EyeIcon'
import EyeOffIcon from '../components/atoms/icons/EyeOffIcon'
import RefreshIcon from '../components/atoms/icons/RefreshIcon'
import IconButton from '../components/atoms/IconButton'
import GalleryEmpty from '../components/molecules/gallery/GalleryEmpty'
import ImageCard from '../components/molecules/gallery/ImageCard'
import Lightbox from '../components/organisms/Lightbox'
import { useDriveImages } from '../hooks/useDriveImages'

const PAGE_SIZE = 50

function Artes() {
  const { images, loading, error, sync } = useDriveImages()
  const [selected, setSelected] = useState<DriveImage | null>(null)
  const [blurred, setBlurred] = useState(false)
  const [page, setPage] = useState(0)

  const selectedIndex = images.findIndex((img) => img.id === selected?.id)
  const hasImages = images.length > 0
  const pageCount = Math.ceil(images.length / PAGE_SIZE)
  const pagedImages = images.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  const handleSync = async () => {
    setPage(0)
    await sync()
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-white-100 text-3xl font-bold">Artes</h2>

        <div className="flex items-center gap-3">
          {hasImages && (
            <IconButton
              active={blurred}
              title={blurred ? 'Revelar imagens' : 'Ocultar imagens'}
              onClick={() => setBlurred((b) => !b)}
            >
              {blurred ? <EyeOffIcon /> : <EyeIcon />}
            </IconButton>
          )}

          {hasImages ? (
            <IconButton title="Sincronizar com Drive" onClick={handleSync} disabled={loading}>
              <RefreshIcon className={loading ? 'animate-spin' : ''} />
            </IconButton>
          ) : (
            <Button onClick={handleSync} disabled={loading}>
              {loading ? 'Sincronizando...' : 'Sincronizar com Drive'}
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-center mt-24 text-red-100 text-sm">
          Erro ao carregar imagens: {error}
        </div>
      )}

      {!loading && !error && !hasImages && (
        <GalleryEmpty message="Nenhuma arte encontrada. Clique em Sincronizar para carregar do Drive." />
      )}

      {loading && !hasImages && (
        <div className="flex items-center justify-center mt-24 text-white-300 text-sm">
          Sincronizando imagens...
        </div>
      )}

      {hasImages && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {pagedImages.map((img) => (
              <ImageCard
                key={img.id}
                image={img}
                blurred={blurred}
                dead={img.name.includes('_dead')}
                onClick={setSelected}
              />
            ))}
          </div>

          {pageCount > 1 && (
            <div className="flex items-center justify-center gap-4">
              <IconButton
                title="Página anterior"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                <ChevronLeftIcon />
              </IconButton>

              <span className="text-white-300 text-sm">
                Página {page + 1} de {pageCount}
              </span>

              <IconButton
                title="Próxima página"
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                disabled={page >= pageCount - 1}
              >
                <ChevronRightIcon />
              </IconButton>
            </div>
          )}
        </>
      )}

      {selected && (
        <Lightbox
          image={{ ...selected, url: selected.fullUrl }}
          onClose={() => setSelected(null)}
          onPrev={selectedIndex > 0 ? () => setSelected(images[selectedIndex - 1]) : null}
          onNext={
            selectedIndex < images.length - 1 ? () => setSelected(images[selectedIndex + 1]) : null
          }
        />
      )}
    </div>
  )
}

export default Artes
