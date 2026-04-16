import { useEffect } from 'react'
import ChevronLeftIcon from '../atoms/icons/ChevronLeftIcon'
import ChevronRightIcon from '../atoms/icons/ChevronRightIcon'
import XIcon from '../atoms/icons/XIcon'

function Lightbox({ image, onClose, onPrev, onNext }) {
  useEffect(() => {
    const handleKey = (e) => {
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
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white-300 hover:text-white-100 transition-colors"
        aria-label="Fechar"
      >
        <XIcon size={28} />
      </button>

      {onPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          className="absolute left-4 text-white-300 hover:text-white-100 transition-colors p-2"
          aria-label="Anterior"
        >
          <ChevronLeftIcon size={32} />
        </button>
      )}

      <div
        className="relative max-w-5xl max-h-screen px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={image.url}
          alt={image.name}
          className="max-h-[88vh] max-w-full object-contain rounded-lg shadow-2xl"
        />
        {image.name && (
          <p className="text-center text-white-300 text-sm mt-3">{image.name}</p>
        )}
      </div>

      {onNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext() }}
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
