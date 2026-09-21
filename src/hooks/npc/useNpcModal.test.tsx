import { act, renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useNpcModal } from './useNpcModal'
import backendApi from '../../services/backendApi'
import type { Npc } from '../../types/npc.types'

vi.mock('../../services/backendApi', () => ({
  default: {
    post: vi.fn(),
    patch: vi.fn(),
  },
}))

const mockedPost = vi.mocked(backendApi.post)
const mockedPatch = vi.mocked(backendApi.patch)

const NPC: Npc = {
  id: '1',
  name: 'Silvara Moonshadow',
  faction: 'Harpers',
  status: 'vivo',
  description: '',
  notes: '',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mockedPost.mockResolvedValue({ data: { ...NPC, id: 'new' } } as never)
  mockedPatch.mockResolvedValue({ data: NPC } as never)
})

describe('useNpcModal', () => {
  it('começa fechado, sem npc em edição', () => {
    const { result } = renderHook(() => useNpcModal(), { wrapper: createWrapper() })
    expect(result.current.isOpen).toBe(false)
    expect(result.current.editingNpc).toBeNull()
  })

  it('openAdd abre o modal sem npc em edição', () => {
    const { result } = renderHook(() => useNpcModal(), { wrapper: createWrapper() })

    act(() => result.current.openAdd())

    expect(result.current.isOpen).toBe(true)
    expect(result.current.editingNpc).toBeNull()
  })

  it('openEdit abre o modal com o npc em edição', () => {
    const { result } = renderHook(() => useNpcModal(), { wrapper: createWrapper() })

    act(() => result.current.openEdit(NPC))

    expect(result.current.isOpen).toBe(true)
    expect(result.current.editingNpc).toEqual(NPC)
  })

  it('close fecha o modal', () => {
    const { result } = renderHook(() => useNpcModal(), { wrapper: createWrapper() })
    act(() => result.current.openAdd())

    act(() => result.current.close())

    expect(result.current.isOpen).toBe(false)
  })

  it('handleSave sem npc em edição cria via POST e fecha o modal', async () => {
    const { result } = renderHook(() => useNpcModal(), { wrapper: createWrapper() })
    act(() => result.current.openAdd())

    await act(async () => {
      await result.current.handleSave({
        name: 'Novo NPC',
        faction: 'Harpers',
        status: 'vivo',
        description: '',
        notes: '',
      })
    })

    expect(mockedPost).toHaveBeenCalledWith(
      '/api/npcs',
      expect.objectContaining({ name: 'Novo NPC' }),
    )
    expect(mockedPatch).not.toHaveBeenCalled()
    await waitFor(() => expect(result.current.isOpen).toBe(false))
  })

  it('handleSave com npc em edição atualiza via PATCH e fecha o modal', async () => {
    const { result } = renderHook(() => useNpcModal(), { wrapper: createWrapper() })
    act(() => result.current.openEdit(NPC))

    await act(async () => {
      await result.current.handleSave({
        name: 'Silvara (editada)',
        faction: 'Harpers',
        status: 'vivo',
        description: '',
        notes: '',
      })
    })

    expect(mockedPatch).toHaveBeenCalledWith(
      `/api/npcs/${NPC.id}`,
      expect.objectContaining({ name: 'Silvara (editada)' }),
    )
    expect(mockedPost).not.toHaveBeenCalled()
    await waitFor(() => expect(result.current.isOpen).toBe(false))
  })
})
