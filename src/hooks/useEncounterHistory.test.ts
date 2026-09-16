import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useEncounterHistory } from './useEncounterHistory'
import type { EncounterResult, MonsterEntry, PartyMember } from '../types/encounter'

const PARTY: PartyMember[] = [
  { id: 'p1', name: 'Aria', level: 5 },
  { id: 'p2', name: 'Boff', level: 5 },
]

const MONSTERS: MonsterEntry[] = [{ id: 'm1', name: 'Goblin', cr: '1/4', quantity: 3 }]

function makeResult(overrides: Partial<EncounterResult> = {}): EncounterResult {
  return {
    rawXp: 200,
    adjustedXp: 300,
    multiplier: 1.5,
    xpPerPlayer: 150,
    thresholds: { easy: 100, medium: 200, hard: 300, deadly: 400 },
    difficulty: 'medium',
    ...overrides,
  }
}

beforeEach(() => {
  localStorage.clear()
})

describe('useEncounterHistory', () => {
  it('começa vazio', () => {
    const { result } = renderHook(() => useEncounterHistory())
    expect(result.current.history).toEqual([])
  })

  it('saveEncounter adiciona um snapshot no início do histórico', () => {
    const { result } = renderHook(() => useEncounterHistory())

    act(() => result.current.saveEncounter(PARTY, MONSTERS, makeResult()))

    expect(result.current.history).toHaveLength(1)
    const [snapshot] = result.current.history
    expect(snapshot.party).toEqual([
      { id: 'p1', name: 'Aria' },
      { id: 'p2', name: 'Boff' },
    ])
    expect(snapshot.difficulty).toBe('medium')
    expect(snapshot.rawXp).toBe(200)
    expect(snapshot.xpPerPlayer).toBe(150)
    expect(snapshot.monsterCount).toBe(3)
    expect(snapshot.xpSent).toBe(false)
    expect(snapshot.id).toBeTruthy()
  })

  it('snapshots mais novos entram na frente da lista', () => {
    const { result } = renderHook(() => useEncounterHistory())

    act(() => result.current.saveEncounter(PARTY, MONSTERS, makeResult({ rawXp: 100 })))
    act(() => result.current.saveEncounter(PARTY, MONSTERS, makeResult({ rawXp: 200 })))

    expect(result.current.history.map((s) => s.rawXp)).toEqual([200, 100])
  })

  it('não salva quando rawXp é 0 ou negativo', () => {
    const { result } = renderHook(() => useEncounterHistory())

    act(() => result.current.saveEncounter(PARTY, MONSTERS, makeResult({ rawXp: 0 })))
    act(() => result.current.saveEncounter(PARTY, MONSTERS, makeResult({ rawXp: -50 })))

    expect(result.current.history).toHaveLength(0)
  })

  it('não salva quando o grupo está vazio', () => {
    const { result } = renderHook(() => useEncounterHistory())

    act(() => result.current.saveEncounter([], MONSTERS, makeResult()))

    expect(result.current.history).toHaveLength(0)
  })

  it('markAllSent marca só os ids indicados', () => {
    const { result } = renderHook(() => useEncounterHistory())
    act(() => result.current.saveEncounter(PARTY, MONSTERS, makeResult()))
    act(() => result.current.saveEncounter(PARTY, MONSTERS, makeResult()))
    const [first, second] = result.current.history

    act(() => result.current.markAllSent([first.id]))

    expect(result.current.history.find((s) => s.id === first.id)?.xpSent).toBe(true)
    expect(result.current.history.find((s) => s.id === second.id)?.xpSent).toBe(false)
  })

  it('deleteSnapshot remove só o snapshot indicado', () => {
    const { result } = renderHook(() => useEncounterHistory())
    act(() => result.current.saveEncounter(PARTY, MONSTERS, makeResult()))
    act(() => result.current.saveEncounter(PARTY, MONSTERS, makeResult()))
    const idToDelete = result.current.history[0].id

    act(() => result.current.deleteSnapshot(idToDelete))

    expect(result.current.history).toHaveLength(1)
    expect(result.current.history.some((s) => s.id === idToDelete)).toBe(false)
  })

  it('clearHistory esvazia tudo', () => {
    const { result } = renderHook(() => useEncounterHistory())
    act(() => result.current.saveEncounter(PARTY, MONSTERS, makeResult()))

    act(() => result.current.clearHistory())

    expect(result.current.history).toEqual([])
  })

  it('persiste entre remounts', () => {
    const { result, unmount } = renderHook(() => useEncounterHistory())
    act(() => result.current.saveEncounter(PARTY, MONSTERS, makeResult()))
    unmount()

    const { result: second } = renderHook(() => useEncounterHistory())
    expect(second.current.history).toHaveLength(1)
  })
})
