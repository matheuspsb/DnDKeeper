import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useMapDrawing } from './useMapDrawing'

beforeEach(() => {
  localStorage.clear()
})

describe('useMapDrawing', () => {
  it('começa fora do modo de desenho, sem traços', () => {
    const { result } = renderHook(() => useMapDrawing())
    expect(result.current.isDrawingMode).toBe(false)
    expect(result.current.paths).toEqual([])
    expect(result.current.currentPath).toBeNull()
  })

  it('toggleDrawingMode alterna o modo e limpa o traço em andamento', () => {
    const { result } = renderHook(() => useMapDrawing())
    act(() => result.current.startStroke({ x: 0, y: 0 }))

    act(() => result.current.toggleDrawingMode())

    expect(result.current.isDrawingMode).toBe(true)
    expect(result.current.currentPath).toBeNull()
  })

  it('startStroke inicia o traço com um ponto', () => {
    const { result } = renderHook(() => useMapDrawing())
    act(() => result.current.startStroke({ x: 1, y: 2 }))
    expect(result.current.currentPath).toEqual([{ x: 1, y: 2 }])
  })

  it('addToStroke ignora pontos abaixo do limiar de distância', () => {
    const { result } = renderHook(() => useMapDrawing())
    act(() => result.current.startStroke({ x: 0, y: 0 }))

    act(() => result.current.addToStroke({ x: 3, y: 0 })) // distância 3 < limiar 4

    expect(result.current.currentPath).toEqual([{ x: 0, y: 0 }])
  })

  it('addToStroke aceita um ponto exatamente no limiar de distância', () => {
    const { result } = renderHook(() => useMapDrawing())
    act(() => result.current.startStroke({ x: 0, y: 0 }))

    act(() => result.current.addToStroke({ x: 4, y: 0 })) // distância == limiar 4

    expect(result.current.currentPath).toEqual([
      { x: 0, y: 0 },
      { x: 4, y: 0 },
    ])
  })

  it('addToStroke acrescenta pontos além do limiar', () => {
    const { result } = renderHook(() => useMapDrawing())
    act(() => result.current.startStroke({ x: 0, y: 0 }))
    act(() => result.current.addToStroke({ x: 10, y: 0 }))
    act(() => result.current.addToStroke({ x: 20, y: 0 }))

    expect(result.current.currentPath).toEqual([
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 20, y: 0 },
    ])
  })

  it('endStroke descarta traços com menos de 2 pontos', () => {
    const { result } = renderHook(() => useMapDrawing())
    act(() => result.current.startStroke({ x: 0, y: 0 }))

    act(() => result.current.endStroke())

    expect(result.current.paths).toEqual([])
    expect(result.current.currentPath).toBeNull()
  })

  it('endStroke salva o traço completo com cor e espessura atuais', () => {
    const { result } = renderHook(() => useMapDrawing())
    act(() => result.current.setBrushColor('#00ff00'))
    act(() => result.current.setBrushSize(8))
    act(() => result.current.startStroke({ x: 0, y: 0 }))
    act(() => result.current.addToStroke({ x: 10, y: 0 }))

    act(() => result.current.endStroke())

    expect(result.current.paths).toHaveLength(1)
    expect(result.current.paths[0]).toMatchObject({
      points: [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
      ],
      color: '#00ff00',
      width: 8,
    })
    expect(result.current.currentPath).toBeNull()
  })

  it('endStroke usa a cor/espessura mais recentes, mesmo mudadas depois do startStroke (regressão do bug de ref)', () => {
    const { result } = renderHook(() => useMapDrawing())
    act(() => result.current.startStroke({ x: 0, y: 0 }))
    act(() => result.current.addToStroke({ x: 10, y: 0 }))

    // muda o pincel no meio do traço, antes de soltar
    act(() => result.current.setBrushColor('#0000ff'))
    act(() => result.current.setBrushSize(12))
    act(() => result.current.endStroke())

    expect(result.current.paths[0]).toMatchObject({ color: '#0000ff', width: 12 })
  })

  it('undoLast remove só o último traço', () => {
    const { result } = renderHook(() => useMapDrawing())
    act(() => result.current.startStroke({ x: 0, y: 0 }))
    act(() => result.current.addToStroke({ x: 10, y: 0 }))
    act(() => result.current.endStroke())
    act(() => result.current.startStroke({ x: 0, y: 0 }))
    act(() => result.current.addToStroke({ x: 20, y: 0 }))
    act(() => result.current.endStroke())
    expect(result.current.paths).toHaveLength(2)

    act(() => result.current.undoLast())

    expect(result.current.paths).toHaveLength(1)
  })

  it('undoLast em uma lista vazia não quebra', () => {
    const { result } = renderHook(() => useMapDrawing())
    act(() => result.current.undoLast())
    expect(result.current.paths).toEqual([])
  })

  it('clearDrawings esvazia tudo', () => {
    const { result } = renderHook(() => useMapDrawing())
    act(() => result.current.startStroke({ x: 0, y: 0 }))
    act(() => result.current.addToStroke({ x: 10, y: 0 }))
    act(() => result.current.endStroke())

    act(() => result.current.clearDrawings())

    expect(result.current.paths).toEqual([])
  })

  it('paths persiste entre remounts', () => {
    const { result, unmount } = renderHook(() => useMapDrawing())
    act(() => result.current.startStroke({ x: 0, y: 0 }))
    act(() => result.current.addToStroke({ x: 10, y: 0 }))
    act(() => result.current.endStroke())
    unmount()

    const { result: second } = renderHook(() => useMapDrawing())
    expect(second.current.paths).toHaveLength(1)
  })
})
