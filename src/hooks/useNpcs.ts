import { useState, useCallback } from 'react'
import type { Npc } from '../types/npc.types'
import { NPC_SEED } from '../constants/npcSeed'

const STORAGE_KEY = 'dndkeeper_npcs'

function load(): Npc[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Npc[]
    persist(NPC_SEED)
    return NPC_SEED
  } catch {
    return NPC_SEED
  }
}

function persist(npcs: Npc[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(npcs))
}

export function useNpcs() {
  const [npcs, setNpcs] = useState<Npc[]>(load)

  const mutate = useCallback((updater: (prev: Npc[]) => Npc[]) => {
    setNpcs((prev) => {
      const next = updater(prev)
      persist(next)
      return next
    })
  }, [])

  const addNpc = useCallback(
    (data: Omit<Npc, 'id'>) => {
      mutate((prev) => [...prev, { ...data, id: crypto.randomUUID() }])
    },
    [mutate],
  )

  const updateNpc = useCallback(
    (id: string, data: Partial<Omit<Npc, 'id'>>) => {
      mutate((prev) => prev.map((npc) => (npc.id === id ? { ...npc, ...data } : npc)))
    },
    [mutate],
  )

  const deleteNpc = useCallback(
    (id: string) => {
      mutate((prev) => prev.filter((npc) => npc.id !== id))
    },
    [mutate],
  )

  return { npcs, addNpc, updateNpc, deleteNpc }
}
