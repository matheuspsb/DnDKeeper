import { useState, useCallback, useMemo } from 'react'
import type { PartyMember, MonsterEntry } from '../types/encounter'
import type { CR } from '../types/encounter'
import type { Character } from '../types/character'
import { calculateEncounter } from '../utils/encounter'
import { getLevel } from '../constants/dnd'

export function useEncounter() {
  const [party, setParty] = useState<PartyMember[]>([])
  const [monsters, setMonsters] = useState<MonsterEntry[]>([])

  const addPartyMember = useCallback(() => {
    setParty(prev => [...prev, { id: crypto.randomUUID(), name: '', level: 1 }])
  }, [])

  const updatePartyMember = useCallback((id: string, data: Partial<Omit<PartyMember, 'id'>>) => {
    setParty(prev => prev.map(m => (m.id === id ? { ...m, ...data } : m)))
  }, [])

  const removePartyMember = useCallback((id: string) => {
    setParty(prev => prev.filter(m => m.id !== id))
  }, [])

  const importFromCharacters = useCallback((characters: Character[]) => {
    setParty(
      characters.map(c => ({
        id: c.id,
        name: c.name,
        level: getLevel(c.xp),
      })),
    )
  }, [])

  const addMonster = useCallback(() => {
    setMonsters(prev => [...prev, { id: crypto.randomUUID(), name: '', cr: '1' as CR, quantity: 1 }])
  }, [])

  const updateMonster = useCallback((id: string, data: Partial<Omit<MonsterEntry, 'id'>>) => {
    setMonsters(prev => prev.map(m => (m.id === id ? { ...m, ...data } : m)))
  }, [])

  const removeMonster = useCallback((id: string) => {
    setMonsters(prev => prev.filter(m => m.id !== id))
  }, [])

  const clearMonsters = useCallback(() => setMonsters([]), [])

  const result = useMemo(() => calculateEncounter(party, monsters), [party, monsters])

  return {
    party,
    monsters,
    result,
    addPartyMember,
    updatePartyMember,
    removePartyMember,
    importFromCharacters,
    addMonster,
    updateMonster,
    removeMonster,
    clearMonsters,
  }
}
