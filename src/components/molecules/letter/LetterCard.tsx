import { useState } from 'react'
import type { Letter } from '../../../types/letter'
import EyeIcon from '../../atoms/icons/EyeIcon'
import PencilIcon from '../../atoms/icons/PencilIcon'
import TrashIcon from '../../atoms/icons/TrashIcon'

interface LetterCardProps {
  letter: Letter
  isDm: boolean
  onView: (letter: Letter) => void
  onEdit: (letter: Letter) => void
  onDelete: (id: string) => void
}

function LetterCard({ letter, isDm, onView, onEdit, onDelete }: LetterCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  function handleDelete() {
    if (confirmDelete) {
      onDelete(letter.id)
    } else {
      setConfirmDelete(true)
    }
  }

  return (
    <div className="parchment group" onMouseLeave={() => setConfirmDelete(false)}>
      <div className="relative z-10 p-5 flex flex-col gap-3">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-[#2c1506] font-bold text-sm leading-tight wrap-break-word tracking-wide">
            {letter.title}
          </h3>
          <span className="shrink-0 text-[#3d1e06] text-xs italic">{letter.foundAt}</span>
        </div>

        {letter.writtenAt && (
          <p className="text-[#3a1e08]/70 text-xs italic text-right font-serif">{letter.writtenAt}</p>
        )}

        {letter.recipient && (
          <p className="text-[#6b4220]/75 text-xs italic">Para: {letter.recipient}</p>
        )}

        <p className="text-[#3a1e08]/85 text-sm leading-relaxed line-clamp-4 flex-1 whitespace-pre-wrap font-serif">
          {letter.content}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-[#9b6b32]/30">
          <button
            onClick={() => onView(letter)}
            className="text-[#3d1e06] hover:text-black transition-colors text-xs flex items-center gap-1.5 font-medium"
          >
            <EyeIcon size={13} />
            Ler
          </button>

          {isDm && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(letter)}
                className="p-1.5 rounded text-[#3d1e06] hover:text-black hover:bg-[#8b5220]/20 transition-colors"
              >
                <PencilIcon size={14} />
              </button>
              <button
                onClick={handleDelete}
                className={`p-1.5 rounded transition-colors ${
                  confirmDelete
                    ? 'text-red-700 bg-red-400/20'
                    : 'text-[#3d1e06] hover:text-red-700 hover:bg-red-400/15'
                }`}
              >
                <TrashIcon size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LetterCard
