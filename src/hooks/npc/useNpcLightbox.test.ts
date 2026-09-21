import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useNpcLightbox } from './useNpcLightbox'
import type { Npc } from '../../types/npc.types'

function makeNpc(id: string, imageUrl?: string): Npc {
  return {
    id,
    name: `NPC ${id}`,
    faction: 'Harpers',
    status: 'vivo',
    description: '',
    notes: '',
    imageUrl,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  }
}

const WITH_IMAGE_1 = makeNpc('1', 'local:1.jpeg')
const WITHOUT_IMAGE = makeNpc('2')
const WITH_IMAGE_2 = makeNpc('3', 'local:3.jpeg')
const WITH_IMAGE_3 = makeNpc('4', 'local:4.jpeg')

const NPCS = [WITH_IMAGE_1, WITHOUT_IMAGE, WITH_IMAGE_2, WITH_IMAGE_3]

describe('useNpcLightbox', () => {
  it('começa com activeNpc null', () => {
    const { result } = renderHook(() => useNpcLightbox(NPCS))
    expect(result.current.activeNpc).toBeNull()
    expect(result.current.hasPrev).toBe(false)
    expect(result.current.hasNext).toBe(false)
  })

  it('open seta o npc ativo', () => {
    const { result } = renderHook(() => useNpcLightbox(NPCS))

    act(() => result.current.open(WITH_IMAGE_1))

    expect(result.current.activeNpc).toEqual(WITH_IMAGE_1)
  })

  it('no primeiro npc com imagem, hasPrev é false e hasNext é true', () => {
    const { result } = renderHook(() => useNpcLightbox(NPCS))
    act(() => result.current.open(WITH_IMAGE_1))

    expect(result.current.hasPrev).toBe(false)
    expect(result.current.hasNext).toBe(true)
  })

  it('no meio da lista, hasPrev e hasNext são true', () => {
    const { result } = renderHook(() => useNpcLightbox(NPCS))
    act(() => result.current.open(WITH_IMAGE_2))

    expect(result.current.hasPrev).toBe(true)
    expect(result.current.hasNext).toBe(true)
  })

  it('no último npc com imagem, hasNext é false e hasPrev é true', () => {
    const { result } = renderHook(() => useNpcLightbox(NPCS))
    act(() => result.current.open(WITH_IMAGE_3))

    expect(result.current.hasPrev).toBe(true)
    expect(result.current.hasNext).toBe(false)
  })

  it('goNext avança para o próximo npc com imagem', () => {
    const { result } = renderHook(() => useNpcLightbox(NPCS))
    act(() => result.current.open(WITH_IMAGE_1))

    act(() => result.current.goNext())

    expect(result.current.activeNpc).toEqual(WITH_IMAGE_2)
  })

  it('goPrev volta para o npc com imagem anterior', () => {
    const { result } = renderHook(() => useNpcLightbox(NPCS))
    act(() => result.current.open(WITH_IMAGE_2))

    act(() => result.current.goPrev())

    expect(result.current.activeNpc).toEqual(WITH_IMAGE_1)
  })

  it('close zera o npc ativo', () => {
    const { result } = renderHook(() => useNpcLightbox(NPCS))
    act(() => result.current.open(WITH_IMAGE_1))

    act(() => result.current.close())

    expect(result.current.activeNpc).toBeNull()
  })

  it('npcs sem imagem são ignorados na navegação', () => {
    const { result } = renderHook(() => useNpcLightbox(NPCS))
    act(() => result.current.open(WITH_IMAGE_1))
    act(() => result.current.goNext())

    expect(result.current.activeNpc?.id).not.toBe(WITHOUT_IMAGE.id)
    expect(result.current.activeNpc).toEqual(WITH_IMAGE_2)
  })
})
