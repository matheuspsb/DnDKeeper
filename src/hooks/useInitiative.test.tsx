import { act, renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useInitiative } from './useInitiative'
import backendApi from '../services/backendApi'
import type { Combatant } from '../types/initiative'

vi.mock('../services/backendApi', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
  },
}))

const mockedGet = vi.mocked(backendApi.get)
const mockedPut = vi.mocked(backendApi.put)

const MONSTER: Combatant = {
  id: 'm1',
  name: 'Goblin',
  initiative: 10,
  hp: 20,
  maxHp: 20,
  isPlayer: false,
}

const BASE_STATE = { combatants: [MONSTER], currentIndex: 0, round: 1 }

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

// o notifyManager do React Query agenda a notificação de re-render de forma
// assíncrona (microtask/macrotask); com fake timers ativos, um act() síncrono
// não é suficiente para refletir a mudança em `result.current` — precisa
// avançar os timers (0ms) dentro de um act() assíncrono depois de cada mutação
async function flush() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(0)
  })
}

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
  vi.useFakeTimers()
  localStorage.setItem('dndkeeper_initiative_v2', JSON.stringify(BASE_STATE))
  // nunca resolve: o refetch de fundo do useQuery não é o que estamos testando
  // aqui e não deve competir com as edições otimistas locais
  mockedGet.mockImplementation(() => new Promise(() => {}) as never)
  // eco realista do backend real: ele salva e devolve exatamente o que recebeu
  mockedPut.mockImplementation(async (_url, body) => ({ data: { state: body } }) as never)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useInitiative', () => {
  it('carrega o estado inicial do localStorage e aplica edições otimistas na hora', async () => {
    const { result } = renderHook(() => useInitiative(), { wrapper: createWrapper() })
    await flush()

    expect(result.current.combatants[0].hp).toBe(20)

    act(() => result.current.adjustHp('m1', -5))
    await flush()

    expect(result.current.combatants[0].hp).toBe(15)
    expect(mockedPut).not.toHaveBeenCalled()
  })

  it('múltiplos cliques dentro da janela de debounce viram um único PUT com o efeito acumulado', async () => {
    const { result } = renderHook(() => useInitiative(), { wrapper: createWrapper() })
    await flush()

    act(() => result.current.adjustHp('m1', -5))
    await flush()
    act(() => result.current.adjustHp('m1', -5))
    await flush()
    act(() => result.current.adjustHp('m1', -5))
    await flush()

    expect(result.current.combatants[0].hp).toBe(5)
    expect(mockedPut).not.toHaveBeenCalled()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500)
    })

    expect(mockedPut).toHaveBeenCalledTimes(1)
    const [, sentBody] = mockedPut.mock.calls[0]
    expect((sentBody as typeof BASE_STATE).combatants[0].hp).toBe(5)
  })

  it('hasPendingLocalChange fica true enquanto há flush agendado ou PUT em voo', async () => {
    const { result } = renderHook(() => useInitiative(), { wrapper: createWrapper() })
    await flush()

    expect(result.current.hasPendingLocalChange()).toBe(false)

    act(() => result.current.adjustHp('m1', -5))
    expect(result.current.hasPendingLocalChange()).toBe(true)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500)
    })

    expect(result.current.hasPendingLocalChange()).toBe(false)
  })

  it('ignora a resposta de um PUT superado por uma edição local mais nova, em vez de reverter o HP (regressão)', async () => {
    let resolveFirstPut!: (value: { data: { state: typeof BASE_STATE } }) => void
    mockedPut.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFirstPut = resolve
        }) as never,
    )

    const { result } = renderHook(() => useInitiative(), { wrapper: createWrapper() })
    await flush()

    // clique 1: -5 (HP 20 -> 15), o flush dispara o PUT, que fica pendurado
    act(() => result.current.adjustHp('m1', -5))
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500)
    })
    expect(mockedPut).toHaveBeenCalledTimes(1)
    const firstSentBody = mockedPut.mock.calls[0][1] as typeof BASE_STATE
    expect(firstSentBody.combatants[0].hp).toBe(15)

    // clique 2 chega ENQUANTO o primeiro PUT ainda está em voo (HP 15 -> 10)
    act(() => result.current.adjustHp('m1', -5))
    await flush()
    expect(result.current.combatants[0].hp).toBe(10)

    // o primeiro PUT finalmente resolve, carregando o valor antigo (hp=15)
    await act(async () => {
      resolveFirstPut({ data: { state: firstSentBody } })
      await vi.advanceTimersByTimeAsync(0)
    })

    // não pode reverter para 15 — a edição do clique 2 é mais nova que essa resposta
    expect(result.current.combatants[0].hp).toBe(10)

    // o flush do clique 2 dispara seu próprio PUT com o valor correto (10)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500)
    })
    expect(mockedPut).toHaveBeenCalledTimes(2)
    const secondSentBody = mockedPut.mock.calls[1][1] as typeof BASE_STATE
    expect(secondSentBody.combatants[0].hp).toBe(10)
    expect(result.current.combatants[0].hp).toBe(10)
  })
})
