import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CombatantRow from './CombatantRow'
import type { Combatant } from '../../../types/initiative'

const MONSTER: Combatant = {
  id: 'm1',
  name: 'Goblin',
  initiative: 12,
  hp: 7,
  maxHp: 10,
  isPlayer: false,
  conditions: [],
  hpRevealed: false,
}

const PLAYER: Combatant = {
  id: 'p1',
  name: 'Aria',
  initiative: 18,
  hp: 20,
  maxHp: 20,
  isPlayer: true,
}

function noop() {}

describe('CombatantRow', () => {
  it('renderiza nome, iniciativa e HP', () => {
    render(
      <CombatantRow
        combatant={MONSTER}
        status="pending"
        onRemove={noop}
        onAdjustHp={noop}
        onSetHp={noop}
        onUpdateInitiative={noop}
        onSetConditions={noop}
        onSetImageUrl={noop}
        onToggleHpReveal={noop}
      />,
    )
    expect(screen.getByText('Goblin')).toBeInTheDocument()
    expect(screen.getByText('7 / 10')).toBeInTheDocument()
  })

  it('jogador não mostra o botão de revelar/esconder HP nem pode editar HP (só delta)', () => {
    render(
      <CombatantRow
        combatant={PLAYER}
        status="pending"
        onRemove={noop}
        onAdjustHp={noop}
        onSetHp={noop}
        onUpdateInitiative={noop}
        onSetConditions={noop}
        onSetImageUrl={noop}
        onToggleHpReveal={noop}
      />,
    )
    expect(screen.queryByTitle(/HP numérico visível|HP escondido/)).not.toBeInTheDocument()
    expect(screen.queryByTitle('Editar HP atual e máximo')).not.toBeInTheDocument()
  })

  it('monstro sem hp (null) não renderiza os controles de HP', () => {
    render(
      <CombatantRow
        combatant={{ ...MONSTER, hp: null, maxHp: null }}
        status="pending"
        onRemove={noop}
        onAdjustHp={noop}
        onSetHp={noop}
        onUpdateInitiative={noop}
        onSetConditions={noop}
        onSetImageUrl={noop}
        onToggleHpReveal={noop}
      />,
    )
    expect(screen.queryByText(/\/ /)).not.toBeInTheDocument()
  })

  it('clicar em remover chama onRemove', () => {
    const onRemove = vi.fn()
    render(
      <CombatantRow
        combatant={MONSTER}
        status="pending"
        onRemove={onRemove}
        onAdjustHp={noop}
        onSetHp={noop}
        onUpdateInitiative={noop}
        onSetConditions={noop}
        onSetImageUrl={noop}
        onToggleHpReveal={noop}
      />,
    )
    fireEvent.click(screen.getByTitle('Remover'))
    expect(onRemove).toHaveBeenCalled()
  })

  it('clicar no botão de imagem abre o input; confirmar chama onSetImageUrl', () => {
    const onSetImageUrl = vi.fn()
    render(
      <CombatantRow
        combatant={MONSTER}
        status="pending"
        onRemove={noop}
        onAdjustHp={noop}
        onSetHp={noop}
        onUpdateInitiative={noop}
        onSetConditions={noop}
        onSetImageUrl={onSetImageUrl}
        onToggleHpReveal={noop}
      />,
    )
    fireEvent.click(screen.getByTitle('Definir imagem'))
    const input = screen.getByPlaceholderText('URL da imagem ou link do Drive...')
    fireEvent.change(input, { target: { value: 'https://exemplo.com/img.png' } })
    fireEvent.click(screen.getByText('OK'))

    expect(onSetImageUrl).toHaveBeenCalledWith('https://exemplo.com/img.png')
  })

  it('clicar em ajustar HP (+1) chama onAdjustHp', () => {
    const onAdjustHp = vi.fn()
    render(
      <CombatantRow
        combatant={MONSTER}
        status="pending"
        onRemove={noop}
        onAdjustHp={onAdjustHp}
        onSetHp={noop}
        onUpdateInitiative={noop}
        onSetConditions={noop}
        onSetImageUrl={noop}
        onToggleHpReveal={noop}
      />,
    )
    fireEvent.click(screen.getByText('+1'))
    expect(onAdjustHp).toHaveBeenCalledWith(1)
  })

  it('clicar em revelar/esconder HP (monstro) chama onToggleHpReveal', () => {
    const onToggleHpReveal = vi.fn()
    render(
      <CombatantRow
        combatant={MONSTER}
        status="pending"
        onRemove={noop}
        onAdjustHp={noop}
        onSetHp={noop}
        onUpdateInitiative={noop}
        onSetConditions={noop}
        onSetImageUrl={noop}
        onToggleHpReveal={onToggleHpReveal}
      />,
    )
    fireEvent.click(screen.getByTitle(/HP escondido na mesa/))
    expect(onToggleHpReveal).toHaveBeenCalled()
  })
})
