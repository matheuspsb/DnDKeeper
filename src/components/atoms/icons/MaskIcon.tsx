import type { IconProps } from '../../../types/icon'

function MaskIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 7c0-1.1.9-2 2-2h12a2 2 0 0 1 2 2v5c0 4.4-3.6 8-8 8S4 16.4 4 12V7z" />
      <path d="M9 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor" stroke="none" />
      <path d="M15 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor" stroke="none" />
      <path d="M9.5 15.5 Q12 17.5 14.5 15.5" />
    </svg>
  )
}

export default MaskIcon
