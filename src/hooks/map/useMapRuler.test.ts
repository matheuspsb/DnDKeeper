import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useMapRuler } from './useMapRuler'

beforeEach(() => {
  localStorage.clear()
})

describe('useMapRuler', () => {
  it('começa idle, sem pontos e sem calibração', () => {
    const { result } = renderHook(() => useMapRuler())
    expect(result.current.mode).toBe('idle')
    expect(result.current.points).toEqual([])
    expect(result.current.pixelsPerMile).toBeNull()
  })

  it('enterCalibrate/enterMeasure/exitRuler trocam o modo e limpam os pontos', () => {
    const { result } = renderHook(() => useMapRuler())

    act(() => result.current.enterCalibrate())
    expect(result.current.mode).toBe('calibrating')

    act(() => result.current.addPoint({ x: 1, y: 1 }))
    expect(result.current.points).toHaveLength(1)

    act(() => result.current.exitRuler())
    expect(result.current.mode).toBe('idle')
    expect(result.current.points).toEqual([])
  })

  it('addPoint fora de calibrating/measuring não faz nada (modo idle)', () => {
    const { result } = renderHook(() => useMapRuler())
    act(() => result.current.addPoint({ x: 1, y: 1 }))
    expect(result.current.points).toEqual([])
  })

  it('calibração: 2 pontos abrem o input de milhas', () => {
    const { result } = renderHook(() => useMapRuler())
    act(() => result.current.enterCalibrate())

    act(() => result.current.addPoint({ x: 0, y: 0 }))
    expect(result.current.showCalibInput).toBe(false)

    act(() => result.current.addPoint({ x: 100, y: 0 }))
    expect(result.current.points).toEqual([
      { x: 0, y: 0 },
      { x: 100, y: 0 },
    ])
    expect(result.current.showCalibInput).toBe(true)
  })

  it('confirmCalibration calcula pixelsPerMile e volta pro modo idle', () => {
    const { result } = renderHook(() => useMapRuler())
    act(() => result.current.enterCalibrate())
    act(() => result.current.addPoint({ x: 0, y: 0 }))
    act(() => result.current.addPoint({ x: 100, y: 0 }))
    act(() => result.current.setCalibMiles('2'))

    act(() => result.current.confirmCalibration())

    expect(result.current.pixelsPerMile).toBe(50)
    expect(result.current.mode).toBe('idle')
    expect(result.current.showCalibInput).toBe(false)
    expect(result.current.points).toEqual([])
    expect(localStorage.getItem('dndkeeper_map_calibration')).toBe('50')
  })

  it('confirmCalibration ignora milhas inválidas (não numérico, zero ou negativo)', () => {
    const { result } = renderHook(() => useMapRuler())
    act(() => result.current.enterCalibrate())
    act(() => result.current.addPoint({ x: 0, y: 0 }))
    act(() => result.current.addPoint({ x: 100, y: 0 }))

    act(() => result.current.setCalibMiles('abc'))
    act(() => result.current.confirmCalibration())
    expect(result.current.pixelsPerMile).toBeNull()

    act(() => result.current.setCalibMiles('0'))
    act(() => result.current.confirmCalibration())
    expect(result.current.pixelsPerMile).toBeNull()

    act(() => result.current.setCalibMiles('-5'))
    act(() => result.current.confirmCalibration())
    expect(result.current.pixelsPerMile).toBeNull()
  })

  it('confirmCalibration ignora quando faltam pontos', () => {
    const { result } = renderHook(() => useMapRuler())
    act(() => result.current.enterCalibrate())
    act(() => result.current.addPoint({ x: 0, y: 0 }))
    act(() => result.current.setCalibMiles('2'))

    act(() => result.current.confirmCalibration())

    expect(result.current.pixelsPerMile).toBeNull()
  })

  it('calibração persiste entre remounts', () => {
    const { result, unmount } = renderHook(() => useMapRuler())
    act(() => result.current.enterCalibrate())
    act(() => result.current.addPoint({ x: 0, y: 0 }))
    act(() => result.current.addPoint({ x: 100, y: 0 }))
    act(() => result.current.setCalibMiles('2'))
    act(() => result.current.confirmCalibration())
    unmount()

    const { result: second } = renderHook(() => useMapRuler())
    expect(second.current.pixelsPerMile).toBe(50)
  })

  it('medir: 3º ponto reinicia a medição a partir dele', () => {
    const { result } = renderHook(() => useMapRuler())
    act(() => result.current.enterMeasure())

    act(() => result.current.addPoint({ x: 0, y: 0 }))
    act(() => result.current.addPoint({ x: 10, y: 0 }))
    expect(result.current.points).toHaveLength(2)

    act(() => result.current.addPoint({ x: 99, y: 99 }))
    expect(result.current.points).toEqual([{ x: 99, y: 99 }])
  })

  it('getDistance devolve null sem calibração ou sem 2 pontos', () => {
    const { result } = renderHook(() => useMapRuler())
    act(() => result.current.enterMeasure())
    act(() => result.current.addPoint({ x: 0, y: 0 }))
    expect(result.current.getDistance()).toBeNull()
  })

  it('getDistance formata em pés quando a distância é menor que 1 milha', () => {
    const { result } = renderHook(() => useMapRuler())
    act(() => result.current.enterCalibrate())
    act(() => result.current.addPoint({ x: 0, y: 0 }))
    act(() => result.current.addPoint({ x: 100, y: 0 }))
    act(() => result.current.setCalibMiles('2'))
    act(() => result.current.confirmCalibration()) // 50 px/mi

    act(() => result.current.enterMeasure())
    act(() => result.current.addPoint({ x: 0, y: 0 }))
    act(() => result.current.addPoint({ x: 25, y: 0 })) // 0.5 mi

    expect(result.current.getDistance()).toBe('2640 ft')
  })

  it('getPreviewDistance só funciona em modo measuring com exatamente 1 ponto', () => {
    const { result } = renderHook(() => useMapRuler())
    act(() => result.current.enterCalibrate())
    act(() => result.current.addPoint({ x: 0, y: 0 }))
    act(() => result.current.addPoint({ x: 100, y: 0 }))
    act(() => result.current.setCalibMiles('2'))
    act(() => result.current.confirmCalibration())

    act(() => result.current.enterMeasure())
    expect(result.current.getPreviewDistance({ x: 25, y: 0 })).toBeNull()

    act(() => result.current.addPoint({ x: 0, y: 0 }))
    expect(result.current.getPreviewDistance({ x: 25, y: 0 })).toBe('2640 ft')
  })

  it('getMidpoint calcula o ponto médio entre os 2 pontos', () => {
    const { result } = renderHook(() => useMapRuler())
    act(() => result.current.enterMeasure())
    act(() => result.current.addPoint({ x: 0, y: 0 }))
    act(() => result.current.addPoint({ x: 10, y: 20 }))

    expect(result.current.getMidpoint()).toEqual({ x: 5, y: 10 })
  })

  it('getMidpoint devolve null com menos de 2 pontos', () => {
    const { result } = renderHook(() => useMapRuler())
    expect(result.current.getMidpoint()).toBeNull()
  })
})
