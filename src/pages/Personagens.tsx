import { useState, useRef, type ChangeEvent, type KeyboardEvent } from 'react'
import type { Character } from '../types/character'
import { getXpProgress } from '../constants/dnd'
import { useCharacters } from '../hooks/useCharacters'
import { clampNumber, formatNumber } from '../utils/number'
import { resolveHpBarColor } from '../utils/character'
import Button from '../components/atoms/Button'
import IconButton from '../components/atoms/IconButton'
import PlusIcon from '../components/atoms/icons/PlusIcon'
import PencilIcon from '../components/atoms/icons/PencilIcon'
import TrashIcon from '../components/atoms/icons/TrashIcon'
import UsersIcon from '../components/atoms/icons/UsersIcon'
import XIcon from '../components/atoms/icons/XIcon'

// ─── Tipos do formulário ─────────────────────────────────────────────────────

type CharacterFormData = {
  name: string
  playerName: string
  characterClass: string
  race: string
  maxHP: string
  currentHP: string
  xp: string
  imageUrl: string
  notes: string
}

const EMPTY_CHARACTER_FORM: CharacterFormData = {
  name: '',
  playerName: '',
  characterClass: '',
  race: '',
  maxHP: '',
  currentHP: '',
  xp: '0',
  imageUrl: '',
  notes: '',
}

function characterToFormData(character: Character): CharacterFormData {
  return {
    name: character.name,
    playerName: character.playerName,
    characterClass: character.characterClass,
    race: character.race,
    maxHP: String(character.maxHP),
    currentHP: String(character.currentHP),
    xp: String(character.xp),
    imageUrl: character.imageUrl,
    notes: character.notes,
  }
}

// ─── Modal de Personagem ─────────────────────────────────────────────────────

interface CharacterModalProps {
  initialCharacter: Character | null
  onSave: (data: Omit<Character, 'id'>) => void
  onClose: () => void
}

