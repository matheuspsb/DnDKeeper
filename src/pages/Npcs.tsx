import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Npc } from '../types/npc.types'
import type { Faction, NpcStatus } from '../types/npc.types'
import { useAddNpc, useDeleteNpc, useNpcs, useUpdateNpc } from '../hooks/useNpcs'
import { FACTIONS, FACTION_COLOR } from '../constants/npc.constants'
import { resolveImageUrl } from '../constants/arts'
import NpcContent from '../components/molecules/npc/NpcContent'
import type { NpcGroup } from '../components/molecules/npc/NpcContent'
import NpcFilters from '../components/molecules/npc/NpcFilters'
import type { GroupBy } from '../components/molecules/npc/NpcFilters'
import NpcModal from '../components/organisms/npc/NpcModal'
import Lightbox from '../components/organisms/Lightbox'
import Button from '../components/atoms/Button'
import PlusIcon from '../components/atoms/icons/PlusIcon'
import { useAuth } from '../contexts/AuthContext'

type StatusFilter = NpcStatus | 'todos'
type FactionFilter = Faction | 'todas'

const NO_LOCATION_LABEL = 'Sem localização'
const LOCATION_COLOR = '#C0C0C0'
const NO_LOCATION_COLOR = '#6b7280'

function Npcs() {
  const { user } = useAuth()
  const { data: npcs = [], isLoading, isError } = useNpcs()
  const addNpc = useAddNpc()
  const updateNpc = useUpdateNpc()
  const deleteNpc = useDeleteNpc()
  const [searchParams, setSearchParams] = useSearchParams()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingNpc, setEditingNpc] = useState<Npc | null>(null)
  const [lightboxNpc, setLightboxNpc] = useState<Npc | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const statusFilter = (searchParams.get('status') ?? 'todos') as StatusFilter
  const factionFilter = (searchParams.get('faction') ?? 'todas') as FactionFilter
  const locationFilter = searchParams.get('location') ?? 'todas'
  const groupBy = (searchParams.get('view') ?? 'location') as GroupBy

  function setFilter(key: 'status' | 'faction' | 'location', value: string, emptyValue: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      value === emptyValue ? next.delete(key) : next.set(key, value)
      return next
    })
  }

  function setGroupBy(value: GroupBy) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      value === 'location' ? next.delete('view') : next.set('view', value)
      return next
    })
  }

  const locations = useMemo(() => {
    const unique = new Set(npcs.map((npc) => npc.location?.trim()).filter((l): l is string => !!l))
    return [...unique].sort((a, b) => a.localeCompare(b))
  }, [npcs])

  const filtered = useMemo(() => {
    return npcs.filter((npc) => {
      if (statusFilter !== 'todos' && npc.status !== statusFilter) return false
      if (factionFilter !== 'todas' && npc.faction !== factionFilter) return false
      if (locationFilter !== 'todas' && npc.location?.trim() !== locationFilter) return false
      return true
    })
  }, [npcs, statusFilter, factionFilter, locationFilter])

  const groupedByFaction = useMemo((): NpcGroup[] => {
    return FACTIONS.map((faction) => ({
      key: faction,
      label: faction,
      color: FACTION_COLOR[faction],
      npcs: filtered.filter((npc) => npc.faction === faction),
    })).filter(({ npcs }) => npcs.length > 0)
  }, [filtered])

  const groupedByLocation = useMemo((): NpcGroup[] => {
    const withLocation = locations
      .map((location) => ({
        key: location,
        label: location,
        color: LOCATION_COLOR,
        npcs: filtered.filter((npc) => npc.location?.trim() === location),
      }))
      .filter(({ npcs }) => npcs.length > 0)

    const withoutLocation = filtered.filter((npc) => !npc.location?.trim())

    return withoutLocation.length > 0
      ? [
          ...withLocation,
          { key: '__none__', label: NO_LOCATION_LABEL, color: NO_LOCATION_COLOR, npcs: withoutLocation },
        ]
      : withLocation
  }, [filtered, locations])

  const grouped = groupBy === 'location' ? groupedByLocation : groupedByFaction

  function openAdd() {
    setEditingNpc(null)
    setModalOpen(true)
  }

  function openEdit(npc: Npc) {
    setEditingNpc(npc)
    setModalOpen(true)
  }

  const npcsWithImage = useMemo(() => filtered.filter((n) => n.imageUrl), [filtered])

  async function handleSave(data: Omit<Npc, 'id' | 'createdAt' | 'updatedAt'>) {
    if (editingNpc) {
      await updateNpc.mutateAsync({ id: editingNpc.id, data })
    } else {
      await addNpc.mutateAsync(data)
    }
    setModalOpen(false)
  }

  async function handleDelete(id: string) {
    setDeleteError(null)
    try {
      await deleteNpc.mutateAsync(id)
    } catch {
      setDeleteError('Não foi possível remover o NPC.')
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 px-8 pt-4 pb-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white-100 text-3xl font-bold">NPCs</h2>
            <p className="text-white-300/60 text-sm mt-1">
              {isLoading
                ? 'Carregando…'
                : npcs.length === 0
                  ? 'Nenhum NPC'
                  : `${npcs.length} NPC${npcs.length > 1 ? 's' : ''}`}
              {!isLoading &&
                filtered.length !== npcs.length &&
                ` · ${filtered.length} exibido${filtered.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {user?.role === 'dm' && (
              <Button variant="primary" onClick={openAdd} className="flex items-center gap-2">
                <PlusIcon size={16} />
                Novo NPC
              </Button>
            )}
          </div>
        </div>

        {npcs.length > 0 && (
          <NpcFilters
            statusFilter={statusFilter}
            factionFilter={factionFilter}
            locationFilter={locationFilter}
            locations={locations}
            groupBy={groupBy}
            onStatusChange={(v) => setFilter('status', v, 'todos')}
            onFactionChange={(v) => setFilter('faction', v, 'todas')}
            onLocationChange={(v) => setFilter('location', v, 'todas')}
            onGroupByChange={setGroupBy}
            onClear={() => setSearchParams(new URLSearchParams())}
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <p className="text-white-300/50 text-sm">Carregando NPCs…</p>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center py-24">
            <p className="text-red-100 text-sm">Não foi possível carregar os NPCs.</p>
          </div>
        ) : (
          <>
            {deleteError && <p className="text-red-100 text-xs mb-4">{deleteError}</p>}
            <NpcContent
              npcs={npcs}
              grouped={grouped}
              onAdd={openAdd}
              onEdit={openEdit}
              onDelete={handleDelete}
              onImageClick={setLightboxNpc}
            />
          </>
        )}
      </div>

      {modalOpen && (
        <NpcModal initialNpc={editingNpc} onSave={handleSave} onClose={() => setModalOpen(false)} />
      )}

      {lightboxNpc?.imageUrl && (() => {
        const idx = npcsWithImage.findIndex((n) => n.id === lightboxNpc.id)
        return (
          <Lightbox
            image={{
              id: lightboxNpc.id,
              name: lightboxNpc.name,
              url: resolveImageUrl(lightboxNpc.imageUrl),
              fullUrl: resolveImageUrl(lightboxNpc.imageUrl),
            }}
            onClose={() => setLightboxNpc(null)}
            onPrev={idx > 0 ? () => setLightboxNpc(npcsWithImage[idx - 1]) : null}
            onNext={idx < npcsWithImage.length - 1 ? () => setLightboxNpc(npcsWithImage[idx + 1]) : null}
          />
        )
      })()}
    </div>
  )
}

export default Npcs
