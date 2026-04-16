import { useRef, useState } from 'react'
import Button from '../components/atoms/Button'
import EyeIcon from '../components/atoms/icons/EyeIcon'
import EyeOffIcon from '../components/atoms/icons/EyeOffIcon'
import IconButton from '../components/atoms/IconButton'
import GalleryEmpty from '../components/molecules/GalleryEmpty'
import ImageCard from '../components/molecules/ImageCard'
import Lightbox from '../components/organisms/Lightbox'

function Artes() {
  const [images, setImages] = useState([])
  const [selected, setSelected] = useState(null)
  const [blurred, setBlurred] = useState(false)
  const inputRef = useRef(null)

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      name: file.name.replace(/\.[^.]+$/, ''),
    }))
    setImages((prev) => [...prev, ...newImages])
    e.target.value = ''
  }

  const selectedIndex = images.findIndex((img) => img.id === selected?.id)

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-white-100 text-3xl font-bold">Artes</h2>

        <div className="flex items-center gap-3">
          {images.length > 0 && (
            <IconButton
              active={blurred}
              title={blurred ? 'Revelar imagens' : 'Ocultar imagens'}
              onClick={() => setBlurred((b) => !b)}
            >
              {blurred ? <EyeOffIcon /> : <EyeIcon />}
            </IconButton>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleAddImages}
          />
          <Button onClick={() => inputRef.current.click()}>Adicionar imagens</Button>
        </div>
      </div>

      {images.length === 0 ? (
        <GalleryEmpty message="Nenhuma arte adicionada ainda." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map((img) => (
            <ImageCard
              key={img.id}
              image={img}
              blurred={blurred}
              onClick={setSelected}
            />
          ))}
        </div>
      )}

      {selected && (
        <Lightbox
          image={selected}
          onClose={() => setSelected(null)}
          onPrev={selectedIndex > 0 ? () => setSelected(images[selectedIndex - 1]) : null}
          onNext={selectedIndex < images.length - 1 ? () => setSelected(images[selectedIndex + 1]) : null}
        />
      )}
    </div>
  )
}

export default Artes
