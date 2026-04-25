import { useGlobalSearch } from '../hooks/useGlobalSearch'
import { useSearchInput } from '../hooks/useSearchInput'
import { useAuth } from '../contexts/AuthContext'
import NpcResult from '../components/molecules/search/NpcResult'
import CharacterResult from '../components/molecules/search/CharacterResult'
import ResultSection from '../components/molecules/search/ResultSection'
import Input from '../components/atoms/Input'
import SearchIcon from '../components/atoms/icons/SearchIcon'

function Search() {
  const { user } = useAuth()
  const { query, inputValue, handleChange } = useSearchInput()
  const { results } = useGlobalSearch(query)

  const visibleCharacters = user?.role === 'dm' ? results.characters : []
  const visibleTotal = results.npcs.length + visibleCharacters.length

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
              value={inputValue}
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
