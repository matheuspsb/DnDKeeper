import { useState, useCallback } from 'react'
import type { Combatant } from '../types/initiative'

interface InitiativeState {
  combatants: Combatant[]
  currentIndex: number
  round: number
}

const STORAGE_KEY = 'dndkeeper_initiative'
const INITIAL_STATE: InitiativeState = { combatants: [], currentIndex: 0, round: 1 }

function load(): InitiativeState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as InitiativeState) : INITIAL_STATE
  } catch {
    return INITIAL_STATE
  }
}

function sortedByInitiative(list: Combatant[]): Combatant[] {
  return [...list].sort((a, b) => b.initiative - a.initiative)
}

function currentId(state: InitiativeState): string | undefined {
  return state.combatants[state.currentIndex]?.id
}

function indexById(combatants: Combatant[], id: string | undefined): number {
  if (!id) return 0
  const index = combatants.findIndex(combatant => combatant.id === id)
  return index >= 0 ? index : 0
}

export function useInitiative() {
  const [state, setState] = useState<InitiativeState>(load)

  const save = useCallback((next: InitiativeState) => {
    setState(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const addCombatant = useCallback(
    (data: Omit<Combatant, 'id'>) => {
      setState(prev => {
        const activeId = currentId(prev)
        const next = sortedByInitiative([
          ...prev.combatants,
          { ...data, id: crypto.randomUUID() },
        ])
        const nextState = { ...prev, combatants: next, currentIndex: indexById(next, activeId) }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
        return nextState
      })
    },
    [],
  )

  const removeCombatant = useCallback(
    (id: string) => {
      setState(prev => {
        const next = prev.combatants.filter(combatant => combatant.id !== id)
        const newIndex = Math.min(prev.currentIndex, Math.max(0, next.length - 1))
        const nextState = { ...prev, combatants: next, currentIndex: newIndex }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
        return nextState
      })
    },
    [],
  )

  const adjustHp = useCallback(
    (id: string, delta: number) => {
      setState(prev => {
        const next = prev.combatants.map(combatant => {
          if (combatant.id !== id || combatant.hp === null || combatant.maxHp === null) return combatant
          return { ...combatant, hp: Math.max(0, Math.min(combatant.maxHp, combatant.hp + delta)) }
        })
        const nextState = { ...prev, combatants: next }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
        return nextState
      })
    },
    [],
  )

  const updateInitiative = useCallback(
    (id: string, initiative: number) => {
      setState(prev => {
        const activeId = currentId(prev)
        const updated = prev.combatants.map(combatant => (combatant.id === id ? { ...combatant, initiative } : combatant))
        const next = sortedByInitiative(updated)
        const nextState = { ...prev, combatants: next, currentIndex: indexById(next, activeId) }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
        return nextState
      })
    },
    [],
  )

  const nextTurn = useCallback(() => {
    setState(prev => {
      if (prev.combatants.length === 0) return prev
      const nextIndex = (prev.currentIndex + 1) % prev.combatants.length
      const newRound = nextIndex === 0 ? prev.round + 1 : prev.round
      const nextState = { ...prev, currentIndex: nextIndex, round: newRound }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
      return nextState
    })
  }, [])

  const reset = useCallback(() => save(INITIAL_STATE), [save])

  return {
    combatants: state.combatants,
    currentIndex: state.currentIndex,
    round: state.round,
    addCombatant,
    removeCombatant,
    adjustHp,
    updateInitiative,
    nextTurn,
    reset,
  }
}
