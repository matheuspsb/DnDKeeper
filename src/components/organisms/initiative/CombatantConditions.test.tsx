import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CombatantConditions from './CombatantConditions'

describe('CombatantConditions', () => {
  it('mostra "+ Condição" quando não há nenhuma condição ativa', () => {
    render(<CombatantConditions combatantName="Goblin" conditions={[]} onSave={vi.fn()} />)
    expect(screen.getByText('+ Condição')).toBeInTheDocument()
  })

  it('mostra os badges das condições ativas e o botão vira "Editar"', () => {
    render(
      <CombatantConditions
        combatantName="Goblin"
        conditions={['Envenenado', 'Atordoado']}
        onSave={vi.fn()}
      />,
    )
    expect(screen.getByText('Envenenado')).toBeInTheDocument()
    expect(screen.getByText('Atordoado')).toBeInTheDocument()
    expect(screen.getByText('Editar')).toBeInTheDocument()
    expect(screen.queryByText('+ Condição')).not.toBeInTheDocument()
  })

  it('abre o ConditionModal ao clicar no botão, mostrando o nome do combatente', () => {
    render(<CombatantConditions combatantName="Goblin" conditions={[]} onSave={vi.fn()} />)

    fireEvent.click(screen.getByText('+ Condição'))

    expect(screen.getByText(/Goblin/)).toBeInTheDocument()
  })

  it('o modal não aparece antes de clicar no botão', () => {
    render(<CombatantConditions combatantName="Goblin" conditions={[]} onSave={vi.fn()} />)
    expect(screen.queryByText('Condições')).not.toBeInTheDocument()
  })

  it('salvar no modal chama onSave com as condições escolhidas e fecha o modal', () => {
    const onSave = vi.fn()
    render(<CombatantConditions combatantName="Goblin" conditions={[]} onSave={onSave} />)

    fireEvent.click(screen.getByText('+ Condição'))
    fireEvent.click(screen.getByText('Envenenado'))
    fireEvent.click(screen.getByText('Salvar'))

    expect(onSave).toHaveBeenCalledWith(['Envenenado'])
    expect(screen.queryByText('Condições')).not.toBeInTheDocument()
  })
})
