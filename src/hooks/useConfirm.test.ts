import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useConfirm } from './useConfirm'

describe('useConfirm', () => {
  it('começa desarmado', () => {
    const { result } = renderHook(() => useConfirm())
    expect(result.current.armed).toBe(false)
  })

  it('arm() arma a confirmação', () => {
    const { result } = renderHook(() => useConfirm())
    act(() => result.current.arm())
    expect(result.current.armed).toBe(true)
  })

  it('disarm() desarma sem executar nenhuma ação', () => {
    const { result } = renderHook(() => useConfirm())
    act(() => result.current.arm())
    act(() => result.current.disarm())
    expect(result.current.armed).toBe(false)
  })

  it('confirm() executa a ação e desarma', () => {
    const action = vi.fn()
    const { result } = renderHook(() => useConfirm())
    act(() => result.current.arm())

    act(() => result.current.confirm(action))

    expect(action).toHaveBeenCalledTimes(1)
    expect(result.current.armed).toBe(false)
  })

  it('confirm() sem armar antes ainda executa a ação (chamador decide quando é válido chamar)', () => {
    const action = vi.fn()
    const { result } = renderHook(() => useConfirm())

    act(() => result.current.confirm(action))

    expect(action).toHaveBeenCalledTimes(1)
    expect(result.current.armed).toBe(false)
  })

  it('instâncias independentes não compartilham estado', () => {
    const { result: a } = renderHook(() => useConfirm())
    const { result: b } = renderHook(() => useConfirm())

    act(() => a.current.arm())

    expect(a.current.armed).toBe(true)
    expect(b.current.armed).toBe(false)
  })
})
