import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import LetterCard from './LetterCard'
import type { Letter } from '../../../types/letter'

const LETTER: Letter = {
  id: 'l1',
  title: 'Carta do Rei',
  content: 'Prezados aventureiros...',
  foundAt: '26/04/1372',
}

function noop() {}

describe('LetterCard', () => {
  it('sem isDm, não mostra ações de editar/remover (só "Ler")', () => {
    const { container } = render(
      <LetterCard letter={LETTER} isDm={false} onView={noop} onEdit={noop} onDelete={noop} />,
    )
    expect(container.querySelectorAll('button')).toHaveLength(1)
  })

  it('primeiro clique no ícone de remover arma a confirmação, sem chamar onDelete', () => {
    const onDelete = vi.fn()
    const { container } = render(
      <LetterCard letter={LETTER} isDm onView={noop} onEdit={noop} onDelete={onDelete} />,
    )
    const [, , deleteButton] = container.querySelectorAll('button')

    fireEvent.click(deleteButton)

    expect(onDelete).not.toHaveBeenCalled()
  })

  it('segundo clique confirma e chama onDelete com o id da carta', () => {
    const onDelete = vi.fn()
    const { container } = render(
      <LetterCard letter={LETTER} isDm onView={noop} onEdit={noop} onDelete={onDelete} />,
    )
    const [, , deleteButton] = container.querySelectorAll('button')

    fireEvent.click(deleteButton)
    fireEvent.click(deleteButton)

    expect(onDelete).toHaveBeenCalledWith('l1')
  })

  it('sair com o mouse (mouseLeave) desarma a confirmação', () => {
    const onDelete = vi.fn()
    const { container } = render(
      <LetterCard letter={LETTER} isDm onView={noop} onEdit={noop} onDelete={onDelete} />,
    )
    const [, , deleteButton] = container.querySelectorAll('button')

    fireEvent.click(deleteButton) // arma
    fireEvent.mouseLeave(container.querySelector('.parchment')!)
    fireEvent.click(deleteButton) // se ainda estivesse armado, isso confirmaria

    expect(onDelete).not.toHaveBeenCalled()
  })

  it('clicar em "Ler" chama onView com a carta', () => {
    const onView = vi.fn()
    render(<LetterCard letter={LETTER} isDm={false} onView={onView} onEdit={noop} onDelete={noop} />)

    fireEvent.click(screen.getByText('Ler'))

    expect(onView).toHaveBeenCalledWith(LETTER)
  })
})
