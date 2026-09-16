import type { ButtonHTMLAttributes } from 'react'
import XIcon from './icons/XIcon'

type CloseButtonTone = 'default' | 'parchment'

interface CloseButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  size?: number
  tone?: CloseButtonTone
}

const tones: Record<CloseButtonTone, string> = {
  default: 'text-white-300 hover:text-white-100',
  parchment: 'text-[#3d1e06] hover:text-black',
}

function CloseButton({
  size = 20,
  tone = 'default',
  className = '',
  ...props
}: CloseButtonProps) {
  return (
    <button
      type="button"
      aria-label="Fechar"
      className={`transition-colors cursor-pointer ${tones[tone]} ${className}`}
      {...props}
    >
      <XIcon size={size} />
    </button>
  )
}

export default CloseButton
