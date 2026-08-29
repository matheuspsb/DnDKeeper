import type { Faction, NpcStatus } from '../../../types/npc.types'
import { FACTIONS, NPC_STATUS_LABEL } from '../../../constants/npc.constants'
import SelectArrow from '../../atoms/SelectArrow'

type StatusFilter = NpcStatus | 'todos'
type FactionFilter = Faction | 'todas'
export type GroupBy = 'location' | 'faction'

interface NpcFiltersProps {
  statusFilter: StatusFilter
  factionFilter: FactionFilter
  locationFilter: string
  locations: string[]
  groupBy: GroupBy
  onStatusChange: (value: StatusFilter) => void
  onFactionChange: (value: FactionFilter) => void
  onLocationChange: (value: string) => void
  onGroupByChange: (value: GroupBy) => void
  onClear: () => void
}

const selectClass = `
  bg-black-400 border border-black-100 rounded-lg px-3 py-1.5 pr-8
  text-white-300 text-sm focus:outline-none focus:border-red-100
  transition-colors cursor-pointer appearance-none
`

const ALL_LOCATIONS = 'todas'

function NpcFilters({
  statusFilter,
  factionFilter,
  locationFilter,
  locations,
  groupBy,
  onStatusChange,
  onFactionChange,
  onLocationChange,
  onGroupByChange,
  onClear,
}: NpcFiltersProps) {
  const hasActiveFilters =
    statusFilter !== 'todos' || factionFilter !== 'todas' || locationFilter !== ALL_LOCATIONS

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-0.5 bg-black-400 border border-black-100 rounded-lg p-0.5">
        {(['location', 'faction'] as GroupBy[]).map((value) => (
          <button
            key={value}
            onClick={() => onGroupByChange(value)}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              groupBy === value
                ? 'bg-red-100 text-white-100'
                : 'text-white-300/60 hover:text-white-300'
            }`}
          >
            {value === 'location' ? 'Localização' : 'Facção'}
          </button>
        ))}
      </div>

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

      {locations.length > 0 && (
        <div className="relative">
          <select
            value={locationFilter}
            onChange={(e) => onLocationChange(e.target.value)}
            className={selectClass}
          >
            <option value={ALL_LOCATIONS}>Todas as localizações</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
          <SelectArrow />
        </div>
      )}

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
