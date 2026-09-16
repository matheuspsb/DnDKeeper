import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RightTree, getRightTreeSpan } from './RightTree'
import type { HierarchyTree } from '../../../constants/cult'

const TREE: HierarchyTree = {
  root: { label: 'Mestre', faction: 'Zhentarim' },
  children: [
    { id: 'a', label: 'A', status: 'vivo' },
    { id: 'b', label: 'B', status: 'morto' },
  ],
}

describe('getRightTreeSpan', () => {
  it('nunca fica abaixo do mínimo de 200', () => {
    expect(getRightTreeSpan({ ...TREE, children: [{ id: 'a', label: 'A', status: 'vivo' }] })).toBe(200)
  })

  it('cresce com o número de filhos', () => {
    expect(getRightTreeSpan(TREE)).toBeGreaterThan(200)
  })
})

describe('RightTree', () => {
  it('renderiza a raiz e os filhos de primeiro nível', () => {
    render(
      <svg>
        <RightTree tree={TREE} wasJustClick={() => true} />
      </svg>,
    )
    expect(screen.getByText('Mestre')).toBeInTheDocument()
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
  })

  it('hideRoot omite o nó raiz', () => {
    render(
      <svg>
        <RightTree tree={{ ...TREE, hideRoot: true }} wasJustClick={() => true} />
      </svg>,
    )
    expect(screen.queryByText('Mestre')).not.toBeInTheDocument()
    expect(screen.getByText('A')).toBeInTheDocument()
  })
})
