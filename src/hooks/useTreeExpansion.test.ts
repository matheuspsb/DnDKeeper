import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useTreeExpansion } from './useTreeExpansion'

describe('useTreeExpansion', () => {
  it('começa sem nada expandido ou montado', () => {
    const { result } = renderHook(() => useTreeExpansion())
    expect(result.current.expandedIds.size).toBe(0)
    expect(result.current.mountedIds.size).toBe(0)
  })

  it('expandir marca o nó como expandido e montado', () => {
    const { result } = renderHook(() => useTreeExpansion())

    act(() => result.current.toggleExpanded('node-1'))

    expect(result.current.expandedIds.has('node-1')).toBe(true)
    expect(result.current.mountedIds.has('node-1')).toBe(true)
  })

  it('alternar de novo recolhe, mas mantém montado', () => {
    const { result } = renderHook(() => useTreeExpansion())

    act(() => result.current.toggleExpanded('node-1'))
    act(() => result.current.toggleExpanded('node-1'))

    expect(result.current.expandedIds.has('node-1')).toBe(false)
    expect(result.current.mountedIds.has('node-1')).toBe(true)
  })

  it('reabrir depois de recolhido não perde o "já montado"', () => {
    const { result } = renderHook(() => useTreeExpansion())

    act(() => result.current.toggleExpanded('node-1')) // expande
    act(() => result.current.toggleExpanded('node-1')) // recolhe
    act(() => result.current.toggleExpanded('node-1')) // expande de novo

    expect(result.current.expandedIds.has('node-1')).toBe(true)
    expect(result.current.mountedIds.size).toBe(1)
  })

  it('nós diferentes têm estado independente', () => {
    const { result } = renderHook(() => useTreeExpansion())

    act(() => result.current.toggleExpanded('a'))

    expect(result.current.expandedIds.has('a')).toBe(true)
    expect(result.current.expandedIds.has('b')).toBe(false)
    expect(result.current.mountedIds.has('b')).toBe(false)
  })

  it('mountedIds nunca encolhe', () => {
    const { result } = renderHook(() => useTreeExpansion())

    act(() => result.current.toggleExpanded('a'))
    act(() => result.current.toggleExpanded('b'))
    act(() => result.current.toggleExpanded('a')) // recolhe a

    expect(result.current.mountedIds.size).toBe(2)
  })
})
