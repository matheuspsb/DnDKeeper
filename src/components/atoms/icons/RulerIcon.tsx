import type { IconProps } from '../../../types/icon'

function RulerIcon({ size = 20, className = '', strokeWidth = 2 }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="8" width="20" height="8" rx="1" />
      <line x1="6" y1="12" x2="6" y2="16" />
      <line x1="10" y1="12" x2="10" y2="14" />
      <line x1="14" y1="12" x2="14" y2="14" />
      <line x1="18" y1="12" x2="18" y2="16" />
    </svg>
  )
}

export default RulerIcon
