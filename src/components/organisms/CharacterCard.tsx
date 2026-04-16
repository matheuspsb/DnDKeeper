import { useState, type KeyboardEvent } from 'react'
import type { Character } from '../../types/character'
import { getXpProgress } from '../../constants/dnd'
import { HP_DELTA_OPTIONS } from '../../constants/character'
import { resolveImageUrl } from '../../constants/arts'
import { clampNumber, formatNumber } from '../../utils/number'
import { resolveHpBarColor } from '../../utils/character'
import IconButton from '../atoms/IconButton'
import PencilIcon from '../atoms/icons/PencilIcon'
import TrashIcon from '../atoms/icons/TrashIcon'
import UsersIcon from '../atoms/icons/UsersIcon'

interface CharacterCardProps {
  character: Character
  onEdit: () => void
  onDelete: () => void
  onHpAdjust: (delta: number) => void
}

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
          <img src={resolveImageUrl(character.imageUrl)} alt={character.name} className="w-full h-full object-cover absolute inset-0" />
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

export default CharacterCard
