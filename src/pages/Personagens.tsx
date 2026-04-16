import { useState, useRef, type ChangeEvent } from 'react'
import type { Character } from '../types/character'
import { useCharacters } from '../hooks/useCharacters'
import { clampNumber, formatNumber } from '../utils/number'
import { resolveHpBarColor } from '../utils/character'
import Button from '../components/atoms/Button'
import PlusIcon from '../components/atoms/icons/PlusIcon'
import CharactersEmpty from '../components/molecules/CharactersEmpty'
import CharacterCard from '../components/organisms/CharacterCard'
import CharacterModal from '../components/organisms/CharacterModal'

// ─── Página ──────────────────────────────────────────────────────────────────

function Personagens() {
  const { characters, addCharacter, updateCharacter, deleteCharacter, exportJSON, importJSON } =
    useCharacters()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null)
  const importInputRef = useRef<HTMLInputElement>(null)

  function openNewCharacterModal() {
    setEditingCharacter(null)
    setIsModalOpen(true)
  }

  function openEditCharacterModal(character: Character) {
    setEditingCharacter(character)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingCharacter(null)
  }

  function handleCharacterSave(data: Omit<Character, 'id'>) {
    if (editingCharacter) {
      updateCharacter(editingCharacter.id, data)
    } else {
      addCharacter(data)
    }
    closeModal()
  }

  function handleHpAdjust(characterId: string, delta: number) {
    const character = characters.find(c => c.id === characterId)
    if (!character) return
    updateCharacter(characterId, {
      currentHP: clampNumber(character.currentHP + delta, 0, character.maxHP),
    })
  }

  function handleImportFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) importJSON(file)
    e.target.value = ''
  }

  const totalGroupHP = characters.reduce((sum, character) => sum + character.currentHP, 0)
  const totalGroupMaxHP = characters.reduce((sum, character) => sum + character.maxHP, 0)
  const groupHpPercentage = totalGroupMaxHP > 0 ? (totalGroupHP / totalGroupMaxHP) * 100 : 0

  return (
    <div className="flex flex-col gap-6 p-8 min-h-full">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-white-100 text-3xl font-bold">Personagens</h2>
          <p className="text-white-300 text-sm mt-1">
            {characters.length === 0
              ? 'Nenhum personagem cadastrado'
              : `${characters.length} personagem${characters.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <input ref={importInputRef} type="file" accept=".json" onChange={handleImportFileChange} className="hidden" />
          {characters.length > 0 && (
            <>
              <Button variant="secondary" onClick={() => importInputRef.current?.click()} className="w-auto! px-4 text-xs">
                Importar JSON
              </Button>
              <Button variant="secondary" onClick={exportJSON} className="w-auto! px-4 text-xs">
                Exportar JSON
              </Button>
            </>
          )}
          <Button variant="primary" onClick={openNewCharacterModal} className="w-auto! px-4 gap-2">
            <PlusIcon size={15} /> Adicionar
          </Button>
        </div>
      </div>

      {characters.length > 1 && (
        <div className="bg-black-400 border border-black-100 rounded-xl px-5 py-3 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-red-100 text-sm">♥</span>
            <span className="text-white-300 text-sm">HP do Grupo</span>
            <span className="text-white-100 font-bold tabular-nums text-sm">{formatNumber(totalGroupHP)} / {formatNumber(totalGroupMaxHP)}</span>
          </div>
          <div className="flex-1 h-1.5 bg-black-500 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${groupHpPercentage}%`, backgroundColor: resolveHpBarColor(groupHpPercentage), transition: 'width 0.35s ease' }} />
          </div>
          <span className="text-white-300/50 text-xs tabular-nums">{Math.round(groupHpPercentage)}%</span>
        </div>
      )}

      {characters.length === 0 && (
        <CharactersEmpty
          onAddCharacter={openNewCharacterModal}
          onImportJSON={() => importInputRef.current?.click()}
        />
      )}

      {characters.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {characters.map(character => (
            <CharacterCard
              key={character.id}
              character={character}
              onEdit={() => openEditCharacterModal(character)}
              onDelete={() => deleteCharacter(character.id)}
              onHpAdjust={delta => handleHpAdjust(character.id, delta)}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <CharacterModal
          initialCharacter={editingCharacter}
          onSave={handleCharacterSave}
          onClose={closeModal}
        />
      )}
    </div>
  )
}

export default Personagens
