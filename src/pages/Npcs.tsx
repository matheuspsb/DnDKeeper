import { useState, useMemo } from 'react'
import type { Npc } from '../types/npc.types'
import type { Faction, NpcStatus } from '../types/npc.types'
import { useNpcs } from '../hooks/useNpcs'
import NpcCard from '../components/molecules/npc/NpcCard'
import NpcEmpty from '../components/molecules/npc/NpcEmpty'
import NpcFilters from '../components/molecules/npc/NpcFilters'
import NpcModal from '../components/organisms/NpcModal'
import Button from '../components/atoms/Button'
import PlusIcon from '../components/atoms/icons/PlusIcon'
import { useAuth } from '../contexts/AuthContext'

type StatusFilter = NpcStatus | 'todos'
type FactionFilter = Faction | 'todas'

function Npcs() {
  const { user } = useAuth()
  const { npcs, addNpc, updateNpc, deleteNpc } = useNpcs()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingNpc, setEditingNpc] = useState<Npc | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos')
  const [factionFilter, setFactionFilter] = useState<FactionFilter>('todas')

  const filtered = useMemo(() => {
    return npcs.filter((npc) => {
      if (statusFilter !== 'todos' && npc.status !== statusFilter) return false
      if (factionFilter !== 'todas' && npc.faction !== factionFilter) return false
      return true
    })
  }, [npcs, statusFilter, factionFilter])

  function openAdd() {
    setEditingNpc(null)
    setModalOpen(true)
  }

  function openEdit(npc: Npc) {
    setEditingNpc(npc)
    setModalOpen(true)
  }

  function handleSave(data: Omit<Npc, 'id'>) {
    if (editingNpc) {
      updateNpc(editingNpc.id, data)
    } else {
      addNpc(data)
    }
    setModalOpen(false)
  }

  function renderContent() {
    if (npcs.length === 0) return <NpcEmpty onAdd={openAdd} />

    if (filtered.length === 0)
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-white-300/60 text-sm">
            Nenhum NPC encontrado com os filtros selecionados.
          </p>
        </div>
      )

    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((npc) => (
          <NpcCard
            key={npc.id}
            npc={npc}
            onEdit={() => openEdit(npc)}
            onDelete={() => deleteNpc(npc.id)}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 px-8 pt-4 pb-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white-100 text-3xl font-bold">NPCs</h2>
            <p className="text-white-300/60 text-sm mt-1">
              {npcs.length === 0 ? 'Nenhum NPC' : `${npcs.length} NPC${npcs.length > 1 ? 's' : ''}`}
              {filtered.length !== npcs.length &&
                ` · ${filtered.length} exibido${filtered.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          {user?.role === 'dm' && (
            <Button variant="primary" onClick={openAdd} className="flex items-center gap-2">
              <PlusIcon size={16} />
              Novo NPC
            </Button>
          )}
        </div>

        {npcs.length > 0 && (
          <NpcFilters
            statusFilter={statusFilter}
            factionFilter={factionFilter}
            onStatusChange={setStatusFilter}
            onFactionChange={setFactionFilter}
            onClear={() => {
              setStatusFilter('todos')
              setFactionFilter('todas')
            }}
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-8">{renderContent()}</div>

      {modalOpen && (
        <NpcModal initialNpc={editingNpc} onSave={handleSave} onClose={() => setModalOpen(false)} />
      )}
    </div>
  )
}

export default Npcs
