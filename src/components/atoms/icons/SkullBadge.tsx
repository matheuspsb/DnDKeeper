interface SkullBadgeProps {
  radius: number
}

function SkullBadge({ radius }: SkullBadgeProps) {
  const cx = radius * 0.65
  const cy = -(radius * 0.65)
  return (
    <>
      <circle cx={cx} cy={cy} r={Math.max(5, radius * 0.28)} fill="#1c0f0f" stroke="#7f1d1d" strokeWidth={1} />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={Math.max(6, radius * 0.32)} fill="#9ca3af">
        ☠
      </text>
    </>
  )
}

export default SkullBadge
