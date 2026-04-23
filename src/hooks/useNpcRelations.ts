import { useState, useCallback } from 'react'
import type { NpcRelation, RelationType } from '../types/npcRelation.types'

const STORAGE_KEY = 'dndkeeper_npc_relations'

function load(): NpcRelation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as NpcRelation[]) : []
  } catch {
    return []
  }
}

function persist(relations: NpcRelation[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(relations))
}

export function useNpcRelations() {
  const [relations, setRelations] = useState<NpcRelation[]>(load)

  const mutate = useCallback((updater: (prev: NpcRelation[]) => NpcRelation[]) => {
    setRelations(prev => {
      const next = updater(prev)
      persist(next)
      return next
    })
  }, [])

  const addRelation = useCallback(
    (data: { sourceId: string; targetId: string; type: RelationType; label?: string }) => {
      mutate(prev => {
        const id = crypto.randomUUID()
        const mirrorId = crypto.randomUUID()
        const forward: NpcRelation = { ...data, id }
        const mirror: NpcRelation = {
          id: mirrorId,
          sourceId: data.targetId,
          targetId: data.sourceId,
          type: data.type,
          label: data.label,
        }
        return [...prev, forward, mirror]
      })
    },
    [mutate],
  )

  const deleteRelation = useCallback(
    (id: string) => {
      mutate(prev => {
        const target = prev.find(r => r.id === id)
        if (!target) return prev
        return prev.filter(
          r =>
            r.id !== id &&
            !(r.sourceId === target.targetId && r.targetId === target.sourceId && r.type === target.type),
        )
      })
    },
    [mutate],
  )

  const deleteRelationsForNpc = useCallback(
    (npcId: string) => {
      mutate(prev => prev.filter(r => r.sourceId !== npcId && r.targetId !== npcId))
    },
    [mutate],
  )

  return { relations, addRelation, deleteRelation, deleteRelationsForNpc }
}
