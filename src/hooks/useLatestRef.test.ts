import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useLatestRef } from './useLatestRef'

describe('useLatestRef', () => {
  it('começa com o valor inicial', () => {
    const { result } = renderHook(() => useLatestRef('a'))
    expect(result.current.current).toBe('a')
  })

  it('atualiza .current a cada re-render, sem precisar de efeito', () => {
    const { result, rerender } = renderHook(({ value }) => useLatestRef(value), {
      initialProps: { value: 'a' },
    })

    expect(result.current.current).toBe('a')

    rerender({ value: 'b' })
    expect(result.current.current).toBe('b')

    rerender({ value: 'c' })
    expect(result.current.current).toBe('c')
  })

  it('a identidade do objeto ref não muda entre renders', () => {
    const { result, rerender } = renderHook(({ value }) => useLatestRef(value), {
      initialProps: { value: 1 },
    })
    const firstRef = result.current

    rerender({ value: 2 })

    expect(result.current).toBe(firstRef)
  })
})
