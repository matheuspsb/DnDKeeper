import deadWatermark from '../../../assets/watermarks/dead.png'
import type { DriveImage } from '../../../types/image'
import ExpandIcon from '../../atoms/icons/ExpandIcon'
import MonitorIcon from '../../atoms/icons/MonitorIcon'

interface ImageCardProps {
  image: DriveImage
  blurred: boolean
  dead?: boolean
  onClick: (image: DriveImage) => void
  onCast?: (image: DriveImage) => void
  isCast?: boolean
}

function ImageCard({
  image,
  blurred,
  dead = false,
  onClick,
  onCast,
  isCast = false,
}: ImageCardProps) {
  return (
    <div className="group relative aspect-square overflow-hidden rounded-lg bg-black-300">
      <button
        onClick={() => onClick(image)}
        className="absolute inset-0 focus:outline-none focus:ring-2 focus:ring-red-100"
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

      {onCast && (
        <button
          onClick={() => onCast(image)}
          title={isCast ? 'Parar de exibir na mesa' : 'Exibir na mesa'}
          className={`absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-md transition-all ${
            isCast
              ? 'bg-red-100 text-white opacity-100'
              : 'bg-black/60 text-white opacity-0 hover:bg-black/80 group-hover:opacity-100'
          }`}
        >
          <MonitorIcon size={15} />
        </button>
      )}

      {isCast && (
        <span className="absolute bottom-2 left-2 z-10 rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white">
          NA MESA
        </span>
      )}
    </div>
  )
}

export default ImageCard
