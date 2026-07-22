import type { IconProps } from '../../../types/icon'

function SkullIcon({ size = 20, className = '', strokeWidth = 2 }: IconProps) {
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
      <circle cx="12" cy="11" r="8" />
      <path d="m8 22 1-1v-2c0-.6.4-1 1-1h4c.6 0 1 .4 1 1v2l1 1" />
      <path d="M9 12h.01" />
      <path d="M15 12h.01" />
    </svg>
  )
}

export default SkullIcon
