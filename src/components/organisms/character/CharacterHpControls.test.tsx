import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CharacterHpControls from './CharacterHpControls'

describe('CharacterHpControls', () => {
  it('mostra o HP atual, máximo e a porcentagem', () => {
    render(<CharacterHpControls currentHP={30} maxHP={50} onHpAdjust={vi.fn()} />)
    expect(screen.getByText('30')).toBeInTheDocument()
    expect(screen.getByText('/ 50')).toBeInTheDocument()
    expect(screen.getByText('(60%)')).toBeInTheDocument()
  })

  it('onHpAdjust é chamado com o delta do botão clicado', () => {
    const onHpAdjust = vi.fn()
    render(<CharacterHpControls currentHP={30} maxHP={50} onHpAdjust={onHpAdjust} />)
    fireEvent.click(screen.getByText('+5'))
    expect(onHpAdjust).toHaveBeenCalledWith(5)
  })

  it('clicar no número de HP abre um input numérico com o valor atual', () => {
    render(<CharacterHpControls currentHP={30} maxHP={50} onHpAdjust={vi.fn()} />)
    fireEvent.click(screen.getByText('30'))
    const input = screen.getByRole('spinbutton') as HTMLInputElement
    expect(input.value).toBe('30')
  })

  it('Enter no input confirma a edição como delta (novo - atual) e fecha o input', () => {
    const onHpAdjust = vi.fn()
    render(<CharacterHpControls currentHP={30} maxHP={50} onHpAdjust={onHpAdjust} />)
    fireEvent.click(screen.getByText('30'))
    const input = screen.getByRole('spinbutton')
    fireEvent.change(input, { target: { value: '45' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onHpAdjust).toHaveBeenCalledWith(15)
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument()
  })

  it('Escape cancela a edição sem chamar onHpAdjust', () => {
    const onHpAdjust = vi.fn()
    render(<CharacterHpControls currentHP={30} maxHP={50} onHpAdjust={onHpAdjust} />)
    fireEvent.click(screen.getByText('30'))
    fireEvent.keyDown(screen.getByRole('spinbutton'), { key: 'Escape' })

    expect(onHpAdjust).not.toHaveBeenCalled()
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument()
  })

  it('o valor editado é limitado (clamp) entre 0 e maxHP', () => {
    const onHpAdjust = vi.fn()
    render(<CharacterHpControls currentHP={30} maxHP={50} onHpAdjust={onHpAdjust} />)
    fireEvent.click(screen.getByText('30'))
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '999' } })
    fireEvent.keyDown(screen.getByRole('spinbutton'), { key: 'Enter' })

    // clamp(999, 0, 50) - 30 = 20
    expect(onHpAdjust).toHaveBeenCalledWith(20)
  })

  it('valor não numérico no input não chama onHpAdjust ao confirmar (blur)', () => {
    const onHpAdjust = vi.fn()
    render(<CharacterHpControls currentHP={30} maxHP={50} onHpAdjust={onHpAdjust} />)
    fireEvent.click(screen.getByText('30'))
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: 'abc' } })
    fireEvent.blur(screen.getByRole('spinbutton'))

    expect(onHpAdjust).not.toHaveBeenCalled()
  })
})
