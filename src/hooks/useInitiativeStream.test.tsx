import { act, renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useInitiativeStream } from './useInitiativeStream'
import { initiativeKeys } from './useInitiative'

class FakeEventSource {
  static instances: FakeEventSource[] = []
  listeners: Record<string, ((event: { data: string }) => void)[]> = {}

  constructor(
    public url: string,
    public options?: EventSourceInit,
  ) {
    FakeEventSource.instances.push(this)
  }

  addEventListener(type: string, listener: (event: { data: string }) => void) {
    ;(this.listeners[type] ??= []).push(listener)
  }

  removeEventListener() {}
  close() {}

  emit(type: string, data: unknown) {
    for (const listener of this.listeners[type] ?? []) {
      listener({ data: JSON.stringify(data) })
    }
  }
}

beforeEach(() => {
  FakeEventSource.instances = []
  globalThis.EventSource = FakeEventSource as unknown as typeof EventSource
})

function createWrapper(queryClient: QueryClient) {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useInitiativeStream', () => {
  it('aplica o snapshot recebido no cache quando não há shouldSkip', () => {
    const queryClient = new QueryClient()
    renderHook(() => useInitiativeStream(), { wrapper: createWrapper(queryClient) })
    const source = FakeEventSource.instances[0]

    act(() => source.emit('state', { state: { combatants: [], currentIndex: 0, round: 2 } }))

    expect(queryClient.getQueryData(initiativeKeys.all)).toEqual({
      combatants: [],
      currentIndex: 0,
      round: 2,
    })
  })

  it('ignora o snapshot quando shouldSkip() retorna true (edição local pendente)', () => {
    const queryClient = new QueryClient()
    queryClient.setQueryData(initiativeKeys.all, { combatants: [], currentIndex: 0, round: 1 })
    renderHook(() => useInitiativeStream(() => true), { wrapper: createWrapper(queryClient) })
    const source = FakeEventSource.instances[0]

    act(() => source.emit('state', { state: { combatants: [], currentIndex: 0, round: 99 } }))

    expect(queryClient.getQueryData(initiativeKeys.all)).toEqual({
      combatants: [],
      currentIndex: 0,
      round: 1,
    })
  })

  it('usa sempre a versão mais recente de shouldSkip, sem recriar a conexão SSE', () => {
    const queryClient = new QueryClient()
    let skip = true
    const { rerender } = renderHook(({ fn }) => useInitiativeStream(fn), {
      wrapper: createWrapper(queryClient),
      initialProps: { fn: () => skip },
    })
    expect(FakeEventSource.instances).toHaveLength(1)

    skip = false
    rerender({ fn: () => skip })
    expect(FakeEventSource.instances).toHaveLength(1)

    const source = FakeEventSource.instances[0]
    act(() => source.emit('state', { state: { combatants: [], currentIndex: 0, round: 5 } }))

    expect(queryClient.getQueryData(initiativeKeys.all)).toEqual({
      combatants: [],
      currentIndex: 0,
      round: 5,
    })
  })

  it('marca connected e lastEventAt mesmo quando o snapshot é ignorado', () => {
    const queryClient = new QueryClient()
    const { result } = renderHook(() => useInitiativeStream(() => true), {
      wrapper: createWrapper(queryClient),
    })
    const source = FakeEventSource.instances[0]

    act(() => source.emit('state', { state: { combatants: [], currentIndex: 0, round: 1 } }))

    expect(result.current.connected).toBe(true)
    expect(result.current.lastEventAt).not.toBeNull()
  })
})
