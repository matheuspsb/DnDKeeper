import { useCallback } from 'react'
import { useLocalStorageState } from '../useLocalStorageState'
import type {
  EncounterSnapshot,
  EncounterResult,
  PartyMember,
  MonsterEntry,
} from '../../types/encounter'

const STORAGE_KEY = 'dndkeeper_encounter_history'

export function useEncounterHistory() {
  const [history, setHistory] = useLocalStorageState<EncounterSnapshot[]>(STORAGE_KEY, [])

  const saveEncounter = useCallback(
    (party: PartyMember[], monsters: MonsterEntry[], result: EncounterResult) => {
      if (result.rawXp <= 0 || party.length === 0) return
      const snapshot: EncounterSnapshot = {
        id: crypto.randomUUID(),
        savedAt: Date.now(),
        party: party.map((member) => ({ id: member.id, name: member.name })),
        difficulty: result.difficulty,
        rawXp: result.rawXp,
        xpPerPlayer: result.xpPerPlayer,
        monsterCount: monsters.reduce((total, monster) => total + monster.quantity, 0),
        xpSent: false,
      }
      setHistory((prev) => [snapshot, ...prev])
    },
    [setHistory],
  )

  const markAllSent = useCallback(
    (ids: string[]) => {
      setHistory((prev) =>
        prev.map((snapshot) =>
          ids.includes(snapshot.id) ? { ...snapshot, xpSent: true } : snapshot,
        ),
      )
    },
    [setHistory],
  )

  const deleteSnapshot = useCallback(
    (id: string) => {
      setHistory((prev) => prev.filter((snapshot) => snapshot.id !== id))
    },
    [setHistory],
  )

  const clearHistory = useCallback(() => setHistory([]), [setHistory])

  return { history, saveEncounter, markAllSent, deleteSnapshot, clearHistory }
}
