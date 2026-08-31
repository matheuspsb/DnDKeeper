import { useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Combatant } from '../types/initiative'
import backendApi from '../services/backendApi'

interface InitiativeState {
  combatants: Combatant[]
  currentIndex: number
  round: number
}

const STORAGE_KEY = 'dndkeeper_initiative'
const HP_FLUSH_DELAY_MS = 600
const EMPTY_STATE: InitiativeState = { combatants: [], currentIndex: 0, round: 1 }

export const initiativeKeys = {
  all: ['initiative'] as const,
}

function loadLocal(): InitiativeState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as InitiativeState) : EMPTY_STATE
  } catch {
    return EMPTY_STATE
  }
}

export function saveLocal(state: InitiativeState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

function sortedByInitiative(list: Combatant[]): Combatant[] {
  return [...list].sort((a, b) => b.initiative - a.initiative)
}

function currentId(state: InitiativeState): string | undefined {
  return state.combatants[state.currentIndex]?.id
}

function indexById(combatants: Combatant[], id: string | undefined): number {
  if (!id) return 0
  const index = combatants.findIndex((c) => c.id === id)
  return index >= 0 ? index : 0
}

function withCombatant(state: InitiativeState, data: Omit<Combatant, 'id'>): InitiativeState {
  const activeId = currentId(state)
  const combatants = sortedByInitiative([...state.combatants, { ...data, id: crypto.randomUUID() }])
  return { ...state, combatants, currentIndex: indexById(combatants, activeId) }
}

function withoutCombatant(state: InitiativeState, id: string): InitiativeState {
  const combatants = state.combatants.filter((c) => c.id !== id)
  const currentIndex = Math.min(state.currentIndex, Math.max(0, combatants.length - 1))
  return { ...state, combatants, currentIndex }
}

function withHpDelta(state: InitiativeState, id: string, delta: number): InitiativeState {
  const combatants = state.combatants.map((c) => {
    if (c.id !== id || c.hp === null || c.maxHp === null) return c
    return { ...c, hp: Math.max(0, Math.min(c.maxHp, c.hp + delta)) }
  })
  return { ...state, combatants }
}

function withInitiative(state: InitiativeState, id: string, initiative: number): InitiativeState {
  const activeId = currentId(state)
  const combatants = sortedByInitiative(
    state.combatants.map((c) => (c.id === id ? { ...c, initiative } : c)),
  )
  return { ...state, combatants, currentIndex: indexById(combatants, activeId) }
}

function withConditions(state: InitiativeState, id: string, conditions: string[]): InitiativeState {
  return {
    ...state,
    combatants: state.combatants.map((c) => (c.id === id ? { ...c, conditions } : c)),
  }
}

function withImageUrl(state: InitiativeState, id: string, imageUrl: string): InitiativeState {
  return {
    ...state,
    combatants: state.combatants.map((c) =>
      c.id === id ? { ...c, imageUrl: imageUrl || undefined } : c,
    ),
  }
}

function advanceTurn(state: InitiativeState): InitiativeState {
  if (state.combatants.length === 0) return state
  const currentIndex = (state.currentIndex + 1) % state.combatants.length
  const round = currentIndex === 0 ? state.round + 1 : state.round
  return { ...state, currentIndex, round }
}

async function fetchInitiative(): Promise<InitiativeState> {
  const res = await backendApi.get<{ state: InitiativeState }>('/api/initiative')
  return res.data.state
}

export function useInitiative() {
  const queryClient = useQueryClient()
  const flushTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { data: state = EMPTY_STATE } = useQuery({
    queryKey: initiativeKeys.all,
    queryFn: fetchInitiative,
    initialData: loadLocal,
    refetchInterval: 20_000,
    refetchOnWindowFocus: true,
  })

  const commit = useMutation({
    mutationFn: async (next: InitiativeState) => {
      const res = await backendApi.put<{ state: InitiativeState }>('/api/initiative', next)
      return res.data.state
    },
    onMutate: async (next) => {
      await queryClient.cancelQueries({ queryKey: initiativeKeys.all })
      const prev = queryClient.getQueryData<InitiativeState>(initiativeKeys.all)
      queryClient.setQueryData(initiativeKeys.all, next)
      saveLocal(next)
      return { prev }
    },
    onError: (_err, _next, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(initiativeKeys.all, ctx.prev)
        saveLocal(ctx.prev)
      }
    },
    onSuccess: (serverState) => {
      queryClient.setQueryData(initiativeKeys.all, serverState)
      saveLocal(serverState)
    },
  })

  function currentState(): InitiativeState {
    return queryClient.getQueryData<InitiativeState>(initiativeKeys.all) ?? EMPTY_STATE
  }

  function apply(transform: (s: InitiativeState) => InitiativeState) {
    if (flushTimer.current) {
      clearTimeout(flushTimer.current)
      flushTimer.current = null
    }
    commit.mutate(transform(currentState()))
  }

  function adjustHp(id: string, delta: number) {
    const next = withHpDelta(currentState(), id, delta)
    queryClient.setQueryData(initiativeKeys.all, next)
    saveLocal(next)
    if (flushTimer.current) clearTimeout(flushTimer.current)
    flushTimer.current = setTimeout(() => {
      flushTimer.current = null
      commit.mutate(currentState())
    }, HP_FLUSH_DELAY_MS)
  }

  return {
    combatants: state.combatants,
    currentIndex: state.currentIndex,
    round: state.round,
    addCombatant: (data: Omit<Combatant, 'id'>) => apply((s) => withCombatant(s, data)),
    removeCombatant: (id: string) => apply((s) => withoutCombatant(s, id)),
    adjustHp,
    updateInitiative: (id: string, initiative: number) =>
      apply((s) => withInitiative(s, id, initiative)),
    setConditions: (id: string, conditions: string[]) =>
      apply((s) => withConditions(s, id, conditions)),
    setImageUrl: (id: string, imageUrl: string) => apply((s) => withImageUrl(s, id, imageUrl)),
    nextTurn: () => apply(advanceTurn),
    goToTop: () => apply((s) => ({ ...s, currentIndex: 0 })),
    reset: () => apply(() => ({ ...EMPTY_STATE })),
  }
}
