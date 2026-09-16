import type { Character } from '../../../types/character'
import { getXpProgress } from '../../../constants/dnd'
import { resolveImageUrl } from '../../../constants/arts'
import { formatNumber } from '../../../utils/number'
import UsersIcon from '../../atoms/icons/UsersIcon'
import CharacterCardActions from './CharacterCardActions'
import CharacterHpControls from './CharacterHpControls'

interface CharacterCardProps {
  character: Character
  onEdit: () => void
  onDelete: () => void
  onHpAdjust: (delta: number) => void
}

function CharacterCard({ character, onEdit, onDelete, onHpAdjust }: CharacterCardProps) {
  const xpProgress = getXpProgress(character.xp)
  const isCharacterDead = character.currentHP === 0

  return (
    <div
      className={`group bg-black-300 border rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black-500/60
        ${isCharacterDead ? 'border-red-400/60' : 'border-black-100 hover:border-black-200'}`}
    >
      <div className="h-64 relative bg-black-400 shrink-0">
        <div className="absolute inset-0 overflow-hidden cursor-pointer" onClick={onEdit}>
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

        <CharacterCardActions onEdit={onEdit} onDelete={onDelete} />

        {isCharacterDead && (
          <div className="absolute inset-0 bg-red-500/20 flex items-end justify-center pb-3 pointer-events-none">
            <span className="text-red-100 text-xs font-bold tracking-widest">CAÍDO</span>
          </div>
        )}
      </div>

      <div className="flex-1 p-4 flex flex-col gap-3 min-w-0">
        <div className="min-w-0">
          <h3 className="text-white-100 font-bold text-base leading-tight truncate">
            {character.name}
          </h3>
          <p className="text-white-300/60 text-xs mt-0.5 truncate">
            {[character.characterClass, character.race].filter(Boolean).join(' · ')}
            {character.playerName && (
              <span className="text-white-300/40"> — {character.playerName}</span>
            )}
          </p>
        </div>

        <CharacterHpControls
          currentHP={character.currentHP}
          maxHP={character.maxHP}
          onHpAdjust={onHpAdjust}
        />

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
              {formatNumber(character.xp)} XP total · Nível {xpProgress.level} →{' '}
              {xpProgress.level + 1}
            </p>
          )}
        </div>

        {character.notes && (
          <div className="border-t border-black-200 pt-2.5">
            <p className="text-white-300/50 text-xs leading-relaxed line-clamp-2">
              {character.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CharacterCard
