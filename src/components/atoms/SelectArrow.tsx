interface SelectArrowProps {
  size?: number
  className?: string
}

function SelectArrow({ size = 14, className = '' }: SelectArrowProps) {
  return (
    <svg
      className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-white-300/50 ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export default SelectArrow
