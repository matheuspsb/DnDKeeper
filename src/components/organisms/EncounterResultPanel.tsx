import type { EncounterResult } from '../../types/encounter'
import { DIFFICULTY_LABEL, DIFFICULTY_COLOR, DIFFICULTY_BG } from '../../constants/encounter'
import { formatNumber } from '../../utils/number'
import DifficultyMeter from '../molecules/encounter/DifficultyMeter'
import StatCard from '../molecules/encounter/StatCard'

interface EncounterResultPanelProps {
  result: EncounterResult
  partySize: number
  monsterCount: number
}

function EncounterResultPanel({ result, partySize, monsterCount }: EncounterResultPanelProps) {
  const { rawXp, adjustedXp, multiplier, xpPerPlayer, thresholds, difficulty } = result

  const isEmpty = partySize === 0 && monsterCount === 0

  return (
    <div className="bg-black-300 border border-black-100 rounded-xl flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-white-100 font-semibold text-sm">Resultado</span>
        {!isEmpty && (
          <span
            key={difficulty}
            className={`difficulty-badge-enter text-xs font-bold px-3 py-1 rounded-full border ${DIFFICULTY_BG[difficulty]} ${DIFFICULTY_COLOR[difficulty]}`}
          >
            {DIFFICULTY_LABEL[difficulty]}
          </span>
        )}
      </div>

      {isEmpty ? (
        <div className="flex items-center justify-center py-10">
          <p className="text-white-300/30 text-sm text-center max-w-50">
            Configure o grupo e os monstros para ver o resultado
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              label="XP Bruto"
              value={formatNumber(rawXp)}
              sub={`${monsterCount} monstro${monsterCount !== 1 ? 's' : ''}`}
            />
            <StatCard
              label="Multiplicador"
              value={`×${multiplier}`}
              sub={`${monsterCount} vs ${partySize} jogador${partySize !== 1 ? 'es' : ''}`}
            />
            <StatCard
              label="XP Ajustado"
              value={formatNumber(adjustedXp)}
              sub="usado para dificuldade"
            />
            <StatCard
              label="XP por Jogador"
              value={partySize > 0 ? formatNumber(xpPerPlayer) : '—'}
              sub="XP bruto dividido"
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-white-300/60 text-[10px] font-medium uppercase tracking-wider">
              Medidor de Dificuldade
            </span>
            <DifficultyMeter
              thresholds={thresholds}
              adjustedXp={adjustedXp}
              difficulty={difficulty}
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {(['easy', 'medium', 'hard', 'deadly'] as const).map((level) => (
              <div key={level} className="flex flex-col gap-0.5">
                <span
                  className={`text-[10px] font-semibold ${difficulty === level ? DIFFICULTY_COLOR[level] : 'text-white-300/30'}`}
                >
                  {DIFFICULTY_LABEL[level]}
                </span>
                <span
                  className={`text-xs tabular-nums ${difficulty === level ? 'text-white-100' : 'text-white-300/40'}`}
                >
                  {formatNumber(thresholds[level])} xp
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default EncounterResultPanel
