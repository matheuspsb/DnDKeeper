import { formatRelativeTime } from '../../../utils/time'

interface LiveStatusProps {
  connected: boolean
  lastEventAt: number | null
  now: number
}

function LiveStatus({ connected, lastEventAt, now }: LiveStatusProps) {
  return (
    <div className="flex flex-col items-end gap-0.5">
      <span className="flex items-center gap-2 text-sm font-medium tracking-wide">
        <span
          className={`inline-block h-2.5 w-2.5 rounded-full ${
            connected ? 'animate-pulse bg-green-400' : 'bg-yellow'
          }`}
        />
        <span className={connected ? 'text-green-400' : 'text-yellow'}>
          {connected ? 'ao vivo' : 'reconectando…'}
        </span>
      </span>
      {lastEventAt !== null && (
        <span className="text-[11px] text-white-300/40">
          atualizado {formatRelativeTime(now - lastEventAt)}
        </span>
      )}
    </div>
  )
}

export default LiveStatus
