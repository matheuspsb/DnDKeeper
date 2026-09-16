import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CharacterCardActions from './CharacterCardActions'

describe('CharacterCardActions', () => {
  it('clicar em editar chama onEdit', () => {
    const onEdit = vi.fn()
    render(<CharacterCardActions onEdit={onEdit} onDelete={vi.fn()} />)
    fireEvent.click(screen.getByTitle('Editar'))
    expect(onEdit).toHaveBeenCalled()
  })

  it('clicar em remover mostra a confirmação, sem chamar onDelete ainda', () => {
    const onDelete = vi.fn()
    render(<CharacterCardActions onEdit={vi.fn()} onDelete={onDelete} />)
    fireEvent.click(screen.getByTitle('Remover'))
    expect(screen.getByText('Sim')).toBeInTheDocument()
    expect(screen.getByText('Não')).toBeInTheDocument()
    expect(onDelete).not.toHaveBeenCalled()
  })

  it('confirmar com "Sim" chama onDelete', () => {
    const onDelete = vi.fn()
    render(<CharacterCardActions onEdit={vi.fn()} onDelete={onDelete} />)
    fireEvent.click(screen.getByTitle('Remover'))
    fireEvent.click(screen.getByText('Sim'))
    expect(onDelete).toHaveBeenCalled()
  })

  it('cancelar com "Não" volta pro botão de lixeira sem chamar onDelete', () => {
    const onDelete = vi.fn()
    render(<CharacterCardActions onEdit={vi.fn()} onDelete={onDelete} />)
    fireEvent.click(screen.getByTitle('Remover'))
    fireEvent.click(screen.getByText('Não'))
    expect(onDelete).not.toHaveBeenCalled()
    expect(screen.getByTitle('Remover')).toBeInTheDocument()
  })
})
