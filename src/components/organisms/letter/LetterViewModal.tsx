import type { Letter } from '../../../types/letter'
import XIcon from '../../atoms/icons/XIcon'

interface LetterViewModalProps {
  letter: Letter
  onClose: () => void
}

function LetterViewModal({ letter, onClose }: LetterViewModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
      onClick={onClose}
    >
      <div className="parchment w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="relative z-10 max-h-[85vh] overflow-y-auto">
          <div className="flex items-start justify-between px-7 pt-6 pb-4 border-b border-[#9b6b32]/35 gap-4">
            <div>
              <h2 className="text-[#2c1506] font-bold text-xl leading-tight tracking-wide">
                {letter.title}
              </h2>
              {letter.recipient && (
                <p className="text-[#6b4220]/75 text-xs italic mt-1">Para: {letter.recipient}</p>
              )}
              <p className="text-[#3d1e06] text-xs italic mt-0.5">
                Encontrada em: {letter.foundAt}
              </p>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 text-[#3d1e06] hover:text-black transition-colors mt-0.5"
            >
              <XIcon size={20} />
            </button>
          </div>
          <div className="px-7 py-6 flex flex-col gap-3">
            {letter.writtenAt && (
              <p className="text-[#3a1e08]/70 text-xs italic text-right font-serif">
                {letter.writtenAt}
              </p>
            )}
            <p className="text-[#3a1e08] text-sm leading-7 whitespace-pre-wrap font-serif">
              {letter.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LetterViewModal
