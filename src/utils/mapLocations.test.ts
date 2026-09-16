import { describe, expect, it } from 'vitest'
import { findLocationAt } from './mapLocations'
import type { MapLocation } from '../types/mapLocation'

const LOCATIONS: MapLocation[] = [
  { id: 'a', name: 'A', x1: 0, y1: 0, x2: 100, y2: 100 },
  { id: 'b', name: 'B', x1: 200, y1: 200, x2: 300, y2: 300 },
]

describe('findLocationAt', () => {
  it('encontra a localização quando o ponto está dentro do retângulo', () => {
    expect(findLocationAt({ x: 50, y: 50 }, LOCATIONS)?.id).toBe('a')
  })

  it('devolve undefined quando o ponto não está em nenhum retângulo', () => {
    expect(findLocationAt({ x: 150, y: 150 }, LOCATIONS)).toBeUndefined()
  })

  it('inclui os pontos exatamente na borda (comparação inclusiva)', () => {
    expect(findLocationAt({ x: 0, y: 0 }, LOCATIONS)?.id).toBe('a')
    expect(findLocationAt({ x: 100, y: 100 }, LOCATIONS)?.id).toBe('a')
  })

  it('devolve undefined para lista vazia', () => {
    expect(findLocationAt({ x: 50, y: 50 }, [])).toBeUndefined()
  })

  it('devolve a primeira correspondência quando retângulos se sobrepõem', () => {
    const overlapping: MapLocation[] = [
      { id: 'first', name: 'First', x1: 0, y1: 0, x2: 100, y2: 100 },
      { id: 'second', name: 'Second', x1: 50, y1: 50, x2: 150, y2: 150 },
    ]
    expect(findLocationAt({ x: 75, y: 75 }, overlapping)?.id).toBe('first')
  })
})
