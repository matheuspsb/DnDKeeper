import { useState } from 'react'
import type { Letter } from '../types/letter'
import { useLetters } from '../hooks/useLetters'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/atoms/Button'
import PlusIcon from '../components/atoms/icons/PlusIcon'
import ParchmentFilter from '../components/atoms/ParchmentFilter'
import LetterCard from '../components/molecules/letter/LetterCard'
import LettersEmpty from '../components/molecules/letter/LettersEmpty'
import LetterSeedReset from '../components/molecules/letter/LetterSeedReset'
import LetterModal from '../components/organisms/letter/LetterModal'
import LetterViewModal from '../components/organisms/letter/LetterViewModal'

function Letters() {
  const { user } = useAuth()
  const { letters, addLetter, updateLetter, deleteLetter, toggleShown, resetToSeed } = useLetters()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingLetter, setEditingLetter] = useState<Letter | null>(null)
  const [viewingLetter, setViewingLetter] = useState<Letter | null>(null)

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

  const shownCount = letters.filter((l) => l.shown).length

  return (
    <div className="flex flex-col h-full">
      <ParchmentFilter />

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
          <LettersEmpty isDm={isDm} onAdd={openAdd} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {letters.map((letter) => (
              <LetterCard
                key={letter.id}
                letter={letter}
                isDm={isDm}
                onView={setViewingLetter}
                onEdit={openEdit}
                onDelete={deleteLetter}
                onToggleShown={toggleShown}
              />
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
        <LetterViewModal letter={viewingLetter} onClose={() => setViewingLetter(null)} />
      )}
    </div>
  )
}

export default Letters
