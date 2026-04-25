import type { Faction, NpcStatus } from '../../../types/npc.types'
import { FACTIONS, NPC_STATUS_LABEL } from '../../../constants/npc.constants'
import SelectArrow from '../../atoms/SelectArrow'

type StatusFilter = NpcStatus | 'todos'
type FactionFilter = Faction | 'todas'

interface NpcFiltersProps {
  statusFilter: StatusFilter
  factionFilter: FactionFilter
  onStatusChange: (value: StatusFilter) => void
  onFactionChange: (value: FactionFilter) => void
  onClear: () => void
}

const selectClass = `
  bg-black-400 border border-black-100 rounded-lg px-3 py-1.5 pr-8
  text-white-300 text-sm focus:outline-none focus:border-red-100
  transition-colors cursor-pointer appearance-none
`

function NpcFilters({
  statusFilter,
  factionFilter,
  onStatusChange,
  onFactionChange,
  onClear,
}: NpcFiltersProps) {
  const hasActiveFilters = statusFilter !== 'todos' || factionFilter !== 'todas'

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative">
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
          className={selectClass}
        >
          <option value="todos">Todos os status</option>
          {(Object.entries(NPC_STATUS_LABEL) as [NpcStatus, string][]).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <SelectArrow />
      </div>

      <div className="relative">
        <select
          value={factionFilter}
          onChange={(e) => onFactionChange(e.target.value as FactionFilter)}
          className={selectClass}
        >
          <option value="todas">Todas as facções</option>
          {FACTIONS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <SelectArrow />
      </div>

      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="text-xs text-white-300/50 hover:text-white-300 transition-colors cursor-pointer underline underline-offset-2"
        >
          Limpar filtros
        </button>
      )}
    </div>
  )
}

export default NpcFilters
