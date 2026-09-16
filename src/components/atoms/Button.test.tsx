import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Button from './Button'

describe('Button', () => {
  it('renderiza o texto e responde a clique', () => {
    render(<Button>Salvar</Button>)
    expect(screen.getByText('Salvar')).toBeInTheDocument()
  })

  it('size="md" (padrão) usa o pill cheio histórico', () => {
    render(<Button>Salvar</Button>)
    expect(screen.getByText('Salvar')).toHaveClass('h-[42px]', 'rounded-full')
  })

  it('size="sm" usa o formato compacto, sem afetar o padrão', () => {
    render(<Button size="sm">Entrar</Button>)
    const button = screen.getByText('Entrar')
    expect(button).toHaveClass('h-10', 'rounded-lg')
    expect(button).not.toHaveClass('h-[42px]', 'rounded-full')
  })

  it('variant="secondary" aplica as classes de contorno', () => {
    render(<Button variant="secondary">Cancelar</Button>)
    expect(screen.getByText('Cancelar')).toHaveClass('bg-transparent', 'border-btn-secondary-border')
  })

  it('fullWidth adiciona w-full', () => {
    render(<Button fullWidth>Confirmar</Button>)
    expect(screen.getByText('Confirmar')).toHaveClass('w-full')
  })

  it('className extra é preservado junto das classes do componente', () => {
    render(<Button className="mt-4">Ok</Button>)
    expect(screen.getByText('Ok')).toHaveClass('mt-4', 'h-[42px]')
  })

  it('repassa props nativas do botão (disabled, type, onClick)', () => {
    render(
      <Button type="submit" disabled>
        Enviar
      </Button>,
    )
    const button = screen.getByText('Enviar') as HTMLButtonElement
    expect(button.type).toBe('submit')
    expect(button.disabled).toBe(true)
  })
})
