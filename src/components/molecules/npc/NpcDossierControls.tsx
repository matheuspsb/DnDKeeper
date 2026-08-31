import type { NpcStatus } from '../../../types/npc.types'
import { NPC_STATUS_LABEL } from '../../../constants/npc.constants'
import SearchIcon from '../../atoms/icons/SearchIcon'
import XIcon from '../../atoms/icons/XIcon'
import SelectArrow from '../../atoms/SelectArrow'

type StatusFilter = NpcStatus | 'todos'

interface NpcDossierControlsProps {
  query: string
  statusFilter: StatusFilter
  hasActiveFilters: boolean
  onQueryChange: (value: string) => void
  onStatusChange: (value: StatusFilter) => void
  onClear: () => void
}

function NpcDossierControls({
  query,
  statusFilter,
  hasActiveFilters,
  onQueryChange,
  onStatusChange,
  onClear,
}: NpcDossierControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative flex min-w-60 flex-1 items-center bg-ink-900 ring-1 ring-ink-800 transition-colors focus-within:ring-brass sm:max-w-sm">
        <SearchIcon size={15} className="pointer-events-none absolute left-3 text-bone-400" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Buscar por nome, facção, ficha…"
          className="w-full bg-transparent py-2 pr-8 pl-9 font-mono text-[13px] text-bone-100 placeholder:text-bone-400/70 focus:outline-none"
        />
        {query && (
          <button
            onClick={() => onQueryChange('')}
            aria-label="Limpar busca"
            className="absolute right-2 flex h-6 w-6 items-center justify-center text-bone-400 transition-colors hover:text-bone-100 focus-visible:outline focus-visible:outline-brass"
          >
            <XIcon size={14} />
          </button>
        )}
      </div>

      <div className="relative">
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
          className="cursor-pointer appearance-none bg-ink-900 py-2 pr-8 pl-3 font-mono text-[12px] text-bone-400 ring-1 ring-ink-800 transition-colors focus:ring-brass focus:outline-none"
        >
          <option value="todos">todos os status</option>
          {(Object.entries(NPC_STATUS_LABEL) as [NpcStatus, string][]).map(([value, label]) => (
            <option key={value} value={value}>
              {label.toLowerCase()}
            </option>
          ))}
        </select>
        <SelectArrow />
      </div>

      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="font-mono text-[11px] tracking-wide text-bone-400 underline underline-offset-4 transition-colors hover:text-bone-100"
        >
          limpar
        </button>
      )}
    </div>
  )
}

export default NpcDossierControls
