import { useEffect } from 'react'
import type { DriveImage } from '../../types/image'
import { stripImageFlags } from '../../utils/image'
import ChevronLeftIcon from '../atoms/icons/ChevronLeftIcon'
import ChevronRightIcon from '../atoms/icons/ChevronRightIcon'
import MonitorIcon from '../atoms/icons/MonitorIcon'
import XIcon from '../atoms/icons/XIcon'

interface LightboxProps {
  image: DriveImage
  onClose: () => void
  onPrev: (() => void) | null
  onNext: (() => void) | null
  onCast?: () => void
  isCast?: boolean
}

function Lightbox({ image, onClose, onPrev, onNext, onCast, isCast = false }: LightboxProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && onPrev) onPrev()
      if (e.key === 'ArrowRight' && onNext) onNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, onPrev, onNext])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {onCast && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onCast()
            }}
            title={isCast ? 'Parar de exibir na mesa' : 'Exibir na mesa'}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              isCast
                ? 'bg-red-100 text-white hover:bg-red-200'
                : 'bg-white/10 text-white-200 hover:bg-white/20'
            }`}
          >
            <MonitorIcon size={16} />
            {isCast ? 'Na mesa' : 'Exibir na mesa'}
          </button>
        )}
        <button
          onClick={onClose}
          className="text-white-300 hover:text-white-100 transition-colors"
          aria-label="Fechar"
        >
          <XIcon size={28} />
        </button>
      </div>

      {onPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPrev()
          }}
          className="absolute left-4 text-white-300 hover:text-white-100 transition-colors p-2"
          aria-label="Anterior"
        >
          <ChevronLeftIcon size={32} />
        </button>
      )}

      <div className="relative max-w-5xl max-h-screen px-16" onClick={(e) => e.stopPropagation()}>
        <img
          src={image.url}
          alt={image.name}
          className="max-h-[88vh] max-w-full object-contain rounded-lg shadow-2xl"
        />
        {image.name && (
          <p className="text-center text-white-300 text-sm mt-3">{stripImageFlags(image.name)}</p>
        )}
      </div>

      {onNext && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          className="absolute right-4 text-white-300 hover:text-white-100 transition-colors p-2"
          aria-label="Próximo"
        >
          <ChevronRightIcon size={32} />
        </button>
      )}
    </div>
  )
}

export default Lightbox
