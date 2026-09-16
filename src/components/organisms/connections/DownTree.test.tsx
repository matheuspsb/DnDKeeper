import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DownTree, DOWN_TREE_MIN_WIDTH, getDownTreeWidth } from './DownTree'
import type { HierarchyTree } from '../../../constants/cult'

const TREE: HierarchyTree = {
  root: { label: 'Mestre', faction: 'Harpers' },
  children: [
    { id: 'a', label: 'A', status: 'vivo' },
    { id: 'b', label: 'B', status: 'morto' },
  ],
}

describe('getDownTreeWidth', () => {
  it('nunca fica abaixo da largura mínima', () => {
    expect(getDownTreeWidth(TREE)).toBeGreaterThanOrEqual(DOWN_TREE_MIN_WIDTH)
  })

  it('cresce com muitos filhos, ultrapassando o mínimo', () => {
    const manyChildren: HierarchyTree = {
      ...TREE,
      children: Array.from({ length: 30 }, (_, i) => ({
        id: `c${i}`,
        label: `C${i}`,
        status: 'vivo' as const,
      })),
    }
    expect(getDownTreeWidth(manyChildren)).toBeGreaterThan(DOWN_TREE_MIN_WIDTH)
  })
})

describe('DownTree', () => {
  it('renderiza a raiz e os filhos de primeiro nível', () => {
    render(
      <svg>
        <DownTree tree={TREE} wasJustClick={() => true} />
      </svg>,
    )
    // raiz e os dois filhos sem imageUrl compartilham o placeholder "?"
    expect(screen.getAllByText('?')).toHaveLength(3)
    expect(screen.getByText('Mestre')).toBeInTheDocument()
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
  })
})
