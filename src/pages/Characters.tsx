import { useState } from 'react'
import type { Character } from '../types/character'
import { useAddCharacter, useCharacters, useDeleteCharacter, useUpdateCharacter } from '../hooks/useCharacters'
import { clampNumber } from '../utils/number'
import Button from '../components/atoms/Button'
import PlusIcon from '../components/atoms/icons/PlusIcon'
import GroupHpBar from '../components/molecules/characters/GroupHpBar'
import CharactersEmpty from '../components/molecules/characters/CharactersEmpty'
import CharacterCard from '../components/organisms/character/CharacterCard'
import CharacterModal from '../components/organisms/character/CharacterModal'

// ─── Página ──────────────────────────────────────────────────────────────────

function Characters() {
  const { data: characters = [], isLoading, isError } = useCharacters()
  const addCharacter = useAddCharacter()
  const updateCharacter = useUpdateCharacter()
  const deleteCharacter = useDeleteCharacter()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

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

  async function handleCharacterSave(data: Omit<Character, 'id'>) {
    if (editingCharacter) {
      await updateCharacter.mutateAsync({ id: editingCharacter.id, data })
    } else {
      await addCharacter.mutateAsync(data)
    }
    closeModal()
  }

  async function handleDelete(id: string) {
    setDeleteError(null)
    try {
      await deleteCharacter.mutateAsync(id)
    } catch {
      setDeleteError('Não foi possível remover o personagem.')
    }
  }

  function handleHpAdjust(characterId: string, delta: number) {
    const character = characters.find((c) => c.id === characterId)
    if (!character) return
    updateCharacter.mutate({
      id: characterId,
      data: { currentHP: clampNumber(character.currentHP + delta, 0, character.maxHP) },
    })
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
            {isLoading
              ? 'Carregando…'
              : characters.length === 0
                ? 'Nenhum personagem cadastrado'
                : `${characters.length} personagem${characters.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="primary" onClick={openNewCharacterModal} className="w-auto! px-4 gap-2">
            <PlusIcon size={15} /> Adicionar
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <p className="text-white-300/50 text-sm">Carregando personagens…</p>
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center py-24">
          <p className="text-red-100 text-sm">Não foi possível carregar os personagens.</p>
        </div>
      ) : (
        <>
          {deleteError && <p className="text-red-100 text-xs">{deleteError}</p>}

          {characters.length > 1 && (
            <GroupHpBar
              totalHP={totalGroupHP}
              totalMaxHP={totalGroupMaxHP}
              percentage={groupHpPercentage}
            />
          )}

          {characters.length === 0 && <CharactersEmpty onAddCharacter={openNewCharacterModal} />}

          {characters.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {characters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  onEdit={() => openEditCharacterModal(character)}
                  onDelete={() => handleDelete(character.id)}
                  onHpAdjust={(delta) => handleHpAdjust(character.id, delta)}
                />
              ))}
            </div>
          )}
        </>
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
