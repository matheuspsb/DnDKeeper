import { act, renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useNpcDelete } from './useNpcs'
import backendApi from '../services/backendApi'

vi.mock('../services/backendApi', () => ({
  default: {
    delete: vi.fn(),
  },
}))

const mockedDelete = vi.mocked(backendApi.delete)

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
})

describe('useNpcDelete', () => {
  it('começa sem erro', () => {
    const { result } = renderHook(() => useNpcDelete(), { wrapper: createWrapper() })
    expect(result.current.error).toBeNull()
  })

  it('handleDelete bem-sucedido chama o backend e mantém error null', async () => {
    mockedDelete.mockResolvedValue({} as never)
    const { result } = renderHook(() => useNpcDelete(), { wrapper: createWrapper() })

    act(() => result.current.handleDelete('1'))

    await waitFor(() => expect(mockedDelete).toHaveBeenCalledWith('/api/npcs/1'))
    expect(result.current.error).toBeNull()
  })

  it('handleDelete com falha do backend preenche error, refletindo o estado da própria mutation', async () => {
    mockedDelete.mockRejectedValue(new Error('network error'))
    const { result } = renderHook(() => useNpcDelete(), { wrapper: createWrapper() })

    act(() => result.current.handleDelete('1'))

    await waitFor(() => expect(result.current.error).toBe('Não foi possível remover a ficha.'))
  })

  it('uma nova tentativa bem-sucedida limpa o erro anterior', async () => {
    mockedDelete.mockRejectedValueOnce(new Error('falha')).mockResolvedValueOnce({} as never)
    const { result } = renderHook(() => useNpcDelete(), { wrapper: createWrapper() })

    act(() => result.current.handleDelete('1'))
    await waitFor(() => expect(result.current.error).not.toBeNull())

    act(() => result.current.handleDelete('1'))

    await waitFor(() => expect(result.current.error).toBeNull())
  })
})
