import { useCallback, useState } from 'react'
import type { Npc } from '../types/npc.types'
import { useAddNpc, useUpdateNpc } from './useNpcs'
import type { NpcInput } from './useNpcs'

export function useNpcModal() {
  const addNpc = useAddNpc()
  const updateNpc = useUpdateNpc()
  const [editingNpc, setEditingNpc] = useState<Npc | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const openAdd = useCallback(() => {
    setEditingNpc(null)
    setIsOpen(true)
  }, [])

  const openEdit = useCallback((npc: Npc) => {
    setEditingNpc(npc)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => setIsOpen(false), [])

  async function handleSave(data: NpcInput) {
    if (editingNpc) {
      await updateNpc.mutateAsync({ id: editingNpc.id, data })
    } else {
      await addNpc.mutateAsync(data)
    }
    setIsOpen(false)
  }

  return { isOpen, editingNpc, openAdd, openEdit, close, handleSave }
}
