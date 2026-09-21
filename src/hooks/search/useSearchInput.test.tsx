import { act, renderHook, waitFor } from '@testing-library/react'
import type { ChangeEvent, ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { useSearchInput } from './useSearchInput'

function createWrapper(initialPath: string) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>
  }
}

function changeEvent(value: string) {
  return { target: { value } } as ChangeEvent<HTMLInputElement>
}

describe('useSearchInput', () => {
  it('começa vazio quando a URL não tem ?q=', () => {
    const { result } = renderHook(() => useSearchInput(), { wrapper: createWrapper('/search') })
    expect(result.current.inputValue).toBe('')
    expect(result.current.query).toBe('')
  })

  it('semeia o valor inicial a partir de ?q= na URL', () => {
    const { result } = renderHook(() => useSearchInput(), {
      wrapper: createWrapper('/search?q=elminster'),
    })
    expect(result.current.inputValue).toBe('elminster')
  })

  it('digitar atualiza inputValue imediatamente', () => {
    const { result } = renderHook(() => useSearchInput(), { wrapper: createWrapper('/search') })

    act(() => result.current.handleChange(changeEvent('harper')))

    expect(result.current.inputValue).toBe('harper')
  })

  it('query (deferido) eventualmente reflete o valor digitado', async () => {
    const { result } = renderHook(() => useSearchInput(), { wrapper: createWrapper('/search') })

    act(() => result.current.handleChange(changeEvent('goblin')))

    await waitFor(() => expect(result.current.query).toBe('goblin'))
  })

  it('digitar string vazia limpa o valor', () => {
    const { result } = renderHook(() => useSearchInput(), {
      wrapper: createWrapper('/search?q=algo'),
    })

    act(() => result.current.handleChange(changeEvent('')))

    expect(result.current.inputValue).toBe('')
  })
})
