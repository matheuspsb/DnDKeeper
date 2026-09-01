import { useInitiative } from '../hooks/useInitiative'
import { useInitiativeStream } from '../hooks/useInitiativeStream'
import { useTicker } from '../hooks/useTicker'
import { useDelayedFlag } from '../hooks/useDelayedFlag'
import { useValueChangePulse } from '../hooks/useValueChangePulse'
import TablePanelHeader from '../components/organisms/table/TablePanelHeader'
import CurrentTurnHero from '../components/organisms/table/CurrentTurnHero'
import InitiativeOrderList from '../components/organisms/table/InitiativeOrderList'
import OfflineNotice from '../components/molecules/table/OfflineNotice'
import RoundFlash from '../components/molecules/table/RoundFlash'
import SpotlightImageLayer from '../components/molecules/table/SpotlightImageLayer'
import TableEmptyState from '../components/molecules/table/TableEmptyState'

const OFFLINE_GRACE_MS = 4000
const ROUND_FLASH_MS = 1600

function Table() {
  const { connected, lastEventAt } = useInitiativeStream()
  const { combatants, currentIndex, round, spotlight } = useInitiative()

  const now = useTicker(1000)
  const offline = useDelayedFlag(!connected, OFFLINE_GRACE_MS)
  const roundFlash = useValueChangePulse(round, {
    durationMs: ROUND_FLASH_MS,
    enabled: combatants.length > 0,
  })

  const current = combatants[currentIndex] ?? null

  return (
    <div className="relative flex min-h-dvh w-full flex-col bg-black-500 px-6 py-6 text-white-100 md:px-10 md:py-8">
      {offline && <OfflineNotice />}

      <TablePanelHeader round={round} connected={connected} lastEventAt={lastEventAt} now={now} />

      {combatants.length === 0 ? (
        <TableEmptyState />
      ) : (
        <>
          {current && <CurrentTurnHero combatant={current} />}
          <InitiativeOrderList combatants={combatants} currentIndex={currentIndex} />
        </>
      )}

      <RoundFlash round={round} visible={roundFlash} />
      <SpotlightImageLayer spotlight={spotlight} />
    </div>
  )
}

export default Table
