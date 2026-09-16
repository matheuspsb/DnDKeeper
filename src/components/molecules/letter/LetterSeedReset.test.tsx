import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import LetterSeedReset from './LetterSeedReset'

describe('LetterSeedReset', () => {
  it('mostra só "Atualizar" inicialmente, sem chamar onReset', () => {
    const onReset = vi.fn()
    render(<LetterSeedReset onReset={onReset} />)

    expect(screen.getByText('Atualizar')).toBeInTheDocument()
    expect(onReset).not.toHaveBeenCalled()
  })

  it('clicar em "Atualizar" arma a confirmação', () => {
    render(<LetterSeedReset onReset={vi.fn()} />)

    fireEvent.click(screen.getByText('Atualizar'))

    expect(screen.getByText('Substituir todas as cartas pelo seed?')).toBeInTheDocument()
    expect(screen.getByText('Confirmar')).toBeInTheDocument()
    expect(screen.getByText('Cancelar')).toBeInTheDocument()
  })

  it('"Cancelar" desarma sem chamar onReset', () => {
    const onReset = vi.fn()
    render(<LetterSeedReset onReset={onReset} />)

    fireEvent.click(screen.getByText('Atualizar'))
    fireEvent.click(screen.getByText('Cancelar'))

    expect(onReset).not.toHaveBeenCalled()
    expect(screen.getByText('Atualizar')).toBeInTheDocument()
  })

  it('"Confirmar" chama onReset e volta pro estado inicial', () => {
    const onReset = vi.fn()
    render(<LetterSeedReset onReset={onReset} />)

    fireEvent.click(screen.getByText('Atualizar'))
    fireEvent.click(screen.getByText('Confirmar'))

    expect(onReset).toHaveBeenCalledTimes(1)
    expect(screen.getByText('Atualizar')).toBeInTheDocument()
  })
})
