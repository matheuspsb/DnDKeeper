import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CharacterCard from './CharacterCard'
import type { Character } from '../../../types/character'

const CHARACTER: Character = {
  id: 'c1',
  name: 'Aria',
  playerName: 'Jogador 1',
  characterClass: 'Guerreira',
  race: 'Humana',
  currentHP: 30,
  maxHP: 50,
  xp: 0,
  notes: '',
}

describe('CharacterCard', () => {
  it('renderiza nome e HP', () => {
    render(
      <CharacterCard character={CHARACTER} onEdit={vi.fn()} onDelete={vi.fn()} onHpAdjust={vi.fn()} />,
    )
    expect(screen.getByText('Aria')).toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()
  })

  it('não mostra o selo "CAÍDO" quando o HP é maior que 0', () => {
    render(
      <CharacterCard character={CHARACTER} onEdit={vi.fn()} onDelete={vi.fn()} onHpAdjust={vi.fn()} />,
    )
    expect(screen.queryByText('CAÍDO')).not.toBeInTheDocument()
  })

  it('mostra o selo "CAÍDO" quando currentHP é 0 (edge case)', () => {
    render(
      <CharacterCard
        character={{ ...CHARACTER, currentHP: 0 }}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onHpAdjust={vi.fn()}
      />,
    )
    expect(screen.getByText('CAÍDO')).toBeInTheDocument()
  })

  it('ajustar HP pelos botões de delta chama onHpAdjust (composição com CharacterHpControls)', () => {
    const onHpAdjust = vi.fn()
    render(
      <CharacterCard character={CHARACTER} onEdit={vi.fn()} onDelete={vi.fn()} onHpAdjust={onHpAdjust} />,
    )
    fireEvent.click(screen.getByText('+5'))
    expect(onHpAdjust).toHaveBeenCalledWith(5)
  })

  it('excluir exige confirmação antes de chamar onDelete (composição com CharacterCardActions)', () => {
    const onDelete = vi.fn()
    render(
      <CharacterCard character={CHARACTER} onEdit={vi.fn()} onDelete={onDelete} onHpAdjust={vi.fn()} />,
    )
    fireEvent.click(screen.getByTitle('Remover'))
    expect(onDelete).not.toHaveBeenCalled()
    fireEvent.click(screen.getByText('Sim'))
    expect(onDelete).toHaveBeenCalled()
  })
})
