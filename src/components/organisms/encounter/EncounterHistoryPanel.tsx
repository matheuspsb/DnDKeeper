import type { EncounterSnapshot } from '../../../types/encounter'
import { DIFFICULTY_LABEL, DIFFICULTY_COLOR, DIFFICULTY_BG } from '../../../constants/encounter'
import { formatNumber } from '../../../utils/number'
import TrashIcon from '../../atoms/icons/TrashIcon'
import Button from '../../atoms/Button'

interface EncounterHistoryPanelProps {
  history: EncounterSnapshot[]
  onSendXp: (id: string) => void
  onSendAll: () => void
  onDelete: (id: string) => void
  onClear: () => void
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  const isToday = date.toDateString() === new Date().toDateString()
  if (isToday) return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function EncounterHistoryPanel({
  history,
  onSendXp,
  onSendAll,
  onDelete,
  onClear,
}: EncounterHistoryPanelProps) {
  const unsent = history.filter((snapshot) => !snapshot.xpSent)
  const totalPendingXpPerPlayer = unsent.reduce((sum, snapshot) => sum + snapshot.xpPerPlayer, 0)
  const hasUnsent = unsent.length > 0

  return (
    <div className="bg-black-300 border border-black-100 rounded-xl flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-black-100 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="text-white-100 font-semibold text-sm">Histórico de Combates</span>
          {history.length > 0 && (
            <span className="text-[10px] bg-black-400 border border-black-100 text-white-300 px-2 py-0.5 rounded-full">
              {history.length} combate{history.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {hasUnsent && (
            <div className="flex items-center gap-2">
              <span className="text-white-300/50 text-xs tabular-nums">
                +{formatNumber(totalPendingXpPerPlayer)} xp/jogador pendente
              </span>
              <Button
                variant="primary"
                onClick={onSendAll}
                className="w-auto! px-4 h-8 text-xs gap-1.5"
              >
                Enviar Tudo
              </Button>
            </div>
          )}
          {history.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="text-xs text-white-300/40 hover:text-red-100 transition-colors"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col divide-y divide-black-100">
        {history.length === 0 && (
          <div className="flex items-center justify-center py-10">
            <p className="text-white-300/30 text-sm text-center max-w-52">
              Salve encontros para acompanhar o XP acumulado ao longo da sessão
            </p>
          </div>
        )}

        {history.map((snapshot) => (
          <div key={snapshot.id} className="flex items-center gap-4 px-5 py-3 flex-wrap">
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${DIFFICULTY_BG[snapshot.difficulty]} ${DIFFICULTY_COLOR[snapshot.difficulty]}`}
              >
                {DIFFICULTY_LABEL[snapshot.difficulty]}
              </span>
              <span className="text-white-300/40 text-[10px] tabular-nums">
                {formatTime(snapshot.savedAt)}
              </span>
            </div>

            <div className="flex items-center gap-1 flex-wrap flex-1 min-w-0">
              {snapshot.party.map((member) => (
                <span
                  key={member.id}
                  className="text-[10px] bg-black-400 border border-black-100 text-white-300/70 px-2 py-0.5 rounded-full"
                >
                  {member.name || '—'}
                </span>
              ))}
              <span className="text-white-300/30 text-[10px]">
                · {snapshot.monsterCount} monstro{snapshot.monsterCount !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex items-center gap-4 shrink-0 ml-auto">
              <div className="text-right">
                <p className="text-white-100 text-sm font-semibold tabular-nums">
                  {formatNumber(snapshot.rawXp)} xp
                </p>
                <p className="text-white-300/40 text-[10px] tabular-nums">
                  {formatNumber(snapshot.xpPerPlayer)} xp/jogador
                </p>
              </div>

              {snapshot.xpSent ? (
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-600/15 border border-emerald-600/30 px-2 py-1 rounded-full">
                  Enviado
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onSendXp(snapshot.id)}
                  className="text-xs font-medium text-yellow bg-yellow/10 border border-yellow/30 hover:bg-yellow/20 transition-colors px-3 py-1 rounded-full"
                >
                  Enviar XP
                </button>
              )}

              <button
                type="button"
                onClick={() => onDelete(snapshot.id)}
                className="text-white-300/30 hover:text-red-100 transition-colors"
              >
                <TrashIcon size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EncounterHistoryPanel
