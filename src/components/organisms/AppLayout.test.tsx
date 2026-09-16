import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import AppLayout from './AppLayout'

vi.mock('./Sidebar', () => ({
  default: () => <nav>Sidebar stub</nav>,
}))

describe('AppLayout', () => {
  it('renderiza a Sidebar e a rota filha (via Outlet) dentro do layout', () => {
    render(
      <MemoryRouter initialEntries={['/inside']}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/inside" element={<div>Page content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Sidebar stub')).toBeInTheDocument()
    expect(screen.getByText('Page content')).toBeInTheDocument()
  })
})
