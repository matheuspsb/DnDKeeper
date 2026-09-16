import { describe, expect, it } from 'vitest'
import { getSpreadPosition } from './treeGeometry'

describe('getSpreadPosition', () => {
  it('centraliza um único filho exatamente na posição do pai', () => {
    expect(getSpreadPosition(100, 0, 1, 50)).toBe(100)
  })

  it('espalha simetricamente 3 filhos ao redor do pai', () => {
    expect(getSpreadPosition(0, 0, 3, 10)).toBe(-10)
    expect(getSpreadPosition(0, 1, 3, 10)).toBe(0)
    expect(getSpreadPosition(0, 2, 3, 10)).toBe(10)
  })

  it('espalha simetricamente 2 filhos (par) ao redor do pai', () => {
    expect(getSpreadPosition(0, 0, 2, 10)).toBe(-5)
    expect(getSpreadPosition(0, 1, 2, 10)).toBe(5)
  })

  it('soma o deslocamento à posição do pai quando ele não está na origem', () => {
    expect(getSpreadPosition(500, 0, 1, 50)).toBe(500)
    expect(getSpreadPosition(500, 2, 3, 10)).toBe(510)
  })

  it('espaçamento zero coloca todos os filhos na mesma posição do pai', () => {
    expect(getSpreadPosition(0, 0, 5, 0)).toBe(0)
    expect(getSpreadPosition(0, 4, 5, 0)).toBe(0)
  })

  it('é equivalente à fórmula original de cada árvore (verificação de regressão)', () => {
    // RightTree: getChildY(index, count) = (index - (count - 1) / 2) * spacing, pai em 0
    const spacing = 140
    for (let index = 0; index < 4; index++) {
      const original = (index - (4 - 1) / 2) * spacing
      expect(getSpreadPosition(0, index, 4, spacing)).toBeCloseTo(original)
    }
  })
})
