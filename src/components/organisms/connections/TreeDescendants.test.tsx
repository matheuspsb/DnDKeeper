import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TreeDescendants } from './TreeDescendants'
import type { TreeLevelStyle } from './TreeDescendants'
import { useTreeExpansion } from '../../../hooks/useTreeExpansion'
import type { HierarchyNode } from '../../../constants/cult'

const NODES: HierarchyNode[] = [
  {
    id: 'a',
    label: 'A',
    status: 'vivo',
    children: [{ id: 'a1', label: 'A1', status: 'vivo' }],
  },
  { id: 'b', label: 'B', status: 'morto' },
]

const TWO_CLICKABLE_LEVELS: TreeLevelStyle[] = [
  { radius: 30, imageRadius: 27, acrossSpacing: 100 },
  { radius: 20, imageRadius: 17, acrossSpacing: 50 },
]

const SECOND_LEVEL_LOCKED: TreeLevelStyle[] = [
  { radius: 30, imageRadius: 27, acrossSpacing: 100 },
  { radius: 20, imageRadius: 17, acrossSpacing: 50, clickable: false },
]

function isHiddenBySvgVisibility(el: Element): boolean {
  let node: Element | null = el
  while (node) {
    if (node.getAttribute('visibility') === 'hidden') return true
    node = node.parentElement
  }
  return false
}

interface HarnessProps {
  nodes?: HierarchyNode[]
  levels: TreeLevelStyle[]
  direction?: 'right' | 'down' | 'left'
  alongByDepth?: number[]
  wasJustClick?: () => boolean
  hideParentConnector?: boolean
  onToggleSpy?: (id: string) => void
}

function Harness({
  nodes = NODES,
  levels,
  direction = 'right',
  alongByDepth = [100, 200],
  wasJustClick,
  hideParentConnector,
  onToggleSpy,
}: HarnessProps) {
  const { expandedIds, mountedIds, toggleExpanded } = useTreeExpansion()

  return (
    <svg>
      <TreeDescendants
        nodes={nodes}
        depth={1}
        parentAlong={0}
        parentAcross={0}
        parentRadius={40}
        alongByDepth={alongByDepth}
        levels={levels}
        direction={direction}
        expandedIds={expandedIds}
        mountedIds={mountedIds}
        onToggle={(id) => {
          onToggleSpy?.(id)
          toggleExpanded(id)
        }}
        wasJustClick={wasJustClick ?? (() => true)}
        visible
        hideParentConnector={hideParentConnector}
      />
    </svg>
  )
}

describe('TreeDescendants', () => {
  it('renderiza os nós de profundidade 1', () => {
    render(<Harness levels={TWO_CLICKABLE_LEVELS} />)
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
  })

  it('não renderiza descendentes antes de expandir (não montados)', () => {
    render(<Harness levels={TWO_CLICKABLE_LEVELS} />)
    expect(screen.queryByText('A1')).not.toBeInTheDocument()
  })

  it('clicar num nó com filhos monta e expande o próximo nível', () => {
    render(<Harness levels={TWO_CLICKABLE_LEVELS} />)

    fireEvent.click(screen.getByText('A'))

    const child = screen.getByText('A1')
    expect(child).toBeInTheDocument()
    expect(isHiddenBySvgVisibility(child)).toBe(false)
  })

  it('clicar de novo recolhe (o nó continua no DOM, mas com visibility=hidden)', () => {
    render(<Harness levels={TWO_CLICKABLE_LEVELS} />)

    fireEvent.click(screen.getByText('A'))
    fireEvent.click(screen.getByText('A'))

    const child = screen.getByText('A1')
    expect(child).toBeInTheDocument()
    expect(isHiddenBySvgVisibility(child)).toBe(true)
  })

  it('nó sem filhos (B) não dispara onToggle ao clicar', () => {
    const onToggleSpy = vi.fn()
    render(<Harness levels={TWO_CLICKABLE_LEVELS} onToggleSpy={onToggleSpy} />)

    fireEvent.click(screen.getByText('B'))

    expect(onToggleSpy).not.toHaveBeenCalled()
  })

  it('wasJustClick=false (ex.: fim de um arrasto) bloqueia o toggle', () => {
    const onToggleSpy = vi.fn()
    render(
      <Harness levels={TWO_CLICKABLE_LEVELS} wasJustClick={() => false} onToggleSpy={onToggleSpy} />,
    )

    fireEvent.click(screen.getByText('A'))

    expect(onToggleSpy).not.toHaveBeenCalled()
    expect(screen.queryByText('A1')).not.toBeInTheDocument()
  })

  it('nível com clickable:false nunca reage a clique, mesmo tendo filhos', () => {
    const onToggleSpy = vi.fn()
    render(<Harness levels={SECOND_LEVEL_LOCKED} onToggleSpy={onToggleSpy} />)

    fireEvent.click(screen.getByText('A')) // expande L1 normalmente
    expect(screen.getByText('A1')).toBeInTheDocument()

    onToggleSpy.mockClear()
    fireEvent.click(screen.getByText('A1')) // A1 é clickable:false — não deveria fazer nada

    expect(onToggleSpy).not.toHaveBeenCalled()
  })

  it('para de recursar quando a profundidade excede o array de levels', () => {
    const deepNodes: HierarchyNode[] = [
      {
        id: 'a',
        label: 'A',
        status: 'vivo',
        children: [
          {
            id: 'a1',
            label: 'A1',
            status: 'vivo',
            children: [{ id: 'a1a', label: 'A1A', status: 'vivo' }],
          },
        ],
      },
    ]
    // só 1 nível configurado — A1 não deveria nunca aparecer
    render(<Harness nodes={deepNodes} levels={[TWO_CLICKABLE_LEVELS[0]]} />)

    fireEvent.click(screen.getByText('A'))

    expect(screen.queryByText('A1')).not.toBeInTheDocument()
  })

  it('direction="left" com alongByDepth negativo renderiza e expande normalmente', () => {
    render(<Harness levels={TWO_CLICKABLE_LEVELS} direction="left" alongByDepth={[-100, -200]} />)

    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.queryByText('A1')).not.toBeInTheDocument()

    fireEvent.click(screen.getByText('A'))

    const child = screen.getByText('A1')
    expect(child).toBeInTheDocument()
    expect(isHiddenBySvgVisibility(child)).toBe(false)
  })

  it('hideParentConnector remove o conector de profundidade 1', () => {
    const { container } = render(
      <Harness levels={TWO_CLICKABLE_LEVELS} hideParentConnector />,
    )
    expect(container.querySelectorAll('path')).toHaveLength(0)
  })

  it('sem hideParentConnector, cada nó de profundidade 1 desenha seu conector', () => {
    const { container } = render(<Harness levels={TWO_CLICKABLE_LEVELS} />)
    expect(container.querySelectorAll('path')).toHaveLength(NODES.length)
  })
})
