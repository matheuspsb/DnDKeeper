import type { ButtonHTMLAttributes } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

function IconButton({ active = false, children, className = '', ...props }: IconButtonProps) {
  return (
    <button
      className={`
        flex items-center justify-center w-10 h-10 rounded-lg border transition-colors
        ${
          active
            ? 'border-red-100 text-red-100 bg-red-100/10'
            : 'border-black-200 text-white-300 hover:text-white-100 hover:border-black-100'
        } ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

export default IconButton
