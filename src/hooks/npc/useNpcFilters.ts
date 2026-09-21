import { useDeferredValue, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Npc, NpcStatus } from '../../types/npc.types'
import { FACTIONS } from '../../constants/npc.constants'

export type StatusFilter = NpcStatus | 'todos'

function matches(npc: Npc, term: string) {
  const haystack = [npc.name, npc.faction, npc.description, npc.notes].join(' ').toLowerCase()
  return haystack.includes(term)
}

function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural
}

export function useNpcFilters(npcs: Npc[]) {
  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get('q') ?? ''
  const deferredQuery = useDeferredValue(query)
  const statusFilter = (searchParams.get('status') ?? 'todos') as StatusFilter

  function setParam(key: 'status' | 'q', value: string, emptyValue: string) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        value === emptyValue ? next.delete(key) : next.set(key, value)
        return next
      },
      { replace: true },
    )
  }

  const setQuery = (value: string) => setParam('q', value, '')
  const setStatusFilter = (value: StatusFilter) => setParam('status', value, 'todos')
  const clearFilters = () => setSearchParams(new URLSearchParams(), { replace: true })

  const filtered = useMemo(() => {
    const term = deferredQuery.trim().toLowerCase()
    return npcs.filter((npc) => {
      if (statusFilter !== 'todos' && npc.status !== statusFilter) return false
      if (term && !matches(npc, term)) return false
      return true
    })
  }, [npcs, statusFilter, deferredQuery])

  const groupedByFaction = useMemo(() => {
    return FACTIONS.map((faction) => ({
      faction,
      npcs: filtered.filter((npc) => npc.faction === faction),
    })).filter(({ npcs: factionNpcs }) => factionNpcs.length > 0)
  }, [filtered])

  const hasActiveFilters = query.trim() !== '' || statusFilter !== 'todos'

  const meta = useMemo(() => {
    const factionCount = groupedByFaction.length
    const npcsLabel = pluralize(npcs.length, 'ficha', 'fichas')
    const factionsLabel = pluralize(factionCount, 'facção', 'facções')
    const filteredSuffix =
      filtered.length !== npcs.length ? ` · ${filtered.length} em exibição` : ''
    return `${npcs.length} ${npcsLabel} · ${factionCount} ${factionsLabel}${filteredSuffix}`
  }, [npcs.length, filtered.length, groupedByFaction.length])

  return {
    query,
    statusFilter,
    filtered,
    groupedByFaction,
    hasActiveFilters,
    meta,
    setQuery,
    setStatusFilter,
    clearFilters,
  }
}
