import { useState, useCallback } from 'react'
import type { EncounterSnapshot, EncounterResult, PartyMember, MonsterEntry } from '../types/encounter'

const STORAGE_KEY = 'dndkeeper_encounter_history'

function load(): EncounterSnapshot[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as EncounterSnapshot[]) : []
  } catch {
    return []
  }
}

function persist(history: EncounterSnapshot[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

export function useEncounterHistory() {
  const [history, setHistory] = useState<EncounterSnapshot[]>(load)

  const mutate = useCallback((updater: (prev: EncounterSnapshot[]) => EncounterSnapshot[]) => {
    setHistory(prev => {
      const next = updater(prev)
      persist(next)
      return next
    })
  }, [])

  const saveEncounter = useCallback(
    (party: PartyMember[], monsters: MonsterEntry[], result: EncounterResult) => {
      if (result.rawXp <= 0 || party.length === 0) return
      const snapshot: EncounterSnapshot = {
        id: crypto.randomUUID(),
        savedAt: Date.now(),
        party: party.map(member => ({ id: member.id, name: member.name })),
        difficulty: result.difficulty,
        rawXp: result.rawXp,
        xpPerPlayer: result.xpPerPlayer,
        monsterCount: monsters.reduce((total, monster) => total + monster.quantity, 0),
        xpSent: false,
      }
      mutate(prev => [snapshot, ...prev])
    },
    [mutate],
  )

  const markAllSent = useCallback(
    (ids: string[]) => {
      mutate(prev => prev.map(snapshot => (ids.includes(snapshot.id) ? { ...snapshot, xpSent: true } : snapshot)))
    },
    [mutate],
  )

  const deleteSnapshot = useCallback(
    (id: string) => {
      mutate(prev => prev.filter(snapshot => snapshot.id !== id))
    },
    [mutate],
  )

  const clearHistory = useCallback(() => mutate(() => []), [mutate])

  return { history, saveEncounter, markAllSent, deleteSnapshot, clearHistory }
}
