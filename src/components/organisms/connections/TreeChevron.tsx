interface TreeChevronProps {
  x?: number
  y?: number
  direction: 'right' | 'left' | 'down' | 'up'
  size?: number
  stroke?: string
  strokeWidth?: number
}

const POINTS: Record<TreeChevronProps['direction'], string> = {
  right: '9 18 15 12 9 6',
  left: '15 18 9 12 15 6',
  down: '18 9 12 15 6 9',
  up: '18 15 12 9 6 15',
}

export function TreeChevron({
  x = 0,
  y = 0,
  direction,
  size = 12,
  stroke = '#6b7280',
  strokeWidth = 1.5,
}: TreeChevronProps) {
  const scale = size / 24
  const half = size / 2
  return (
    <g transform={`translate(${x - half}, ${y - half}) scale(${scale})`}>
      <polyline
        points={POINTS[direction]}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth / scale}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  )
}
