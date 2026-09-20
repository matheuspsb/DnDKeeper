import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LeftTree, getLeftTreeSpan } from './LeftTree'
import type { HierarchyTree } from '../../../constants/cult'

const TREE: HierarchyTree = {
  root: { label: 'Guilda AZ', faction: 'Guilda AZ' },
  direction: 'left',
  children: [
    { id: 'a', label: 'A', status: 'vivo' },
    { id: 'b', label: 'B', status: 'morto' },
  ],
}

describe('getLeftTreeSpan', () => {
  it('nunca fica abaixo do mínimo de 200', () => {
    expect(getLeftTreeSpan({ ...TREE, children: [{ id: 'a', label: 'A', status: 'vivo' }] })).toBe(200)
  })

  it('cresce com o número de filhos', () => {
    expect(getLeftTreeSpan(TREE)).toBeGreaterThan(200)
  })
})

describe('LeftTree', () => {
  it('renderiza a raiz e os filhos de primeiro nível', () => {
    render(
      <svg>
        <LeftTree tree={TREE} wasJustClick={() => true} />
      </svg>,
    )
    expect(screen.getByText('Guilda AZ')).toBeInTheDocument()
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
  })

  it('hideRoot omite o nó raiz', () => {
    render(
      <svg>
        <LeftTree tree={{ ...TREE, hideRoot: true }} wasJustClick={() => true} />
      </svg>,
    )
    expect(screen.queryByText('Guilda AZ')).not.toBeInTheDocument()
    expect(screen.getByText('A')).toBeInTheDocument()
  })
})
