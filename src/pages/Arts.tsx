import { useMemo, useState } from 'react'
import type { DriveImage } from '../types/image'
import Button from '../components/atoms/Button'
import EyeIcon from '../components/atoms/icons/EyeIcon'
import EyeOffIcon from '../components/atoms/icons/EyeOffIcon'
import RefreshIcon from '../components/atoms/icons/RefreshIcon'
import IconButton from '../components/atoms/IconButton'
import GalleryCategorySection from '../components/molecules/gallery/GalleryCategorySection'
import GalleryEmpty from '../components/molecules/gallery/GalleryEmpty'
import Lightbox from '../components/organisms/Lightbox'
import { useDriveImages } from '../hooks/useDriveImages'
import { useInitiative } from '../hooks/useInitiative'
import { useAuth } from '../contexts/AuthContext'
import { DEFAULT_IMAGE_CATEGORY } from '../services/googleDrive'

function Artes() {
  const { images, loading, error, sync } = useDriveImages()
  const { user } = useAuth()
  const { spotlight, setSpotlight } = useInitiative()
  const [selected, setSelected] = useState<DriveImage | null>(null)
  const [blurred, setBlurred] = useState(false)

  const isDm = user?.role === 'dm'

  function castImage(image: DriveImage) {
    const alreadyCast = spotlight?.url === image.fullUrl
    setSpotlight(alreadyCast ? null : { url: image.fullUrl, label: image.name })
  }

  const selectedIndex = images.findIndex((img) => img.id === selected?.id)
  const hasImages = images.length > 0

  const groupedByCategory = useMemo(() => {
    const categories = Array.from(new Set(images.map((img) => img.category))).sort((a, b) => {
      if (a === DEFAULT_IMAGE_CATEGORY) return 1
      if (b === DEFAULT_IMAGE_CATEGORY) return -1
      return a.localeCompare(b)
    })

    return categories.map((category) => ({
      category,
      images: images.filter((img) => img.category === category),
    }))
  }, [images])

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
            <IconButton title="Sincronizar com Drive" onClick={sync} disabled={loading}>
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
        <div className="flex flex-col gap-10">
          {groupedByCategory.map(({ category, images: categoryImages }) => (
            <GalleryCategorySection
              key={category}
              category={category}
              images={categoryImages}
              blurred={blurred}
              onImageClick={setSelected}
              onCast={isDm ? castImage : undefined}
              castUrl={spotlight?.url ?? null}
            />
          ))}
        </div>
      )}

      {selected && (
        <Lightbox
          image={{ ...selected, url: selected.fullUrl }}
          onClose={() => setSelected(null)}
          onPrev={selectedIndex > 0 ? () => setSelected(images[selectedIndex - 1]) : null}
          onNext={
            selectedIndex < images.length - 1 ? () => setSelected(images[selectedIndex + 1]) : null
          }
          onCast={isDm ? () => castImage(selected) : undefined}
          isCast={spotlight?.url === selected.fullUrl}
        />
      )}
    </div>
  )
}

export default Artes
