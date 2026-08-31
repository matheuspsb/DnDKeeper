import { useFullscreen } from '../../../hooks/useFullscreen'
import ExpandIcon from '../../atoms/icons/ExpandIcon'
import LiveStatus from '../../molecules/table/LiveStatus'

interface TablePanelHeaderProps {
  round: number
  connected: boolean
  lastEventAt: number | null
  now: number
}

function TablePanelHeader({ round, connected, lastEventAt, now }: TablePanelHeaderProps) {
  const fullscreen = useFullscreen()

  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex items-baseline gap-4">
        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-white-300/40">
          Rodada
        </span>
        <span
          key={round}
          className="round-pop inline-block tabular-nums text-5xl font-bold leading-none md:text-6xl"
        >
          {round}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {fullscreen.supported && (
          <button
            onClick={fullscreen.toggle}
            title={fullscreen.active ? 'Sair da tela cheia' : 'Tela cheia'}
            aria-label={fullscreen.active ? 'Sair da tela cheia' : 'Tela cheia'}
            className="text-white-300/40 transition-colors hover:text-white-300"
          >
            <ExpandIcon size={18} />
          </button>
        )}
        <LiveStatus connected={connected} lastEventAt={lastEventAt} now={now} />
      </div>
    </header>
  )
}

export default TablePanelHeader
