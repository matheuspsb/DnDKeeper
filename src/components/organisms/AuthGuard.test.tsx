import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import AuthGuard from './AuthGuard'
import { useAuth } from '../../contexts/AuthContext'

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}))

const mockedUseAuth = vi.mocked(useAuth)

function renderGuard() {
  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route path="/login" element={<div>Login page</div>} />
        <Route element={<AuthGuard />}>
          <Route path="/protected" element={<div>Protected content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('AuthGuard', () => {
  it('mostra o spinner de carregamento enquanto isLoading é true, sem renderizar a rota', () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
      dmLogin: vi.fn(),
      guestLogin: vi.fn(),
      logout: vi.fn(),
    })

    const { container } = renderGuard()

    expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('redireciona para /login quando não há usuário autenticado', () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      dmLogin: vi.fn(),
      guestLogin: vi.fn(),
      logout: vi.fn(),
    })

    renderGuard()

    expect(screen.getByText('Login page')).toBeInTheDocument()
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
  })

  it('renderiza a rota filha (via Outlet) quando há usuário autenticado, sem montar layout próprio', () => {
    mockedUseAuth.mockReturnValue({
      user: { sub: 'dm-1', role: 'dm' },
      isLoading: false,
      dmLogin: vi.fn(),
      guestLogin: vi.fn(),
      logout: vi.fn(),
    })

    renderGuard()

    expect(screen.getByText('Protected content')).toBeInTheDocument()
  })
})
