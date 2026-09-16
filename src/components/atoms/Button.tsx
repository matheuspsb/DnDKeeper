import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary'
type ButtonSize = 'md' | 'sm'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

const variants: Record<ButtonVariant, string> = {
  primary: `
    text-white
    bg-linear-to-b from-btn-from to-btn-to
    border border-btn-border
    hover:brightness-110 active:brightness-95
  `,
  secondary: `
    bg-transparent
    border border-btn-secondary-border
    text-btn-secondary-text
    hover:bg-btn-secondary-border/10 active:bg-btn-secondary-border/20
  `,
}

const sizes: Record<ButtonSize, string> = {
  md: 'h-[42px] px-6 py-2 rounded-full text-sm',
  sm: 'h-10 px-4 py-2 rounded-lg text-sm',
}

const base = `
  inline-flex items-center justify-center
  font-medium
  transition-all cursor-pointer
`

function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
