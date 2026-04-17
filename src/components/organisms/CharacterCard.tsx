import { useState, type KeyboardEvent } from 'react'
import type { Character } from '../../types/character'
import { getXpProgress } from '../../constants/dnd'
import { HP_DELTA_OPTIONS } from '../../constants/character'
import { resolveImageUrl } from '../../constants/arts'
import { clampNumber, formatNumber } from '../../utils/number'
import { resolveHpBarColor } from '../../utils/character'
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

  const hpColor = resolveHpBarColor(hpPercentage)

  return (
    <div
      className={`group bg-black-300 border rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black-500/60
        ${isCharacterDead ? 'border-red-400/60' : 'border-black-100 hover:border-black-200'}`}
    >
      <div className="h-64 relative bg-black-400 shrink-0">
        <div className="absolute inset-0 overflow-hidden">
          {character.imageUrl ? (
            <img
              src={resolveImageUrl(character.imageUrl)}
              alt={character.name}
              className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white-300/20">
              <UsersIcon size={52} />
            </div>
          )}
        </div>

        <div className="absolute inset-x-0 -bottom-3 h-24 bg-linear-to-t from-black-300 to-transparent pointer-events-none" />

        <div className="absolute top-2.5 left-2.5">
          <span className="bg-black-500/70 border border-red-400/40 text-red-100 text-xs font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
            Lv {xpProgress.level}
          </span>
        </div>

        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={onEdit}
            title="Editar"
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-white-100 hover:bg-red-200 transition-colors cursor-pointer"
          >
            <PencilIcon size={14} />
          </button>
          {isConfirmingDelete ? (
            <div className="flex items-center gap-0.5 bg-red-100/90 backdrop-blur-sm rounded-lg px-1">
              <button
                onClick={() => setIsConfirmingDelete(false)}
                className="text-white-100/70 hover:text-white-100 transition-colors px-1.5 py-1 text-xs cursor-pointer"
              >
                Não
              </button>
              <button
                onClick={onDelete}
                className="text-white-100 hover:text-white-200 transition-colors font-semibold px-1.5 py-1 text-xs cursor-pointer"
              >
                Sim
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsConfirmingDelete(true)}
              title="Remover"
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-white-100 hover:bg-red-200 transition-colors cursor-pointer"
            >
              <TrashIcon size={14} />
            </button>
          )}
        </div>

        {isCharacterDead && (
          <div className="absolute inset-0 bg-red-500/20 flex items-end justify-center pb-3 pointer-events-none">
            <span className="text-red-100 text-xs font-bold tracking-widest">CAÍDO</span>
          </div>
        )}
      </div>

      <div className="flex-1 p-4 flex flex-col gap-3 min-w-0">

        <div className="min-w-0">
          <h3 className="text-white-100 font-bold text-base leading-tight truncate">{character.name}</h3>
          <p className="text-white-300/60 text-xs mt-0.5 truncate">
            {[character.characterClass, character.race].filter(Boolean).join(' · ')}
            {character.playerName && (
              <span className="text-white-300/40"> — {character.playerName}</span>
            )}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-white-300/80 text-xs font-medium flex items-center gap-1.5">
              <span style={{ color: hpColor }}>♥</span> Pontos de Vida
            </span>
            <div className="flex items-center gap-1 text-sm">
              {isEditingHp ? (
                <input
                  autoFocus
                  type="number"
                  value={hpInputValue}
                  onChange={e => setHpInputValue(e.target.value)}
                  onBlur={commitHpEdit}
                  onKeyDown={handleHpInputKeyDown}
                  className="w-14 bg-black-500 border border-red-100 rounded px-1.5 text-center text-white-100 text-sm focus:outline-none tabular-nums"
                />
              ) : (
                <button
                  onClick={startHpEdit}
                  title="Clique para editar HP"
                  className="font-bold tabular-nums hover:opacity-70 transition-opacity"
                  style={{ color: hpColor }}
                >
                  {character.currentHP}
                </button>
              )}
              <span className="text-white-300/40 tabular-nums">/ {character.maxHP}</span>
              <span className="text-white-300/30 text-xs ml-1">({hpPercentage}%)</span>
            </div>
          </div>

          <div className="h-2 w-full bg-black-500 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${hpPercentage}%`,
                backgroundColor: hpColor,
                transition: 'width 0.35s ease, background-color 0.5s ease',
              }}
            />
          </div>

          <div className="flex gap-1">
            {HP_DELTA_OPTIONS.map(delta => (
              <button
                key={delta}
                onClick={() => onHpAdjust(delta)}
                className={`flex-1 text-xs font-medium py-1 rounded border transition-colors cursor-pointer
                  ${delta < 0
                    ? 'border-black-100 text-red-100/70 hover:text-red-100 hover:border-red-400/50 bg-black-500 hover:bg-red-400/10'
                    : 'border-black-100 text-white-300/70 hover:text-white-100 bg-black-500 hover:bg-black-400'
                  }`}
              >
                {delta > 0 ? `+${delta}` : delta}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-black-200" />

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-white-300/80 text-xs font-medium flex items-center gap-1.5">
              <span className="text-yellow">✦</span> Experiência
            </span>
            <span className="text-white-300/50 text-xs tabular-nums">
              {xpProgress.isMaxLevel ? (
                <span className="text-yellow font-semibold">Nível Máximo</span>
              ) : (
                `${formatNumber(xpProgress.xpIntoLevel)} / ${formatNumber(xpProgress.xpNeeded)}`
              )}
            </span>
          </div>

          <div className="h-2 w-full bg-black-500 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${xpProgress.percentage}%`,
                backgroundColor: '#ECC83B',
                transition: 'width 0.35s ease',
              }}
            />
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
