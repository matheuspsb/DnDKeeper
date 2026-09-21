import { useNpcDelete, useNpcs } from '../hooks/npc/useNpcs'
import { useNpcFilters } from '../hooks/npc/useNpcFilters'
import { useNpcModal } from '../hooks/npc/useNpcModal'
import { useNpcLightbox } from '../hooks/npc/useNpcLightbox'
import { resolveImageUrl } from '../constants/arts'
import NpcContent from '../components/molecules/npc/NpcContent'
import NpcDossierControls from '../components/molecules/npc/NpcDossierControls'
import NpcModal from '../components/organisms/npc/NpcModal'
import Lightbox from '../components/organisms/Lightbox'
import Button from '../components/atoms/Button'
import PlusIcon from '../components/atoms/icons/PlusIcon'
import { useAuth } from '../contexts/AuthContext'

function Npcs() {
  const { user } = useAuth()
  const canEdit = user?.role === 'dm'
  const { data: npcs = [], isLoading, isError } = useNpcs()
  const { error: deleteError, handleDelete } = useNpcDelete()

  const npcFilters = useNpcFilters(npcs)
  const npcModal = useNpcModal()
  const lightbox = useNpcLightbox(npcFilters.filtered)

  const meta = isLoading ? 'carregando o arquivo…' : npcFilters.meta

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
            <Button variant="primary" onClick={npcModal.openAdd} className="flex items-center gap-2">
              <PlusIcon size={16} />
              Nova ficha
            </Button>
          )}
        </div>

        {npcs.length > 0 && (
          <NpcDossierControls
            query={npcFilters.query}
            statusFilter={npcFilters.statusFilter}
            hasActiveFilters={npcFilters.hasActiveFilters}
            onQueryChange={npcFilters.setQuery}
            onStatusChange={npcFilters.setStatusFilter}
            onClear={npcFilters.clearFilters}
          />
        )}
      </div>

      <div className="flex-1 overflow-x-hidden overflow-y-auto px-8 pt-1 pb-10">
        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <p className="font-mono text-[14px] text-bone-300">abrindo o arquivo…</p>
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center py-24">
            <p className="font-mono text-[14px] text-wax">o arquivo não pôde ser aberto.</p>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {deleteError && <p className="mb-4 font-mono text-[13px] text-wax">{deleteError}</p>}
            <NpcContent
              npcs={npcs}
              grouped={npcFilters.groupedByFaction}
              canEdit={canEdit}
              onAdd={npcModal.openAdd}
              onEdit={npcModal.openEdit}
              onDelete={handleDelete}
              onImageClick={lightbox.open}
            />
          </>
        )}
      </div>

      {npcModal.isOpen && (
        <NpcModal
          initialNpc={npcModal.editingNpc}
          onSave={npcModal.handleSave}
          onClose={npcModal.close}
        />
      )}

      {lightbox.activeNpc?.imageUrl && (
        <Lightbox
          image={{
            id: lightbox.activeNpc.id,
            name: lightbox.activeNpc.name,
            url: resolveImageUrl(lightbox.activeNpc.imageUrl),
            fullUrl: resolveImageUrl(lightbox.activeNpc.imageUrl),
            category: 'npcs',
          }}
          onClose={lightbox.close}
          onPrev={lightbox.hasPrev ? lightbox.goPrev : null}
          onNext={lightbox.hasNext ? lightbox.goNext : null}
        />
      )}
    </div>
  )
}

export default Npcs
