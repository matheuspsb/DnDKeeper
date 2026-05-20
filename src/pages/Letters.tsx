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

function Letters() {
  const { user } = useAuth()
  const { letters, addLetter, updateLetter, deleteLetter, toggleShown } = useLetters()
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

  function handleSave(data: Omit<Letter, 'id' | 'createdAt'>) {
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
          <Button variant="primary" onClick={openAdd} className="flex items-center gap-2">
            <PlusIcon size={16} />
            Nova Carta
          </Button>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {letters.map((letter) => (
              <div
                key={letter.id}
                className="group bg-black-300 border border-black-100 rounded-xl p-5 flex flex-col gap-3 transition-colors"
                onMouseLeave={() => setConfirmDelete(null)}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-white-100 font-semibold text-sm leading-tight flex-1 wrap-break-words">
                    {letter.title}
                  </h3>
                  <span
                    className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                      letter.shown
                        ? 'bg-emerald-900/40 text-emerald-400'
                        : 'bg-black-200 text-white-300/50'
                    }`}
                  >
                    {letter.shown ? 'Revelada' : 'Pendente'}
                  </span>
                </div>

                {letter.recipient && (
                  <p className="text-white-300/60 text-xs">Para: {letter.recipient}</p>
                )}

                <p className="text-white-200/70 text-sm leading-relaxed line-clamp-4 flex-1 whitespace-pre-wrap">
                  {letter.content}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-black-100/50">
                  <button
                    onClick={() => setViewingLetter(letter)}
                    className="text-white-300/60 hover:text-white-100 transition-colors text-xs flex items-center gap-1.5"
                  >
                    <EyeIcon size={13} />
                    Ler
                  </button>

                  {isDm && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleShown(letter.id)}
                        title={letter.shown ? 'Marcar como pendente' : 'Marcar como revelada'}
                        className="p-1.5 rounded text-white-300/50 hover:text-white-100 hover:bg-black-200 transition-colors"
                      >
                        {letter.shown ? <EyeOffIcon size={14} /> : <EyeIcon size={14} />}
                      </button>
                      <button
                        onClick={() => openEdit(letter)}
                        className="p-1.5 rounded text-white-300/50 hover:text-white-100 hover:bg-black-200 transition-colors"
                      >
                        <PencilIcon size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(letter.id)}
                        className={`p-1.5 rounded transition-colors ${
                          confirmDelete === letter.id
                            ? 'text-red-100 bg-red-400/10'
                            : 'text-white-300/50 hover:text-red-100 hover:bg-black-200'
                        }`}
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  )}
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setViewingLetter(null)}
        >
          <div
            className="bg-black-400 border border-black-100 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between px-6 py-4 border-b border-black-100 gap-4">
              <div>
                <h2 className="text-white-100 font-semibold text-lg leading-tight">
                  {viewingLetter.title}
                </h2>
                {viewingLetter.recipient && (
                  <p className="text-white-300/60 text-xs mt-1">Para: {viewingLetter.recipient}</p>
                )}
              </div>
              <button
                onClick={() => setViewingLetter(null)}
                className="shrink-0 text-white-300 hover:text-white-100 transition-colors mt-0.5"
              >
                <XIcon size={20} />
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="text-white-200 text-sm leading-relaxed whitespace-pre-wrap">
                {viewingLetter.content}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Letters
