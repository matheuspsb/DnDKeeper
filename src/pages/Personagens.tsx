import { useState, useRef, type ChangeEvent, type KeyboardEvent } from 'react'
import type { Character } from '../types/character'
import { getXpProgress } from '../constants/dnd'
import { useCharacters } from '../hooks/useCharacters'
import Button from '../components/atoms/Button'
import IconButton from '../components/atoms/IconButton'
import PlusIcon from '../components/atoms/icons/PlusIcon'
import PencilIcon from '../components/atoms/icons/PencilIcon'
import TrashIcon from '../components/atoms/icons/TrashIcon'
import UsersIcon from '../components/atoms/icons/UsersIcon'
import XIcon from '../components/atoms/icons/XIcon'

// ─── Helpers ────────────────────────────────────────────────────────────────

function hpColor(pct: number): string {
  if (pct > 75) return '#22c55e'
  if (pct > 25) return '#ECC83B'
  return '#D72334'
}

function fmt(n: number): string {
  return n.toLocaleString('pt-BR')
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val))
}

// ─── Modal de Personagem ─────────────────────────────────────────────────────

type FormData = {
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

const EMPTY_FORM: FormData = {
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

function toForm(c: Character): FormData {
  return {
    name: c.name,
    playerName: c.playerName,
    characterClass: c.characterClass,
    race: c.race,
    maxHP: String(c.maxHP),
    currentHP: String(c.currentHP),
    xp: String(c.xp),
    imageUrl: c.imageUrl,
    notes: c.notes,
  }
}

interface ModalProps {
  initial: Character | null
  onSave: (data: Omit<Character, 'id'>) => void
  onClose: () => void
}

function CharacterModal({ initial, onSave, onClose }: ModalProps) {
  const [form, setForm] = useState<FormData>(initial ? toForm(initial) : EMPTY_FORM)

  function set(field: keyof FormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    if (!form.name.trim()) return
    const maxHP = Math.max(1, parseInt(form.maxHP, 10) || 1)
    const currentHP = clamp(parseInt(form.currentHP, 10) || maxHP, 0, maxHP)
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

  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
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
      onClick={handleBackdrop}
    >
      <div className="bg-black-400 border border-black-100 rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-black-200">
          <h2 className="text-white-100 font-bold text-lg">
            {initial ? 'Editar Personagem' : 'Novo Personagem'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white-300 hover:text-white-100 transition-colors p-1"
          >
            <XIcon size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className={labelClass}>URL da Imagem do Personagem</label>
            <input
              className={inputClass}
              placeholder="https://..."
              value={form.imageUrl}
              onChange={e => set('imageUrl', e.target.value)}
            />
            {form.imageUrl && (
              <div className="mt-2 w-16 h-20 rounded-lg overflow-hidden border border-black-100">
                <img
                  src={form.imageUrl}
                  alt="preview"
                  className="w-full h-full object-cover"
                  onError={e => { e.currentTarget.style.display = 'none' }}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Nome do Personagem *</label>
              <input
                className={inputClass}
                placeholder="Gandalf"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Nome do Jogador</label>
              <input
                className={inputClass}
                placeholder="João"
                value={form.playerName}
                onChange={e => set('playerName', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Classe</label>
              <input
                className={inputClass}
                placeholder="Mago"
                value={form.characterClass}
                onChange={e => set('characterClass', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Raça</label>
              <input
                className={inputClass}
                placeholder="Elfo"
                value={form.race}
                onChange={e => set('race', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>HP Máximo</label>
              <input
                type="number"
                min={1}
                className={inputClass}
                placeholder="45"
                value={form.maxHP}
                onChange={e => set('maxHP', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>HP Atual</label>
              <input
                type="number"
                min={0}
                className={inputClass}
                placeholder="= HP Máximo"
                value={form.currentHP}
                onChange={e => set('currentHP', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Pontos de Experiência (XP Total)</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              placeholder="0"
              value={form.xp}
              onChange={e => set('xp', e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Anotações</label>
            <textarea
              className={`${inputClass} resize-none h-18`}
              placeholder="Condições, itens importantes, lembretes rápidos..."
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" onClick={onClose} className="w-auto! flex-1">
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="w-auto! flex-1">
              {initial ? 'Salvar Alterações' : 'Adicionar Personagem'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Card de Personagem ──────────────────────────────────────────────────────

interface CardProps {
  character: Character
  onEdit: () => void
  onDelete: () => void
  onHpAdjust: (delta: number) => void
}

const HP_ADJUSTMENTS = [-10, -5, -1, 1, 5, 10] as const

function CharacterCard({ character, onEdit, onDelete, onHpAdjust }: CardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [editingHp, setEditingHp] = useState(false)
  const [hpInput, setHpInput] = useState('')

  const hpPct = character.maxHP > 0
    ? Math.round((character.currentHP / character.maxHP) * 100)
    : 0

  const xpData = getXpProgress(character.xp)
  const isDead = character.currentHP === 0

  function startHpEdit() {
    setHpInput(String(character.currentHP))
    setEditingHp(true)
  }

  function commitHpEdit() {
    const val = parseInt(hpInput, 10)
    if (!isNaN(val)) {
      onHpAdjust(clamp(val, 0, character.maxHP) - character.currentHP)
    }
    setEditingHp(false)
  }

  function handleHpKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') commitHpEdit()
    if (e.key === 'Escape') setEditingHp(false)
  }

  return (
    <div className={`bg-black-300 border rounded-xl overflow-hidden flex transition-colors ${isDead ? 'border-red-400/60' : 'border-black-100'}`}>
      <div className="w-28 shrink-0 bg-black-400 relative self-stretch min-h-50">
        {character.imageUrl ? (
          <img src={character.imageUrl} alt={character.name} className="w-full h-full object-cover absolute inset-0" />
        ) : (
          <div className="w-full h-full absolute inset-0 flex items-center justify-center text-white-300/20">
            <UsersIcon size={40} />
          </div>
        )}
        {isDead && (
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
              {character.playerName && (
                <span className="text-white-300/40"> — {character.playerName}</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="bg-red-400/20 border border-red-400/40 text-red-100 text-xs font-bold px-2 py-0.5 rounded-full">
              Lv {xpData.level}
            </span>
            <IconButton onClick={onEdit} title="Editar"><PencilIcon size={14} /></IconButton>
            {confirmDelete ? (
              <div className="flex items-center gap-1 text-xs">
                <button onClick={() => setConfirmDelete(false)} className="text-white-300 hover:text-white-100 transition-colors px-1.5 py-1">Não</button>
                <button onClick={onDelete} className="text-red-100 hover:text-red-200 transition-colors font-semibold px-1.5 py-1">Sim</button>
              </div>
            ) : (
              <IconButton onClick={() => setConfirmDelete(true)} title="Remover"><TrashIcon size={14} /></IconButton>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-white-300/80 text-xs font-medium flex items-center gap-1.5">
              <span style={{ color: hpColor(hpPct) }}>♥</span> Pontos de Vida
            </span>
            <div className="flex items-center gap-1 text-sm">
              {editingHp ? (
                <input autoFocus type="number" value={hpInput}
                  onChange={e => setHpInput(e.target.value)}
                  onBlur={commitHpEdit} onKeyDown={handleHpKeyDown}
                  className="w-14 bg-black-500 border border-red-100 rounded px-1.5 text-center text-white-100 text-sm focus:outline-none tabular-nums"
                />
              ) : (
                <button onClick={startHpEdit} title="Clique para editar HP"
                  className="font-bold tabular-nums hover:opacity-70 transition-opacity"
                  style={{ color: hpColor(hpPct) }}>
                  {character.currentHP}
                </button>
              )}
              <span className="text-white-300/40 tabular-nums">/ {character.maxHP}</span>
              <span className="text-white-300/30 text-xs ml-1">({hpPct}%)</span>
            </div>
          </div>
          <div className="h-2 bg-black-500 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${hpPct}%`, backgroundColor: hpColor(hpPct), transition: 'width 0.35s ease, background-color 0.5s ease' }} />
          </div>
          <div className="flex gap-1 mt-0.5">
            {HP_ADJUSTMENTS.map(delta => {
              const btnCls = delta < 0
                ? 'border-black-100 text-red-100/70 hover:text-red-100 hover:border-red-400/50 bg-black-500 hover:bg-red-400/10'
                : 'border-black-100 text-white-300/70 hover:text-white-100 bg-black-500 hover:bg-black-400'
              return (
                <button key={delta} onClick={() => onHpAdjust(delta)}
                  className={`flex-1 text-xs font-medium py-1 rounded border transition-colors cursor-pointer ${btnCls}`}>
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
              {xpData.isMaxLevel
                ? <span className="text-yellow font-semibold">Nível Máximo</span>
                : `${fmt(xpData.xpIntoLevel)} / ${fmt(xpData.xpNeeded)}`
              }
            </span>
          </div>
          <div className="h-2 bg-black-500 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${xpData.percentage}%`, backgroundColor: '#ECC83B', transition: 'width 0.35s ease' }} />
          </div>
          {!xpData.isMaxLevel && (
            <p className="text-white-300/40 text-xs">
              {fmt(character.xp)} XP total · Nível {xpData.level} → {xpData.level + 1}
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
  const importRef = useRef<HTMLInputElement>(null)

  function openForNew() {
    setEditingCharacter(null)
    setIsModalOpen(true)
  }

  function openForEdit(c: Character) {
    setEditingCharacter(c)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingCharacter(null)
  }

  function handleSave(data: Omit<Character, 'id'>) {
    if (editingCharacter) {
      updateCharacter(editingCharacter.id, data)
    } else {
      addCharacter(data)
    }
    closeModal()
  }

  function handleHpAdjust(id: string, delta: number) {
    const c = characters.find(ch => ch.id === id)
    if (!c) return
    updateCharacter(id, { currentHP: clamp(c.currentHP + delta, 0, c.maxHP) })
  }

  function handleImport(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) importJSON(file)
    e.target.value = ''
  }

  const totalHP = characters.reduce((sum, c) => sum + c.currentHP, 0)
  const totalMaxHP = characters.reduce((sum, c) => sum + c.maxHP, 0)
  const groupPct = totalMaxHP > 0 ? (totalHP / totalMaxHP) * 100 : 0

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
          <input ref={importRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
          {characters.length > 0 && (
            <>
              <Button variant="secondary" onClick={() => importRef.current?.click()} className="w-auto! px-4 text-xs">
                Importar JSON
              </Button>
              <Button variant="secondary" onClick={exportJSON} className="w-auto! px-4 text-xs">
                Exportar JSON
              </Button>
            </>
          )}
          <Button variant="primary" onClick={openForNew} className="w-auto! px-4 gap-2">
            <PlusIcon size={15} /> Adicionar
          </Button>
        </div>
      </div>

      {characters.length > 1 && (
        <div className="bg-black-400 border border-black-100 rounded-xl px-5 py-3 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-red-100 text-sm">♥</span>
            <span className="text-white-300 text-sm">HP do Grupo</span>
            <span className="text-white-100 font-bold tabular-nums text-sm">{fmt(totalHP)} / {fmt(totalMaxHP)}</span>
          </div>
          <div className="flex-1 h-1.5 bg-black-500 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${groupPct}%`, backgroundColor: hpColor(groupPct), transition: 'width 0.35s ease' }} />
          </div>
          <span className="text-white-300/50 text-xs tabular-nums">{Math.round(groupPct)}%</span>
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
            <Button onClick={openForNew} className="gap-2">
              <PlusIcon size={15} /> Adicionar personagem
            </Button>
            <Button variant="secondary" onClick={() => importRef.current?.click()} className="w-auto! px-5">
              Importar JSON
            </Button>
          </div>
        </div>
      )}

      {characters.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {characters.map(c => (
            <CharacterCard key={c.id} character={c}
              onEdit={() => openForEdit(c)}
              onDelete={() => deleteCharacter(c.id)}
              onHpAdjust={delta => handleHpAdjust(c.id, delta)}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <CharacterModal initial={editingCharacter} onSave={handleSave} onClose={closeModal} />
      )}
    </div>
  )
}

export default Personagens
