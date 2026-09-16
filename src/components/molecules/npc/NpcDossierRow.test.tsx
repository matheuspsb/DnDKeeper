import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import NpcDossierRow from './NpcDossierRow'
import type { Npc } from '../../../types/npc.types'

const NPC: Npc = {
  id: 'n1',
  name: 'Silvara',
  faction: 'Harpers',
  status: 'vivo',
  description: '',
  notes: '',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

function noop() {}

describe('NpcDossierRow', () => {
  it('remover exige confirmação antes de chamar onDelete', () => {
    const onDelete = vi.fn()
    render(
      <NpcDossierRow
        npc={NPC}
        expanded
        canEdit
        onToggle={noop}
        onEdit={noop}
        onDelete={onDelete}
        onImageClick={noop}
      />,
    )

    fireEvent.click(screen.getByText('Remover'))
    expect(onDelete).not.toHaveBeenCalled()
    expect(screen.getByText('remover?')).toBeInTheDocument()

    fireEvent.click(screen.getByText('sim'))
    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('"não" cancela a confirmação sem chamar onDelete', () => {
    const onDelete = vi.fn()
    render(
      <NpcDossierRow
        npc={NPC}
        expanded
        canEdit
        onToggle={noop}
        onEdit={noop}
        onDelete={onDelete}
        onImageClick={noop}
      />,
    )

    fireEvent.click(screen.getByText('Remover'))
    fireEvent.click(screen.getByText('não'))

    expect(onDelete).not.toHaveBeenCalled()
    expect(screen.getByText('Remover')).toBeInTheDocument()
  })

  it('sem canEdit, não mostra botão de remover', () => {
    render(
      <NpcDossierRow
        npc={NPC}
        expanded
        canEdit={false}
        onToggle={noop}
        onEdit={noop}
        onDelete={noop}
        onImageClick={noop}
      />,
    )
    expect(screen.queryByText('Remover')).not.toBeInTheDocument()
  })
})
