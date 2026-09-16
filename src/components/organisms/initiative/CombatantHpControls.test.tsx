import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CombatantHpControls from './CombatantHpControls'

describe('CombatantHpControls', () => {
  it('mostra hp/maxHp e a barra', () => {
    render(
      <CombatantHpControls hp={30} maxHp={50} canEdit onAdjustHp={vi.fn()} onSetHp={vi.fn()} />,
    )
    expect(screen.getByText('30 / 50')).toBeInTheDocument()
  })

  it('mostra os botões de delta quando não está editando', () => {
    render(
      <CombatantHpControls hp={30} maxHp={50} canEdit onAdjustHp={vi.fn()} onSetHp={vi.fn()} />,
    )
    expect(screen.getByText('+5')).toBeInTheDocument()
    expect(screen.getByText('-5')).toBeInTheDocument()
  })

  it('onAdjustHp é chamado com o delta do botão clicado', () => {
    const onAdjustHp = vi.fn()
    render(
      <CombatantHpControls hp={30} maxHp={50} canEdit onAdjustHp={onAdjustHp} onSetHp={vi.fn()} />,
    )
    fireEvent.click(screen.getByText('+5'))
    expect(onAdjustHp).toHaveBeenCalledWith(5)
  })

  it('canEdit=false esconde o lápis de edição e não mostra editor mesmo clicando', () => {
    render(
      <CombatantHpControls
        hp={30}
        maxHp={50}
        canEdit={false}
        onAdjustHp={vi.fn()}
        onSetHp={vi.fn()}
      />,
    )
    expect(screen.queryByTitle('Editar HP atual e máximo')).not.toBeInTheDocument()
    // sem o lápis, os botões de delta continuam sendo o modo padrão
    expect(screen.getByText('+5')).toBeInTheDocument()
  })

  it('clicar no lápis abre o CombatantHpEditor e esconde os botões de delta', () => {
    render(
      <CombatantHpControls hp={30} maxHp={50} canEdit onAdjustHp={vi.fn()} onSetHp={vi.fn()} />,
    )

    fireEvent.click(screen.getByTitle('Editar HP atual e máximo'))

    expect(screen.getByText('Confirmar')).toBeInTheDocument()
    expect(screen.queryByText('+5')).not.toBeInTheDocument()
  })

  it('confirmar no editor chama onSetHp com os novos valores e fecha o editor', () => {
    const onSetHp = vi.fn()
    render(
      <CombatantHpControls hp={30} maxHp={50} canEdit onAdjustHp={vi.fn()} onSetHp={onSetHp} />,
    )

    fireEvent.click(screen.getByTitle('Editar HP atual e máximo'))
    const [hpInput, maxInput] = screen.getAllByRole('spinbutton')
    fireEvent.change(hpInput, { target: { value: '20' } })
    fireEvent.change(maxInput, { target: { value: '60' } })
    fireEvent.click(screen.getByText('Confirmar'))

    expect(onSetHp).toHaveBeenCalledWith(20, 60)
    expect(screen.queryByText('Confirmar')).not.toBeInTheDocument()
    expect(screen.getByText('+5')).toBeInTheDocument()
  })

  it('cancelar no editor não chama onSetHp e volta pros botões de delta', () => {
    const onSetHp = vi.fn()
    render(
      <CombatantHpControls hp={30} maxHp={50} canEdit onAdjustHp={vi.fn()} onSetHp={onSetHp} />,
    )

    fireEvent.click(screen.getByTitle('Editar HP atual e máximo'))
    fireEvent.click(screen.getByText('Cancelar'))

    expect(onSetHp).not.toHaveBeenCalled()
    expect(screen.getByText('+5')).toBeInTheDocument()
  })

  it('hp igual a 0 (edge case) ainda renderiza a barra em 0%', () => {
    render(<CombatantHpControls hp={0} maxHp={50} canEdit onAdjustHp={vi.fn()} onSetHp={vi.fn()} />)
    expect(screen.getByText('0 / 50')).toBeInTheDocument()
  })
})
