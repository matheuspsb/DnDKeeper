import { useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Combatant, SpotlightImage } from '../types/initiative'
import backendApi from '../services/backendApi'

interface InitiativeState {
  combatants: Combatant[]
  currentIndex: number
  round: number
  spotlight?: SpotlightImage | null
}

const STORAGE_KEY = 'dndkeeper_initiative_v2'
const LEGACY_STORAGE_KEY = 'dndkeeper_initiative'
const FLUSH_DELAY_MS = 500
const EMPTY_STATE: InitiativeState = { combatants: [], currentIndex: 0, round: 1 }

export const initiativeKeys = {
  all: ['initiative'] as const,
}

function loadLocal(): InitiativeState {
  try {
    localStorage.removeItem(LEGACY_STORAGE_KEY)
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

function withHpValues(
  state: InitiativeState,
  id: string,
  hp: number,
  maxHp: number,
): InitiativeState {
  const nextMax = Math.max(1, Math.round(maxHp))
  const nextHp = Math.max(0, Math.min(nextMax, Math.round(hp)))
  return {
    ...state,
    combatants: state.combatants.map((combatant) =>
      combatant.id === id ? { ...combatant, hp: nextHp, maxHp: nextMax } : combatant,
    ),
  }
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

function withHpRevealed(state: InitiativeState, id: string, revealed: boolean): InitiativeState {
  return {
    ...state,
    combatants: state.combatants.map((c) => (c.id === id ? { ...c, hpRevealed: revealed } : c)),
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
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })

  const push = useMutation({
    mutationFn: async (next: InitiativeState) => {
      const res = await backendApi.put<{ state: InitiativeState }>('/api/initiative', next)
      return res.data.state
    },
    onSuccess: (serverState) => {
      queryClient.setQueryData(initiativeKeys.all, serverState)
      saveLocal(serverState)
    },
  })

  const patchSpotlight = useMutation({
    mutationFn: async (spotlight: SpotlightImage | null) => {
      const res = await backendApi.patch<{ state: InitiativeState }>('/api/initiative/spotlight', {
        spotlight,
      })
      return res.data.state
    },
    onMutate: (spotlight) => {
      const next = { ...currentState(), spotlight }
      queryClient.setQueryData(initiativeKeys.all, next)
      saveLocal(next)
    },
    onSuccess: (serverState) => {
      queryClient.setQueryData(initiativeKeys.all, serverState)
      saveLocal(serverState)
    },
  })

  function currentState(): InitiativeState {
    return queryClient.getQueryData<InitiativeState>(initiativeKeys.all) ?? EMPTY_STATE
  }

  function scheduleFlush() {
    if (flushTimer.current) clearTimeout(flushTimer.current)
    flushTimer.current = setTimeout(() => {
      flushTimer.current = null
      push.mutate(currentState())
    }, FLUSH_DELAY_MS)
  }

  function mutate(transform: (s: InitiativeState) => InitiativeState) {
    queryClient.cancelQueries({ queryKey: initiativeKeys.all })
    const next = transform(currentState())
    queryClient.setQueryData(initiativeKeys.all, next)
    saveLocal(next)
    scheduleFlush()
  }

  return {
    combatants: state.combatants,
    currentIndex: state.currentIndex,
    round: state.round,
    spotlight: state.spotlight ?? null,
    isSaving: push.isPending,
    saveFailed: push.isError,
    setSpotlight: (spotlight: SpotlightImage | null) => patchSpotlight.mutate(spotlight),
    setHpRevealed: (id: string, revealed: boolean) =>
      mutate((s) => withHpRevealed(s, id, revealed)),
    addCombatant: (data: Omit<Combatant, 'id'>) => mutate((s) => withCombatant(s, data)),
    addCombatants: (list: Omit<Combatant, 'id'>[]) => {
      if (list.length === 0) return
      mutate((s) => list.reduce((acc, data) => withCombatant(acc, data), s))
    },
    removeCombatant: (id: string) => mutate((s) => withoutCombatant(s, id)),
    adjustHp: (id: string, delta: number) => mutate((s) => withHpDelta(s, id, delta)),
    setHp: (id: string, hp: number, maxHp: number) => mutate((s) => withHpValues(s, id, hp, maxHp)),
    updateInitiative: (id: string, initiative: number) =>
      mutate((s) => withInitiative(s, id, initiative)),
    setConditions: (id: string, conditions: string[]) =>
      mutate((s) => withConditions(s, id, conditions)),
    setImageUrl: (id: string, imageUrl: string) => mutate((s) => withImageUrl(s, id, imageUrl)),
    nextTurn: () => mutate(advanceTurn),
    goToTop: () => mutate((s) => ({ ...s, currentIndex: 0 })),
    reset: () => mutate(() => ({ ...EMPTY_STATE })),
  }
}
