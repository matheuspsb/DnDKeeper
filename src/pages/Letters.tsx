import { useState } from 'react'
import type { Letter } from '../types/letter'
import { useLetters } from '../hooks/useLetters'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/atoms/Button'
import PlusIcon from '../components/atoms/icons/PlusIcon'
import ScrollIcon from '../components/atoms/icons/ScrollIcon'
import EyeIcon from '../components/atoms/icons/EyeIcon'
import EyeOffIcon from '../components/atoms/icons/EyeOffIcon'
import PencilIcon from '../components/atoms/icons/PencilIcon'
import TrashIcon from '../components/atoms/icons/TrashIcon'
import XIcon from '../components/atoms/icons/XIcon'
import LetterModal from '../components/organisms/letter/LetterModal'
import LetterSeedReset from '../components/molecules/letter/LetterSeedReset'

function Letters() {
  const { user } = useAuth()
  const { letters, addLetter, updateLetter, deleteLetter, toggleShown, resetToSeed } = useLetters()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingLetter, setEditingLetter] = useState<Letter | null>(null)
  const [viewingLetter, setViewingLetter] = useState<Letter | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const isDm = user?.role === 'dm'

  function openAdd() {
    setEditingLetter(null)
    setModalOpen(true)
  }

  function openEdit(letter: Letter) {
    setEditingLetter(letter)
    setModalOpen(true)
  }

  function handleSave(data: Omit<Letter, 'id'>) {
    if (editingLetter) {
      updateLetter(editingLetter.id, data)
    } else {
      addLetter(data)
    }
    setModalOpen(false)
  }

  function handleDelete(id: string) {
    if (confirmDelete === id) {
      deleteLetter(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
    }
  }

  const shownCount = letters.filter((l) => l.shown).length

  return (
    <div className="flex flex-col h-full">
      {/* SVG filter — bordas irregulares e queimadas via feDisplacementMap */}
      <svg width="0" height="0" className="absolute overflow-hidden" aria-hidden="true">
        <defs>
          <filter
            id="burnt-paper"
            x="-8%"
            y="-8%"
            width="116%"
            height="116%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.022 0.018"
              numOctaves="4"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="10"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <div className="shrink-0 px-8 pt-4 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-white-100 text-3xl font-bold">Cartas</h2>
          <p className="text-white-300/60 text-sm mt-1">
            {letters.length === 0
              ? 'Nenhuma carta'
              : `${letters.length} carta${letters.length > 1 ? 's' : ''} · ${shownCount} revelada${shownCount !== 1 ? 's' : ''}`}
          </p>
        </div>
        {isDm && (
          <div className="flex items-center gap-2">
            <LetterSeedReset onReset={resetToSeed} />
            <Button variant="primary" onClick={openAdd} className="flex items-center gap-2">
              <PlusIcon size={16} />
              Nova Carta
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-8">
        {letters.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <ScrollIcon size={48} className="text-white-300/20" />
            <div>
              <p className="text-white-200 font-medium">Nenhuma carta ainda</p>
              <p className="text-white-300/60 text-sm mt-1">
                Adicione cartas e documentos revelados aos jogadores
              </p>
            </div>
            {isDm && (
              <Button
                variant="primary"
                onClick={openAdd}
                className="flex items-center gap-2 w-auto!"
              >
                <PlusIcon size={16} />
                Nova Carta
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {letters.map((letter) => (
              <div
                key={letter.id}
                className="parchment group"
                onMouseLeave={() => setConfirmDelete(null)}
              >
              <div className="relative z-10 p-5 flex flex-col gap-3">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-[#2c1506] font-bold text-sm leading-tight wrap-break-word tracking-wide">
                    {letter.title}
                  </h3>
                  <span className="shrink-0 text-[#3d1e06] text-[10px] italic">
                    {letter.foundAt}
                  </span>
                </div>

                {letter.recipient && (
                  <p className="text-[#6b4220]/75 text-xs italic">Para: {letter.recipient}</p>
                )}

                <p className="text-[#3a1e08]/85 text-sm leading-relaxed line-clamp-4 flex-1 whitespace-pre-wrap font-serif">
                  {letter.content}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[#9b6b32]/30">
                  <button
                    onClick={() => setViewingLetter(letter)}
                    className="text-[#3d1e06] hover:text-black transition-colors text-xs flex items-center gap-1.5 font-medium"
                  >
                    <EyeIcon size={13} />
                    Ler
                  </button>

                  {isDm && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleShown(letter.id)}
                        title={letter.shown ? 'Marcar como pendente' : 'Marcar como revelada'}
                        className="p-1.5 rounded text-[#3d1e06] hover:text-black hover:bg-[#8b5220]/20 transition-colors"
                      >
                        {letter.shown ? <EyeOffIcon size={14} /> : <EyeIcon size={14} />}
                      </button>
                      <button
                        onClick={() => openEdit(letter)}
                        className="p-1.5 rounded text-[#3d1e06] hover:text-black hover:bg-[#8b5220]/20 transition-colors"
                      >
                        <PencilIcon size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(letter.id)}
                        className={`p-1.5 rounded transition-colors ${
                          confirmDelete === letter.id
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
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <LetterModal
          initialLetter={editingLetter}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}

      {viewingLetter && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
          onClick={() => setViewingLetter(null)}
        >
          <div
            className="parchment w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative z-10 max-h-[85vh] overflow-y-auto">
              <div className="flex items-start justify-between px-7 pt-6 pb-4 border-b border-[#9b6b32]/35 gap-4">
                <div>
                  <h2 className="text-[#2c1506] font-bold text-xl leading-tight tracking-wide">
                    {viewingLetter.title}
                  </h2>
                  {viewingLetter.recipient && (
                    <p className="text-[#6b4220]/75 text-xs italic mt-1">
                      Para: {viewingLetter.recipient}
                    </p>
                  )}
                  <p className="text-[#3d1e06] text-[10px] italic mt-0.5">
                    Encontrada em: {viewingLetter.foundAt}
                  </p>
                </div>
                <button
                  onClick={() => setViewingLetter(null)}
                  className="shrink-0 text-[#3d1e06] hover:text-black transition-colors mt-0.5"
                >
                  <XIcon size={20} />
                </button>
              </div>
              <div className="px-7 py-6">
                <p className="text-[#3a1e08] text-sm leading-7 whitespace-pre-wrap font-serif">
                  {viewingLetter.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Letters
