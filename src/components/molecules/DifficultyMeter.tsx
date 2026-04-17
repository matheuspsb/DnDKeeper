import type { DifficultyThresholds, EncounterDifficulty } from '../../types/encounter'
import { DIFFICULTY_LABEL } from '../../constants/encounter'
import { formatNumber } from '../../utils/number'

interface DifficultyMeterProps {
  thresholds: DifficultyThresholds
  adjustedXp: number
  difficulty: EncounterDifficulty
}

const ZONE_COLORS = [
  'bg-white-300/10',
  'bg-emerald-600/50',
  'bg-yellow/50',
  'bg-orange-500/50',
  'bg-red-100/60',
]

function DifficultyMeter({ thresholds, adjustedXp, difficulty }: DifficultyMeterProps) {
  const hasParty = thresholds.easy > 0

  if (!hasParty) {
    return (
      <div className="flex items-center justify-center h-14 rounded-lg bg-black-400 border border-black-100">
        <span className="text-white-300/40 text-xs">Adicione jogadores para ver o medidor</span>
      </div>
    )
  }

  const cap = thresholds.deadly * 1.5
  const zones = [
    { label: 'Trivial', xpStart: 0, xpEnd: thresholds.easy },
    { label: DIFFICULTY_LABEL.easy, xpStart: thresholds.easy, xpEnd: thresholds.medium },
    { label: DIFFICULTY_LABEL.medium, xpStart: thresholds.medium, xpEnd: thresholds.hard },
    { label: DIFFICULTY_LABEL.hard, xpStart: thresholds.hard, xpEnd: thresholds.deadly },
    { label: DIFFICULTY_LABEL.deadly, xpStart: thresholds.deadly, xpEnd: cap },
  ]

  const markerPct = Math.min(100, (adjustedXp / cap) * 100)
  const isActive = (idx: number) => idx === ['trivial', 'easy', 'medium', 'hard', 'deadly'].indexOf(difficulty)

  return (
    <div className="flex flex-col gap-2">
      <div className="relative h-8 flex rounded-lg overflow-hidden gap-px">
        {zones.map((zone, idx) => {
          const width = ((zone.xpEnd - zone.xpStart) / cap) * 100
          return (
            <div
              key={zone.label}
              className={`h-full transition-opacity ${ZONE_COLORS[idx]} ${isActive(idx) ? 'opacity-100' : 'opacity-40'}`}
              style={{ width: `${width}%` }}
            />
          )
        })}

        {adjustedXp > 0 && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white-100 shadow-[0_0_4px_rgba(255,255,255,0.8)]"
            style={{ left: `${markerPct}%` }}
          />
        )}
      </div>

      <div className="flex" style={{ position: 'relative' }}>
        {zones.map((zone, idx) => {
          const width = ((zone.xpEnd - zone.xpStart) / cap) * 100
          return (
            <div key={zone.label} style={{ width: `${width}%` }} className="flex flex-col items-start">
              <span className={`text-[10px] font-medium truncate ${isActive(idx) ? 'text-white-100' : 'text-white-300/40'}`}>
                {zone.label}
              </span>
              {idx > 0 && (
                <span className="text-[9px] text-white-300/30">
                  {formatNumber(zone.xpStart)}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DifficultyMeter
