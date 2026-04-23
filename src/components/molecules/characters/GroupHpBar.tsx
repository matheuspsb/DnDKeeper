import { formatNumber } from '../../../utils/number'
import { resolveHpBarColor } from '../../../utils/character'

interface GroupHpBarProps {
  totalHP: number
  totalMaxHP: number
  percentage: number
}

function GroupHpBar({ totalHP, totalMaxHP, percentage }: GroupHpBarProps) {
  return (
    <div className="bg-black-400 border border-black-100 rounded-xl px-5 py-3 flex items-center gap-6">
      <div className="flex items-center gap-2">
        <span className="text-red-100 text-sm">♥</span>
        <span className="text-white-300 text-sm">HP do Grupo</span>
        <span className="text-white-100 font-bold tabular-nums text-sm">
          {formatNumber(totalHP)} / {formatNumber(totalMaxHP)}
        </span>
      </div>
      <div className="flex-1 h-1.5 bg-black-500 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: resolveHpBarColor(percentage),
            transition: 'width 0.35s ease',
          }}
        />
      </div>
      <span className="text-white-300/50 text-xs tabular-nums">{Math.round(percentage)}%</span>
    </div>
  )
}

export default GroupHpBar
