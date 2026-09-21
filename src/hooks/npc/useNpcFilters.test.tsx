import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { useNpcFilters } from './useNpcFilters'
import type { Npc } from '../../types/npc.types'

function createWrapper(initialPath = '/npcs') {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>
  }
}

function makeNpc(overrides: Partial<Npc>): Npc {
  return {
    id: overrides.id ?? 'id',
    name: 'NPC',
    faction: 'Harpers',
    status: 'vivo',
    description: '',
    notes: '',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

const NPCS: Npc[] = [
  makeNpc({ id: '1', name: 'Silvara Moonshadow', faction: 'Harpers', status: 'vivo' }),
  makeNpc({ id: '2', name: 'Xanathar', faction: 'Zhentarim', status: 'morto', notes: 'beholder' }),
  makeNpc({
    id: '3',
    name: 'Culto NPC',
    faction: 'Culto do Dragão',
    status: 'desaparecido',
    description: 'segue os Harpers de longe',
  }),
]

describe('useNpcFilters', () => {
  it('sem filtro, devolve todos os npcs agrupados por facção', () => {
    const { result } = renderHook(() => useNpcFilters(NPCS), { wrapper: createWrapper() })
    expect(result.current.filtered).toHaveLength(3)
    expect(result.current.groupedByFaction.map((g) => g.faction)).toEqual([
      'Zhentarim',
      'Culto do Dragão',
      'Harpers',
    ])
    expect(result.current.hasActiveFilters).toBe(false)
  })

  it('filtra por texto batendo em nome, facção, descrição ou notas', () => {
    const { result } = renderHook(() => useNpcFilters(NPCS), {
      wrapper: createWrapper('/npcs?q=beholder'),
    })
    expect(result.current.filtered.map((n) => n.id)).toEqual(['2'])
  })

  it('filtro de texto também bate em descrição de outro npc mencionando uma facção', () => {
    const { result } = renderHook(() => useNpcFilters(NPCS), {
      wrapper: createWrapper('/npcs?q=harpers'),
    })
    expect(result.current.filtered.map((n) => n.id).sort()).toEqual(['1', '3'])
  })

  it('filtra por status', () => {
    const { result } = renderHook(() => useNpcFilters(NPCS), {
      wrapper: createWrapper('/npcs?status=morto'),
    })
    expect(result.current.filtered.map((n) => n.id)).toEqual(['2'])
    expect(result.current.hasActiveFilters).toBe(true)
  })

  it('facções sem nenhum npc correspondente não aparecem em groupedByFaction', () => {
    const { result } = renderHook(() => useNpcFilters(NPCS), {
      wrapper: createWrapper('/npcs?status=vivo'),
    })
    expect(result.current.groupedByFaction).toHaveLength(1)
    expect(result.current.groupedByFaction[0].faction).toBe('Harpers')
  })

  it('meta pluraliza corretamente no singular e no plural', () => {
    const { result: single } = renderHook(() => useNpcFilters([NPCS[0]]), {
      wrapper: createWrapper(),
    })
    expect(single.current.meta).toBe('1 ficha · 1 facção')

    const { result: many } = renderHook(() => useNpcFilters(NPCS), { wrapper: createWrapper() })
    expect(many.current.meta).toBe('3 fichas · 3 facções')
  })

  it('meta mostra o sufixo "em exibição" quando o filtro reduz a lista', () => {
    const { result } = renderHook(() => useNpcFilters(NPCS), {
      wrapper: createWrapper('/npcs?status=morto'),
    })
    expect(result.current.meta).toBe('3 fichas · 1 facção · 1 em exibição')
  })

  it('setQuery escreve o parâmetro q na URL e filtra', () => {
    const { result } = renderHook(() => useNpcFilters(NPCS), { wrapper: createWrapper() })

    act(() => result.current.setQuery('xanathar'))

    expect(result.current.query).toBe('xanathar')
    expect(result.current.filtered.map((n) => n.id)).toEqual(['2'])
  })

  it('setStatusFilter atualiza o filtro de status', () => {
    const { result } = renderHook(() => useNpcFilters(NPCS), { wrapper: createWrapper() })

    act(() => result.current.setStatusFilter('desaparecido'))

    expect(result.current.statusFilter).toBe('desaparecido')
    expect(result.current.filtered.map((n) => n.id)).toEqual(['3'])
  })

  it('clearFilters remove busca e status', () => {
    const { result } = renderHook(() => useNpcFilters(NPCS), {
      wrapper: createWrapper('/npcs?q=xanathar&status=morto'),
    })
    expect(result.current.hasActiveFilters).toBe(true)

    act(() => result.current.clearFilters())

    expect(result.current.query).toBe('')
    expect(result.current.statusFilter).toBe('todos')
    expect(result.current.hasActiveFilters).toBe(false)
  })
})
