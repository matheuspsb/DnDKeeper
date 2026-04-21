import deadWatermark from '../../assets/watermarks/dead.png'
import type { DriveImage } from '../../types/image'
import ExpandIcon from '../atoms/icons/ExpandIcon'

interface ImageCardProps {
  image: DriveImage
  blurred: boolean
  dead?: boolean
  onClick: (image: DriveImage) => void
}

function ImageCard({ image, blurred, dead = false, onClick }: ImageCardProps) {
  return (
    <button
      onClick={() => onClick(image)}
      className="group relative aspect-square overflow-hidden rounded-lg bg-black-300 focus:outline-none focus:ring-2 focus:ring-red-100"
    >
      <img
        src={image.url}
        alt={image.name}
        className={`h-full w-full object-cover transition-all duration-300 group-hover:scale-105 ${blurred ? 'blur-xl' : ''} ${dead ? 'grayscale brightness-75' : ''}`}
      />
      {dead && (
        <img
          src={deadWatermark}
          alt="morto"
          className="absolute -top-8 left-2 w-40 h-40 object-contain pointer-events-none"
        />
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
        <ExpandIcon className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 stroke-white" />
      </div>
    </button>
  )
}

export default ImageCard
