import { memo } from 'react'
import { Link } from 'react-router-dom'
import { resolveImageUrl } from '../../../constants/arts'
import type { Character } from '../../../types/character'
import UsersIcon from '../../atoms/icons/UsersIcon'

const CharacterResult = memo(function CharacterResult({ character }: { character: Character }) {
  return (
    <Link
      to="/personagens"
      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-black-300 transition-colors"
    >
      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-black-300">
        {character.imageUrl ? (
          <img
            src={resolveImageUrl(character.imageUrl)}
            alt={character.name}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white-300/30">
            <UsersIcon size={20} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-white-100 text-sm font-medium truncate">{character.name}</span>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-yellow/20 text-yellow shrink-0">
            PC
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5 text-white-300/50 text-xs">
          {character.playerName && <span>{character.playerName}</span>}
          {character.playerName && (character.characterClass || character.race) && (
            <span className="text-white-300/30">·</span>
          )}
          {character.characterClass && <span>{character.characterClass}</span>}
          {character.characterClass && character.race && (
            <span className="text-white-300/30">·</span>
          )}
          {character.race && <span>{character.race}</span>}
        </div>
      </div>
    </Link>
  )
})

export default CharacterResult
