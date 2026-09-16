import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CloseButton from './CloseButton'

describe('CloseButton', () => {
  it('chama onClick ao clicar', () => {
    const onClick = vi.fn()
    render(<CloseButton onClick={onClick} />)
    fireEvent.click(screen.getByLabelText('Fechar'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('é type="button" (não dispara submit de formulário)', () => {
    render(<CloseButton onClick={vi.fn()} />)
    expect(screen.getByLabelText('Fechar')).toHaveAttribute('type', 'button')
  })

  it('tone="default" (padrão) usa as cores neutras do app', () => {
    render(<CloseButton onClick={vi.fn()} />)
    expect(screen.getByLabelText('Fechar')).toHaveClass('text-white-300')
  })

  it('tone="parchment" usa as cores do tema de carta/pergaminho', () => {
    render(<CloseButton onClick={vi.fn()} tone="parchment" />)
    const button = screen.getByLabelText('Fechar')
    expect(button).toHaveClass('text-[#3d1e06]')
    expect(button).not.toHaveClass('text-white-300')
  })

  it('className extra é preservado junto das classes do componente', () => {
    render(<CloseButton onClick={vi.fn()} className="shrink-0 mt-0.5" />)
    expect(screen.getByLabelText('Fechar')).toHaveClass('shrink-0', 'mt-0.5', 'cursor-pointer')
  })

  it('aria-label explícito sobrescreve o padrão "Fechar"', () => {
    render(<CloseButton onClick={vi.fn()} aria-label="Fechar modal de calibração" />)
    expect(screen.getByLabelText('Fechar modal de calibração')).toBeInTheDocument()
  })
})
