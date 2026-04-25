import { memo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useGlobalSearch } from '../hooks/useGlobalSearch'
import { useAuth } from '../contexts/AuthContext'
import { FACTION_COLOR, NPC_STATUS_LABEL, NPC_STATUS_COLOR } from '../constants/npc.constants'
import { resolveImageUrl } from '../constants/arts'
import type { Npc } from '../types/npc.types'
import type { Character } from '../types/character'
import Input from '../components/atoms/Input'
import SearchIcon from '../components/atoms/icons/SearchIcon'
import MaskIcon from '../components/atoms/icons/MaskIcon'
import UsersIcon from '../components/atoms/icons/UsersIcon'

const NpcResult = memo(function NpcResult({ npc }: { npc: Npc }) {
  return (
    <Link
      to="/npcs"
      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-black-300 transition-colors group"
    >
      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-black-300">
        {npc.imageUrl ? (
          <img
            src={resolveImageUrl(npc.imageUrl)}
            alt={npc.name}
            className="w-full h-full object-cover"
            style={{ objectPosition: npc.imagePosition ?? 'top' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white-300/30">
            <MaskIcon size={20} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-white-100 text-sm font-medium truncate">{npc.name}</span>
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0"
            style={{ color: NPC_STATUS_COLOR[npc.status], backgroundColor: NPC_STATUS_COLOR[npc.status] + '22' }}
          >
            {NPC_STATUS_LABEL[npc.status]}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className="text-[10px] font-semibold"
            style={{ color: FACTION_COLOR[npc.faction] }}
          >
            {npc.faction}
          </span>
          {npc.description && (
            <>
              <span className="text-white-300/30 text-[10px]">·</span>
              <span className="text-white-300/50 text-xs truncate">{npc.description}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
})

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

function ResultSection({
  title,
  count,
  children,
}: {
  title: string
  count: number
  children: React.ReactNode
}) {
  return (
    <section>
      <div className="flex items-center gap-2 px-4 mb-1">
        <span className="text-white-300/50 text-xs font-semibold uppercase tracking-wider">
          {title}
        </span>
        <span className="text-white-300/30 text-xs">{count}</span>
      </div>
      <div className="flex flex-col">{children}</div>
    </section>
  )
}

function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()
  const query = searchParams.get('q') ?? ''

  const { results } = useGlobalSearch(query)

  const visibleCharacters = user?.role === 'dm' ? results.characters : []
  const visibleTotal = results.npcs.length + visibleCharacters.length

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setSearchParams(val ? { q: val } : {}, { replace: true })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 px-8 pt-4 pb-4 border-b border-black-200">
        <div className="flex items-center gap-3">
          <h2 className="text-white-100 text-3xl font-bold shrink-0">Busca</h2>
          <div className="relative flex-1 max-w-md">
            <SearchIcon
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white-300/40 pointer-events-none"
            />
            <Input
              value={query}
              onChange={handleChange}
              placeholder="NPCs, personagens, facções..."
              className="w-full bg-black-400 rounded-lg pl-9 pr-4 py-2"
              autoFocus
            />
          </div>
          {query && (
            <span className="text-white-300/40 text-sm shrink-0">
              {visibleTotal} resultado{visibleTotal !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {!query && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <SearchIcon size={36} className="text-white-300/15" />
            <p className="text-white-300/40 text-sm">Digite para buscar NPCs e personagens</p>
          </div>
        )}

        {query && visibleTotal === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
            <p className="text-white-300/50 text-sm">
              Nenhum resultado para <span className="text-white-300">"{query}"</span>
            </p>
          </div>
        )}

        {query && visibleTotal > 0 && (
          <div className="flex flex-col gap-6 px-4">
            {results.npcs.length > 0 && (
              <ResultSection title="NPCs" count={results.npcs.length}>
                {results.npcs.map((npc) => (
                  <NpcResult key={npc.id} npc={npc} />
                ))}
              </ResultSection>
            )}

            {visibleCharacters.length > 0 && (
              <ResultSection title="Personagens" count={visibleCharacters.length}>
                {visibleCharacters.map((char) => (
                  <CharacterResult key={char.id} character={char} />
                ))}
              </ResultSection>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Search
