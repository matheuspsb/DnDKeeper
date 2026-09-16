import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useMapInteraction } from './useMapInteraction'
import type { RefObject } from 'react'
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'

function makeEvent(clientX: number, clientY: number): React.MouseEvent<HTMLDivElement> {
  return {
    clientX,
    clientY,
    currentTarget: { getBoundingClientRect: () => ({ left: 0, top: 0 }) },
  } as unknown as React.MouseEvent<HTMLDivElement>
}

function makeTransformRef(scale: number | null): RefObject<ReactZoomPanPinchRef | null> {
  return { current: scale === null ? null : ({ state: { scale } } as ReactZoomPanPinchRef) }
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useMapInteraction', () => {
  it('começa com mousePos null', () => {
    const { result } = renderHook(() => useMapInteraction(makeTransformRef(2), 1))
    expect(result.current.mousePos).toBeNull()
  })

  it('getImageCoords divide pela escala do transformRef quando disponível', () => {
    const { result } = renderHook(() => useMapInteraction(makeTransformRef(2), 1))
    expect(result.current.getImageCoords(makeEvent(100, 50))).toEqual({ x: 50, y: 25 })
  })

  it('getImageCoords cai pro currentScale quando transformRef.current é null', () => {
    const { result } = renderHook(() => useMapInteraction(makeTransformRef(null), 4))
    expect(result.current.getImageCoords(makeEvent(100, 40))).toEqual({ x: 25, y: 10 })
  })

  it('handleMouseMove não atualiza mousePos síncronamente — só no próximo frame', () => {
    const { result } = renderHook(() => useMapInteraction(makeTransformRef(1), 1))

    act(() => result.current.handleMouseMove(makeEvent(10, 20)))

    expect(result.current.mousePos).toBeNull()
  })

  it('após o frame, mousePos reflete a posição do evento (via requestAnimationFrame)', () => {
    const { result } = renderHook(() => useMapInteraction(makeTransformRef(1), 1))

    act(() => result.current.handleMouseMove(makeEvent(10, 20)))
    act(() => {
      vi.advanceTimersByTime(16)
    })

    expect(result.current.mousePos).toEqual({ x: 10, y: 20 })
  })

  it('várias chamadas antes do frame virar geram só 1 atualização, com a posição mais recente (throttle por rAF)', () => {
    const { result } = renderHook(() => useMapInteraction(makeTransformRef(1), 1))

    act(() => {
      result.current.handleMouseMove(makeEvent(1, 1))
      result.current.handleMouseMove(makeEvent(2, 2))
      result.current.handleMouseMove(makeEvent(3, 3))
    })
    act(() => {
      vi.advanceTimersByTime(16)
    })

    expect(result.current.mousePos).toEqual({ x: 3, y: 3 })
  })

  it('handleMouseLeave zera mousePos na hora, sem esperar o frame, e cancela o frame pendente', () => {
    const { result } = renderHook(() => useMapInteraction(makeTransformRef(1), 1))

    act(() => result.current.handleMouseMove(makeEvent(5, 5)))
    act(() => result.current.handleMouseLeave())

    expect(result.current.mousePos).toBeNull()

    // o frame que estava agendado não deveria reviver a posição antiga
    act(() => {
      vi.advanceTimersByTime(16)
    })
    expect(result.current.mousePos).toBeNull()
  })

  it('clearMousePos zera diretamente', () => {
    const { result } = renderHook(() => useMapInteraction(makeTransformRef(1), 1))

    act(() => result.current.handleMouseMove(makeEvent(5, 5)))
    act(() => {
      vi.advanceTimersByTime(16)
    })
    expect(result.current.mousePos).toEqual({ x: 5, y: 5 })

    act(() => result.current.clearMousePos())
    expect(result.current.mousePos).toBeNull()
  })

  it('desmontar cancela o frame agendado sem lançar erro', () => {
    const { result, unmount } = renderHook(() => useMapInteraction(makeTransformRef(1), 1))
    act(() => result.current.handleMouseMove(makeEvent(1, 1)))

    expect(() => unmount()).not.toThrow()

    // avançar o timer depois de desmontado não deve fazer nada (nem lançar erro)
    expect(() => {
      act(() => {
        vi.advanceTimersByTime(16)
      })
    }).not.toThrow()
  })
})