function CharacterModal({ initialCharacter, onSave, onClose }: CharacterModalProps) {
  const [form, setForm] = useState<CharacterFormData>(
    initialCharacter ? characterToFormData(initialCharacter) : EMPTY_CHARACTER_FORM
  )

  function updateField(field: keyof CharacterFormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    if (!form.name.trim()) return
    const maxHP = Math.max(1, parseInt(form.maxHP, 10) || 1)
    const currentHP = clampNumber(parseInt(form.currentHP, 10) || maxHP, 0, maxHP)
    const xp = Math.max(0, parseInt(form.xp, 10) || 0)
    onSave({
      name: form.name.trim(),
      playerName: form.playerName.trim(),
      characterClass: form.characterClass.trim(),
      race: form.race.trim(),
      maxHP,
      currentHP,
      xp,
      imageUrl: form.imageUrl.trim(),
      notes: form.notes.trim(),
    })
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  const inputClass = `
    w-full bg-black-500 border border-black-100 rounded-lg px-3 py-2
    text-white-100 text-sm placeholder:text-white-300/30
    focus:outline-none focus:border-red-100 transition-colors
  `
  const labelClass = 'block text-white-300 text-xs font-medium mb-1.5'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-black-400 border border-black-100 rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-black-200">
          <h2 className="text-white-100 font-bold text-lg">
            {initialCharacter ? 'Editar Personagem' : 'Novo Personagem'}
          </h2>
          <button type="button" onClick={onClose} className="text-white-300 hover:text-white-100 transition-colors p-1">
            <XIcon size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className={labelClass}>URL da Imagem do Personagem</label>
            <input className={inputClass} placeholder="https://..." value={form.imageUrl} onChange={e => updateField('imageUrl', e.target.value)} />
            {form.imageUrl && (
              <div className="mt-2 w-16 h-20 rounded-lg overflow-hidden border border-black-100">
                <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover" onError={e => { e.currentTarget.style.display = 'none' }} />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Nome do Personagem *</label>
              <input className={inputClass} placeholder="Gandalf" value={form.name} onChange={e => updateField('name', e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>Nome do Jogador</label>
              <input className={inputClass} placeholder="João" value={form.playerName} onChange={e => updateField('playerName', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Classe</label>
              <input className={inputClass} placeholder="Mago" value={form.characterClass} onChange={e => updateField('characterClass', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Raça</label>
              <input className={inputClass} placeholder="Elfo" value={form.race} onChange={e => updateField('race', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>HP Máximo</label>
              <input type="number" min={1} className={inputClass} placeholder="45" value={form.maxHP} onChange={e => updateField('maxHP', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>HP Atual</label>
              <input type="number" min={0} className={inputClass} placeholder="= HP Máximo" value={form.currentHP} onChange={e => updateField('currentHP', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Pontos de Experiência (XP Total)</label>
            <input type="number" min={0} className={inputClass} placeholder="0" value={form.xp} onChange={e => updateField('xp', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Anotações</label>
            <textarea
              className={`${inputClass} resize-none h-18`}
              placeholder="Condições, itens importantes, lembretes rápidos..."
              value={form.notes}
              onChange={e => updateField('notes', e.target.value)}
            />
          </div>
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" onClick={onClose} className="w-auto! flex-1">Cancelar</Button>
            <Button type="submit" variant="primary" className="w-auto! flex-1">
              {initialCharacter ? 'Salvar Alterações' : 'Adicionar Personagem'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Card de Personagem ──────────────────────────────────────────────────────

interface CharacterCardProps {
  character: Character
  onEdit: () => void
  onDelete: () => void
  onHpAdjust: (delta: number) => void
}

const HP_DELTA_OPTIONS = [-10, -5, -1, 1, 5, 10] as const

function CharacterCard({ character, onEdit, onDelete, onHpAdjust }: CharacterCardProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const [isEditingHp, setIsEditingHp] = useState(false)
  const [hpInputValue, setHpInputValue] = useState('')

  const hpPercentage = character.maxHP > 0
    ? Math.round((character.currentHP / character.maxHP) * 100)
    : 0

  const xpProgress = getXpProgress(character.xp)
  const isCharacterDead = character.currentHP === 0

  function startHpEdit() {
    setHpInputValue(String(character.currentHP))
    setIsEditingHp(true)
  }

  function commitHpEdit() {
    const newHp = parseInt(hpInputValue, 10)
    if (!isNaN(newHp)) {
      onHpAdjust(clampNumber(newHp, 0, character.maxHP) - character.currentHP)
    }
    setIsEditingHp(false)
  }

  function handleHpInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') commitHpEdit()
    if (e.key === 'Escape') setIsEditingHp(false)
  }

  return (
    <div className={`bg-black-300 border rounded-xl overflow-hidden flex transition-colors ${isCharacterDead ? 'border-red-400/60' : 'border-black-100'}`}>
      <div className="w-28 shrink-0 bg-black-400 relative self-stretch min-h-50">
        {character.imageUrl ? (
          <img src={character.imageUrl} alt={character.name} className="w-full h-full object-cover absolute inset-0" />
        ) : (
          <div className="w-full h-full absolute inset-0 flex items-center justify-center text-white-300/20">
            <UsersIcon size={40} />
          </div>
        )}
        {isCharacterDead && (
          <div className="absolute inset-0 bg-red-500/20 flex items-end justify-center pb-2">
            <span className="text-red-100 text-xs font-bold tracking-widest">CAÍDO</span>
          </div>
        )}
      </div>

      <div className="flex-1 p-4 flex flex-col gap-3 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-white-100 font-bold text-base leading-tight truncate">{character.name}</h3>
            <p className="text-white-300/70 text-xs mt-0.5 truncate">
              {[character.characterClass, character.race].filter(Boolean).join(' · ')}
              {character.playerName && <span className="text-white-300/40"> — {character.playerName}</span>}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="bg-red-400/20 border border-red-400/40 text-red-100 text-xs font-bold px-2 py-0.5 rounded-full">
              Lv {xpProgress.level}
            </span>
            <IconButton onClick={onEdit} title="Editar"><PencilIcon size={14} /></IconButton>
            {isConfirmingDelete ? (
              <div className="flex items-center gap-1 text-xs">
                <button onClick={() => setIsConfirmingDelete(false)} className="text-white-300 hover:text-white-100 transition-colors px-1.5 py-1">Não</button>
                <button onClick={onDelete} className="text-red-100 hover:text-red-200 transition-colors font-semibold px-1.5 py-1">Sim</button>
              </div>
            ) : (
              <IconButton onClick={() => setIsConfirmingDelete(true)} title="Remover"><TrashIcon size={14} /></IconButton>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-white-300/80 text-xs font-medium flex items-center gap-1.5">
              <span style={{ color: resolveHpBarColor(hpPercentage) }}>♥</span> Pontos de Vida
            </span>
            <div className="flex items-center gap-1 text-sm">
              {isEditingHp ? (
                <input autoFocus type="number" value={hpInputValue}
                  onChange={e => setHpInputValue(e.target.value)}
                  onBlur={commitHpEdit} onKeyDown={handleHpInputKeyDown}
                  className="w-14 bg-black-500 border border-red-100 rounded px-1.5 text-center text-white-100 text-sm focus:outline-none tabular-nums"
                />
              ) : (
                <button onClick={startHpEdit} title="Clique para editar HP"
                  className="font-bold tabular-nums hover:opacity-70 transition-opacity"
                  style={{ color: resolveHpBarColor(hpPercentage) }}>
                  {character.currentHP}
                </button>
              )}
              <span className="text-white-300/40 tabular-nums">/ {character.maxHP}</span>
              <span className="text-white-300/30 text-xs ml-1">({hpPercentage}%)</span>
            </div>
          </div>
          <div className="h-2 bg-black-500 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${hpPercentage}%`, backgroundColor: resolveHpBarColor(hpPercentage), transition: 'width 0.35s ease, background-color 0.5s ease' }} />
          </div>
          <div className="flex gap-1 mt-0.5">
            {HP_DELTA_OPTIONS.map(delta => {
              const adjustButtonClass = delta < 0
                ? 'border-black-100 text-red-100/70 hover:text-red-100 hover:border-red-400/50 bg-black-500 hover:bg-red-400/10'
                : 'border-black-100 text-white-300/70 hover:text-white-100 bg-black-500 hover:bg-black-400'
              return (
                <button key={delta} onClick={() => onHpAdjust(delta)}
                  className={`flex-1 text-xs font-medium py-1 rounded border transition-colors cursor-pointer ${adjustButtonClass}`}>
                  {delta > 0 ? `+${delta}` : delta}
                </button>
              )
            })}
          </div>
        </div>
        <div className="border-t border-black-200" />

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-white-300/80 text-xs font-medium flex items-center gap-1.5">
              <span className="text-yellow">✦</span> Experiência
            </span>
            <span className="text-white-300/50 text-xs tabular-nums">
              {xpProgress.isMaxLevel
                ? <span className="text-yellow font-semibold">Nível Máximo</span>
                : `${formatNumber(xpProgress.xpIntoLevel)} / ${formatNumber(xpProgress.xpNeeded)}`
              }
            </span>
          </div>
          <div className="h-2 bg-black-500 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${xpProgress.percentage}%`, backgroundColor: '#ECC83B', transition: 'width 0.35s ease' }} />
          </div>
          {!xpProgress.isMaxLevel && (
            <p className="text-white-300/40 text-xs">
              {formatNumber(character.xp)} XP total · Nível {xpProgress.level} → {xpProgress.level + 1}
            </p>
          )}
        </div>

        {character.notes && (
          <div className="border-t border-black-200 pt-2.5">
            <p className="text-white-300/50 text-xs leading-relaxed line-clamp-2">{character.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}

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
        <div className="flex-1 flex flex-col items-center justify-center gap-5 py-24">
          <div className="w-24 h-24 rounded-full bg-black-300 border border-black-100 flex items-center justify-center text-white-300/20">
            <UsersIcon size={40} />
          </div>
          <div className="text-center max-w-sm">
            <p className="text-white-100 font-semibold text-lg">Nenhum personagem ainda</p>
            <p className="text-white-300/60 text-sm mt-2 leading-relaxed">
              Adicione os personagens da campanha para acompanhar HP, XP e anotações durante as sessões.
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={openNewCharacterModal} className="gap-2">
              <PlusIcon size={15} /> Adicionar personagem
            </Button>
            <Button variant="secondary" onClick={() => importInputRef.current?.click()} className="w-auto! px-5">
              Importar JSON
            </Button>
          </div>
        </div>
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
