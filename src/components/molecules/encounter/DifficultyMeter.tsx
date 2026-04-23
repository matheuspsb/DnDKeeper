import { useState } from 'react'
import type { DifficultyThresholds, EncounterDifficulty } from '../../../types/encounter'
import { DIFFICULTY_LABEL, DIFFICULTY_ORDER } from '../../../constants/encounter'
import { formatNumber } from '../../../utils/number'
import { spawnParticles, type Particle } from '../../../utils/encounter'

interface DifficultyMeterProps {
  thresholds: DifficultyThresholds
  adjustedXp: number
  difficulty: EncounterDifficulty
}

const ZONE_COLORS: Record<string, string> = {
  Trivial: 'bg-white-300/10',
  Fácil: 'bg-emerald-600/50',
  Médio: 'bg-yellow/50',
  Difícil: 'bg-orange-500/50',
  Mortal: 'bg-red-100/60',
}

const PARTICLE_COLOR: Record<EncounterDifficulty, string> = {
  trivial: 'bg-white-300/40',
  easy: 'bg-emerald-400',
  medium: 'bg-yellow',
  hard: 'bg-orange-400',
  deadly: 'bg-red-100',
}

function DifficultyMeter({ thresholds, adjustedXp, difficulty }: DifficultyMeterProps) {
  const [prevDifficulty, setPrevDifficulty] = useState<EncounterDifficulty>(difficulty)
  const [particles, setParticles] = useState<Particle[]>([])

  if (prevDifficulty !== difficulty) {
    const upgraded = DIFFICULTY_ORDER.indexOf(difficulty) > DIFFICULTY_ORDER.indexOf(prevDifficulty)
    setPrevDifficulty(difficulty)
    setParticles(adjustedXp > 0 ? spawnParticles(upgraded ? 10 : 6) : [])
  }

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
    {
      label: 'Trivial',
      diff: 'trivial' as EncounterDifficulty,
      xpStart: 0,
      xpEnd: thresholds.easy,
    },
    {
      label: DIFFICULTY_LABEL.easy,
      diff: 'easy' as EncounterDifficulty,
      xpStart: thresholds.easy,
      xpEnd: thresholds.medium,
    },
    {
      label: DIFFICULTY_LABEL.medium,
      diff: 'medium' as EncounterDifficulty,
      xpStart: thresholds.medium,
      xpEnd: thresholds.hard,
    },
    {
      label: DIFFICULTY_LABEL.hard,
      diff: 'hard' as EncounterDifficulty,
      xpStart: thresholds.hard,
      xpEnd: thresholds.deadly,
    },
    {
      label: DIFFICULTY_LABEL.deadly,
      diff: 'deadly' as EncounterDifficulty,
      xpStart: thresholds.deadly,
      xpEnd: cap,
    },
  ]

  const markerPct = Math.min(99.5, (adjustedXp / cap) * 100)

  return (
    <div className="flex flex-col gap-2">
      <div className="relative h-8">
        <div className="absolute inset-0 flex rounded-lg overflow-hidden gap-px">
          {zones.map((zone) => {
            const width = ((zone.xpEnd - zone.xpStart) / cap) * 100
            const active = zone.diff === difficulty
            return (
              <div
                key={zone.label}
                className={`relative h-full overflow-hidden transition-opacity duration-400 ${ZONE_COLORS[zone.label]} ${active ? 'opacity-100' : 'opacity-35'}`}
                style={{ width: `${width}%` }}
              >
                {active && <div className="shimmer-child absolute inset-0" />}
              </div>
            )
          })}
        </div>

        {adjustedXp > 0 && (
          <div
            className="meter-marker absolute top-0 bottom-0 w-0.5 bg-white-100 rounded-full"
            style={{ left: `${markerPct}%` }}
          >
            {particles.map((particle: Particle) => (
              <div
                key={particle.id}
                className={`encounter-particle absolute rounded-full ${PARTICLE_COLOR[difficulty]}`}
                style={
                  {
                    width: particle.size,
                    height: particle.size,
                    top: '50%',
                    left: '50%',
                    marginLeft: -particle.size / 2,
                    animationDelay: `${particle.delay}ms`,
                    '--dx': `${particle.dx}px`,
                    '--dy': `${particle.dy}px`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex">
        {zones.map((zone) => {
          const width = ((zone.xpEnd - zone.xpStart) / cap) * 100
          const active = zone.diff === difficulty
          return (
            <div
              key={zone.label}
              style={{ width: `${width}%` }}
              className="flex flex-col items-start"
            >
              <span
                className={`text-[10px] font-medium truncate transition-colors duration-300 ${active ? 'text-white-100' : 'text-white-300/35'}`}
              >
                {zone.label}
              </span>
              {zone.xpStart > 0 && (
                <span
                  className={`text-[9px] transition-colors duration-300 ${active ? 'text-white-300/60' : 'text-white-300/25'}`}
                >
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
