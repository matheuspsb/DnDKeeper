import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Npc } from '../types/npc.types'
import type { NpcStatus } from '../types/npc.types'
import { useAddNpc, useDeleteNpc, useNpcs, useUpdateNpc } from '../hooks/useNpcs'
import { FACTIONS } from '../constants/npc.constants'
import { resolveImageUrl } from '../constants/arts'
import NpcContent from '../components/molecules/npc/NpcContent'
import NpcDossierControls from '../components/molecules/npc/NpcDossierControls'
import NpcModal from '../components/organisms/npc/NpcModal'
import Lightbox from '../components/organisms/Lightbox'
import Button from '../components/atoms/Button'
import PlusIcon from '../components/atoms/icons/PlusIcon'
import { useAuth } from '../contexts/AuthContext'

type StatusFilter = NpcStatus | 'todos'

function matches(npc: Npc, term: string) {
  const haystack = [npc.name, npc.faction, npc.description, npc.notes].join(' ').toLowerCase()
  return haystack.includes(term)
}

function Npcs() {
  const { user } = useAuth()
  const canEdit = user?.role === 'dm'
  const { data: npcs = [], isLoading, isError } = useNpcs()
  const addNpc = useAddNpc()
  const updateNpc = useUpdateNpc()
  const deleteNpc = useDeleteNpc()
  const [searchParams, setSearchParams] = useSearchParams()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingNpc, setEditingNpc] = useState<Npc | null>(null)
  const [lightboxNpc, setLightboxNpc] = useState<Npc | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const query = searchParams.get('q') ?? ''
  const statusFilter = (searchParams.get('status') ?? 'todos') as StatusFilter

  function setParam(key: 'status' | 'q', value: string, emptyValue: string) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        value === emptyValue ? next.delete(key) : next.set(key, value)
        return next
      },
      { replace: true },
    )
  }

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return npcs.filter((npc) => {
      if (statusFilter !== 'todos' && npc.status !== statusFilter) return false
      if (term && !matches(npc, term)) return false
      return true
    })
  }, [npcs, statusFilter, query])

  const groupedByFaction = useMemo(() => {
    return FACTIONS.map((faction) => ({
      faction,
      npcs: filtered.filter((npc) => npc.faction === faction),
    })).filter(({ npcs }) => npcs.length > 0)
  }, [filtered])

  const npcsWithImage = useMemo(() => filtered.filter((n) => n.imageUrl), [filtered])

  const hasActiveFilters = query.trim() !== '' || statusFilter !== 'todos'

  function openAdd() {
    setEditingNpc(null)
    setModalOpen(true)
  }

  function openEdit(npc: Npc) {
    setEditingNpc(npc)
    setModalOpen(true)
  }

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
      setDeleteError('Não foi possível remover a ficha.')
    }
  }

  const factionCount = groupedByFaction.length
  const meta = isLoading
    ? 'carregando o arquivo…'
    : `${npcs.length} ${npcs.length === 1 ? 'ficha' : 'fichas'} · ${factionCount} ${
        factionCount === 1 ? 'facção' : 'facções'
      }${filtered.length !== npcs.length ? ` · ${filtered.length} em exibição` : ''}`

  return (
    <div className="flex h-full flex-col bg-ink-950">
      <div className="flex shrink-0 flex-col gap-4 px-8 pt-5 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-[12px] font-semibold tracking-[0.3em] text-brass uppercase">
              Dossiê
            </p>
            <h2 className="font-display text-4xl font-bold tracking-wide text-bone-100">NPCs</h2>
            <p className="mt-1.5 font-mono text-[13px] text-bone-300">{meta}</p>
          </div>
          {canEdit && (
            <Button variant="primary" onClick={openAdd} className="flex items-center gap-2">
              <PlusIcon size={16} />
              Nova ficha
            </Button>
          )}
        </div>

        {npcs.length > 0 && (
          <NpcDossierControls
            query={query}
            statusFilter={statusFilter}
            hasActiveFilters={hasActiveFilters}
            onQueryChange={(v) => setParam('q', v, '')}
            onStatusChange={(v) => setParam('status', v, 'todos')}
            onClear={() => setSearchParams(new URLSearchParams(), { replace: true })}
          />
        )}
      </div>

      <div className="flex-1 overflow-x-hidden overflow-y-auto px-8 pt-1 pb-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <p className="font-mono text-[14px] text-bone-300">abrindo o arquivo…</p>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center py-24">
            <p className="font-mono text-[14px] text-wax">o arquivo não pôde ser aberto.</p>
          </div>
        ) : (
          <>
            {deleteError && <p className="mb-4 font-mono text-[13px] text-wax">{deleteError}</p>}
            <NpcContent
              npcs={npcs}
              grouped={groupedByFaction}
              canEdit={canEdit}
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

      {lightboxNpc?.imageUrl &&
        (() => {
          const idx = npcsWithImage.findIndex((n) => n.id === lightboxNpc.id)
          return (
            <Lightbox
              image={{
                id: lightboxNpc.id,
                name: lightboxNpc.name,
                url: resolveImageUrl(lightboxNpc.imageUrl),
                fullUrl: resolveImageUrl(lightboxNpc.imageUrl),
                category: 'npcs',
              }}
              onClose={() => setLightboxNpc(null)}
              onPrev={idx > 0 ? () => setLightboxNpc(npcsWithImage[idx - 1]) : null}
              onNext={
                idx < npcsWithImage.length - 1 ? () => setLightboxNpc(npcsWithImage[idx + 1]) : null
              }
            />
          )
        })()}
    </div>
  )
}

export default Npcs
