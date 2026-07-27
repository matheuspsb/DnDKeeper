import { useMemo } from 'react'
import { useNpcs } from './useNpcs'
import { useCharacters } from './useCharacters'

function matchesQuery(fields: (string | undefined)[], query: string): boolean {
  const lowerCaseQuery = query.toLowerCase()
  return fields.some((field) => field?.toLowerCase().includes(lowerCaseQuery))
}

export function useGlobalSearch(query: string) {
  const { data: npcs = [] } = useNpcs()
  const { characters } = useCharacters()

  const { results, total } = useMemo(() => {
    const trimmed = query.trim()
    if (!trimmed) return { results: { npcs: [], characters: [] }, total: 0 }

    const filteredNpcs = npcs.filter((npc) =>
      matchesQuery([npc.name, npc.faction, npc.description, npc.notes], trimmed),
    )
    const filteredChars = characters.filter((char) =>
      matchesQuery([char.name, char.playerName, char.characterClass, char.race, char.notes], trimmed),
    )

    return {
      results: { npcs: filteredNpcs, characters: filteredChars },
      total: filteredNpcs.length + filteredChars.length,
    }
  }, [query, npcs, characters])

  return { results, total }
}
