import { useState } from 'react'
import type { DriveImage } from '../types/image'
import Button from '../components/atoms/Button'
import EyeIcon from '../components/atoms/icons/EyeIcon'
import EyeOffIcon from '../components/atoms/icons/EyeOffIcon'
import RefreshIcon from '../components/atoms/icons/RefreshIcon'
import IconButton from '../components/atoms/IconButton'
import GalleryEmpty from '../components/molecules/GalleryEmpty'
import ImageCard from '../components/molecules/ImageCard'
import Lightbox from '../components/organisms/Lightbox'
import { useDriveImages } from '../hooks/useDriveImages'

function Artes() {
  const { images, loading, error, sync } = useDriveImages()
  const [selected, setSelected] = useState<DriveImage | null>(null)
  const [blurred, setBlurred] = useState(false)

  const selectedIndex = images.findIndex((img) => img.id === selected?.id)
  const hasImages = images.length > 0

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
            <IconButton
              title="Sincronizar com Drive"
              onClick={sync}
              disabled={loading}
            >
              <RefreshIcon className={loading ? 'animate-spin' : ''} />
            </IconButton>
          ) : (
            <Button onClick={sync} disabled={loading}>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map((img) => (
            <ImageCard
              key={img.id}
              image={img}
              blurred={blurred}
              dead={img.name.includes('_dead')}
              onClick={setSelected}
            />
          ))}
        </div>
      )}

      {selected && (
        <Lightbox
          image={{ ...selected, url: selected.fullUrl }}
          onClose={() => setSelected(null)}
          onPrev={selectedIndex > 0 ? () => setSelected(images[selectedIndex - 1]) : null}
          onNext={selectedIndex < images.length - 1 ? () => setSelected(images[selectedIndex + 1]) : null}
        />
      )}
    </div>
  )
}

export default Artes
