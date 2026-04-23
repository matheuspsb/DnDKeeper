import { useState, useRef, type ChangeEvent } from 'react'
import type { Character } from '../types/character'
import { useCharacters } from '../hooks/useCharacters'
import { clampNumber } from '../utils/number'
import Button from '../components/atoms/Button'
import PlusIcon from '../components/atoms/icons/PlusIcon'
import GroupHpBar from '../components/molecules/characters/GroupHpBar'
import CharactersEmpty from '../components/molecules/characters/CharactersEmpty'
import CharacterCard from '../components/organisms/CharacterCard'
import CharacterModal from '../components/organisms/CharacterModal'

// ─── Página ──────────────────────────────────────────────────────────────────

function Characters() {
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
    const character = characters.find((c) => c.id === characterId)
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
          <input
            ref={importInputRef}
            type="file"
            accept=".json"
            onChange={handleImportFileChange}
            className="hidden"
          />
          {characters.length > 0 && (
            <>
              <Button
                variant="secondary"
                onClick={() => importInputRef.current?.click()}
                className="w-auto! px-4 text-xs"
              >
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
        <GroupHpBar
          totalHP={totalGroupHP}
          totalMaxHP={totalGroupMaxHP}
          percentage={groupHpPercentage}
        />
      )}

      {characters.length === 0 && (
        <CharactersEmpty
          onAddCharacter={openNewCharacterModal}
          onImportJSON={() => importInputRef.current?.click()}
        />
      )}

      {characters.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onEdit={() => openEditCharacterModal(character)}
              onDelete={() => deleteCharacter(character.id)}
              onHpAdjust={(delta) => handleHpAdjust(character.id, delta)}
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

export default Characters
