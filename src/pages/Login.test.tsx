import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Login from './Login'
import { useAuth } from '../contexts/AuthContext'

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}))

const mockedUseAuth = vi.mocked(useAuth)

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

beforeEach(() => {
  mockNavigate.mockClear()
  mockedUseAuth.mockReturnValue({
    user: null,
    isLoading: false,
    dmLogin: vi.fn(),
    guestLogin: vi.fn(),
    logout: vi.fn(),
  })
})

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  )
}

describe('Login', () => {
  it('renderiza os dois botões de submit (Mestre e Convidado)', () => {
    renderLogin()
    expect(screen.getByText('Entrar como Mestre')).toBeInTheDocument()
    expect(screen.getByText('Entrar como Convidado')).toBeInTheDocument()
  })

  it('os botões de submit não ficam desabilitados por padrão', () => {
    renderLogin()
    expect(screen.getByText('Entrar como Mestre').closest('button')).not.toBeDisabled()
    expect(screen.getByText('Entrar como Convidado').closest('button')).not.toBeDisabled()
  })

  it('"Abrir painel da mesa" navega pra /mesa', () => {
    renderLogin()
    fireEvent.click(screen.getByText('Abrir painel da mesa'))
    expect(mockNavigate).toHaveBeenCalledWith('/mesa')
  })

  it('redireciona pra /npcs quando já existe um usuário logado', () => {
    mockedUseAuth.mockReturnValue({
      user: { sub: 'dm-1', role: 'dm' },
      isLoading: false,
      dmLogin: vi.fn(),
      guestLogin: vi.fn(),
      logout: vi.fn(),
    })
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Login />
      </MemoryRouter>,
    )
    expect(screen.queryByText('Entrar como Mestre')).not.toBeInTheDocument()
  })
})
