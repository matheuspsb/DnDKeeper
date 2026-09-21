import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCanvasInteraction } from './useCanvasInteraction'

function makeEvent(clientX: number, clientY: number): React.MouseEvent {
  return { clientX, clientY } as React.MouseEvent
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useCanvasInteraction', () => {
  it('começa com pan em (0, 0) e zoom 1', () => {
    const { result } = renderHook(() => useCanvasInteraction())
    expect(result.current.pan).toEqual({ x: 0, y: 0 })
    expect(result.current.zoom).toBe(1)
  })

  it('onMouseMove sem mousedown antes não altera o pan', () => {
    const { result } = renderHook(() => useCanvasInteraction())

    act(() => result.current.onMouseMove(makeEvent(10, 10)))
    act(() => {
      vi.advanceTimersByTime(16)
    })

    expect(result.current.pan).toEqual({ x: 0, y: 0 })
  })

  it('onMouseMove durante um drag não atualiza o pan sincronamente — só no próximo frame', () => {
    const { result } = renderHook(() => useCanvasInteraction())

    act(() => result.current.onMouseDown(makeEvent(0, 0)))
    act(() => result.current.onMouseMove(makeEvent(10, 20)))

    expect(result.current.pan).toEqual({ x: 0, y: 0 })
  })

  it('após o frame, o pan acumula o delta do drag (via requestAnimationFrame)', () => {
    const { result } = renderHook(() => useCanvasInteraction())

    act(() => result.current.onMouseDown(makeEvent(0, 0)))
    act(() => result.current.onMouseMove(makeEvent(10, 20)))
    act(() => {
      vi.advanceTimersByTime(16)
    })

    expect(result.current.pan).toEqual({ x: 10, y: 20 })
  })

  it('vários mousemove antes do frame virar geram só 1 atualização de pan, somando os deltas (throttle por rAF)', () => {
    const { result } = renderHook(() => useCanvasInteraction())

    act(() => result.current.onMouseDown(makeEvent(0, 0)))
    act(() => {
      result.current.onMouseMove(makeEvent(5, 5))
      result.current.onMouseMove(makeEvent(8, 12))
      result.current.onMouseMove(makeEvent(10, 20))
    })
    act(() => {
      vi.advanceTimersByTime(16)
    })

    expect(result.current.pan).toEqual({ x: 10, y: 20 })
  })

  it('onMouseUp encerra o drag; mousemove seguinte não altera mais o pan', () => {
    const { result } = renderHook(() => useCanvasInteraction())

    act(() => result.current.onMouseDown(makeEvent(0, 0)))
    act(() => result.current.onMouseMove(makeEvent(10, 10)))
    act(() => {
      vi.advanceTimersByTime(16)
    })
    act(() => result.current.onMouseUp())
    act(() => result.current.onMouseMove(makeEvent(50, 50)))
    act(() => {
      vi.advanceTimersByTime(16)
    })

    expect(result.current.pan).toEqual({ x: 10, y: 10 })
  })

  it('desmontar durante um drag pendente cancela o frame agendado sem lançar erro', () => {
    const { result, unmount } = renderHook(() => useCanvasInteraction())

    act(() => result.current.onMouseDown(makeEvent(0, 0)))
    act(() => result.current.onMouseMove(makeEvent(10, 10)))

    expect(() => unmount()).not.toThrow()
    expect(() => {
      act(() => {
        vi.advanceTimersByTime(16)
      })
    }).not.toThrow()
  })
})
