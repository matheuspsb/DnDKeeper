import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Npc } from '../types/npc.types'
import backendApi from '../services/backendApi'

export type NpcInput = Omit<Npc, 'id' | 'createdAt' | 'updatedAt'>

export const npcKeys = {
  all: ['npcs'] as const,
}

async function fetchNpcs(): Promise<Npc[]> {
  const res = await backendApi.get<Npc[]>('/api/npcs')
  return res.data
}

export function useNpcs() {
  return useQuery({ queryKey: npcKeys.all, queryFn: fetchNpcs })
}

export function useAddNpc() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: NpcInput) => {
      const res = await backendApi.post<Npc>('/api/npcs', data)
      return res.data
    },
    onSuccess: (npc) => {
      queryClient.setQueryData<Npc[]>(npcKeys.all, (prev) => (prev ? [...prev, npc] : [npc]))
    },
  })
}

export function useUpdateNpc() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<NpcInput> }) => {
      const res = await backendApi.patch<Npc>(`/api/npcs/${id}`, data)
      return res.data
    },
    onSuccess: (npc) => {
      queryClient.setQueryData<Npc[]>(npcKeys.all, (prev) =>
        prev?.map((existing) => (existing.id === npc.id ? npc : existing)),
      )
    },
  })
}

export function useDeleteNpc() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await backendApi.delete(`/api/npcs/${id}`)
      return id
    },
    onSuccess: (id) => {
      queryClient.setQueryData<Npc[]>(npcKeys.all, (prev) => prev?.filter((npc) => npc.id !== id))
    },
  })
}
