import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useMapImage } from './useMapImage'
import type { RefObject } from 'react'
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'

function makeContainerRef(
  clientWidth: number,
  clientHeight: number,
): RefObject<HTMLDivElement | null> {
  return { current: { clientWidth, clientHeight } as HTMLDivElement }
}

function makeTransformRef(centerView = vi.fn()): RefObject<ReactZoomPanPinchRef | null> {
  return { current: { centerView } as unknown as ReactZoomPanPinchRef }
}

function fireLoad(width: number, height: number) {
  return {
    currentTarget: { naturalWidth: width, naturalHeight: height },
  } as unknown as React.SyntheticEvent<HTMLImageElement>
}

describe('useMapImage', () => {
  it('começa com minScale 0.01, currentScale 1, sem imagem pronta/erro/tamanho', () => {
    const { result } = renderHook(() => useMapImage(makeContainerRef(800, 600), makeTransformRef()))
    expect(result.current.minScale).toBe(0.01)
    expect(result.current.currentScale).toBe(1)
    expect(result.current.imageReady).toBe(false)
    expect(result.current.imageError).toBe(false)
    expect(result.current.imgSize).toBeNull()
  })

  it('handleImageError marca imageError', () => {
    const { result } = renderHook(() => useMapImage(makeContainerRef(800, 600), makeTransformRef()))
    act(() => result.current.handleImageError())
    expect(result.current.imageError).toBe(true)
  })

  it('handleImageLoad calcula minScale/currentScale, centraliza a view e marca imageReady', () => {
    const centerView = vi.fn()
    const containerRef = makeContainerRef(800, 400)
    const transformRef = makeTransformRef(centerView)
    const { result } = renderHook(() => useMapImage(containerRef, transformRef))

    act(() => result.current.handleImageLoad(fireLoad(1600, 800)))

    // scale = max(800/1600, 400/800) = max(0.5, 0.5) = 0.5
    expect(result.current.minScale).toBe(0.5)
    expect(result.current.currentScale).toBe(0.5)
    expect(result.current.imageReady).toBe(true)
    expect(result.current.imgSize).toEqual({ width: 1600, height: 800 })
    expect(centerView).toHaveBeenCalledWith(0.5, 0)
  })

  it('usa a maior das duas proporções (largura vs altura) ao calcular a escala', () => {
    const containerRef = makeContainerRef(1000, 200)
    const { result } = renderHook(() => useMapImage(containerRef, makeTransformRef()))

    act(() => result.current.handleImageLoad(fireLoad(2000, 2000)))

    // scale = max(1000/2000, 200/2000) = max(0.5, 0.1) = 0.5
    expect(result.current.minScale).toBe(0.5)
  })

  it('não faz nada se container ou transform ref ainda não existem', () => {
    const containerRef: RefObject<HTMLDivElement | null> = { current: null }
    const transformRef = makeTransformRef()
    const { result } = renderHook(() => useMapImage(containerRef, transformRef))

    act(() => result.current.handleImageLoad(fireLoad(1600, 800)))

    expect(result.current.imageReady).toBe(false)
    expect(result.current.minScale).toBe(0.01)
    expect(result.current.imgSize).toEqual({ width: 1600, height: 800 })
  })

  it('setCurrentScale atualiza currentScale diretamente', () => {
    const { result } = renderHook(() => useMapImage(makeContainerRef(800, 600), makeTransformRef()))
    act(() => result.current.setCurrentScale(2.5))
    expect(result.current.currentScale).toBe(2.5)
  })
})
