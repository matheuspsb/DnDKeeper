import ImageIcon from '../atoms/icons/ImageIcon'

interface GalleryEmptyProps {
  message?: string
}

function GalleryEmpty({ message = 'Nenhum item adicionado ainda.' }: GalleryEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-24 text-white-300">
      <ImageIcon size={48} strokeWidth={1.5} />
      <p className="text-sm">{message}</p>
    </div>
  )
}

export default GalleryEmpty
