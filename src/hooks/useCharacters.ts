import { useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Character } from '../types/character'
import backendApi from '../services/backendApi'

export type CharacterInput = Omit<Character, 'id'>

export const characterKeys = {
  all: ['characters'] as const,
}

const HP_SYNC_DELAY_MS = 8000

async function fetchCharacters(): Promise<Character[]> {
  const res = await backendApi.get<Character[]>('/api/characters')
  return res.data
}

export function useCharacters() {
  return useQuery({ queryKey: characterKeys.all, queryFn: fetchCharacters })
}

export function useAddCharacter() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CharacterInput) => {
      const res = await backendApi.post<Character>('/api/characters', data)
      return res.data
    },
    onSuccess: (character) => {
      queryClient.setQueryData<Character[]>(characterKeys.all, (prev) =>
        prev ? [...prev, character] : [character],
      )
    },
  })
}

export function useUpdateCharacter() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CharacterInput> }) => {
      const res = await backendApi.patch<Character>(`/api/characters/${id}`, data)
      return res.data
    },
    onSuccess: (character) => {
      queryClient.setQueryData<Character[]>(characterKeys.all, (prev) =>
        prev?.map((existing) => (existing.id === character.id ? character : existing)),
      )
    },
  })
}

export function useDeleteCharacter() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await backendApi.delete(`/api/characters/${id}`)
      return id
    },
    onSuccess: (id) => {
      queryClient.setQueryData<Character[]>(characterKeys.all, (prev) =>
        prev?.filter((character) => character.id !== id),
      )
    },
  })
}

export function useAdjustCharacterHp() {
  const queryClient = useQueryClient()
  const pendingSyncs = useRef(new Map<string, ReturnType<typeof setTimeout>>())

  const syncHp = useMutation({
    mutationFn: async ({ id, currentHP }: { id: string; currentHP: number }) => {
      const res = await backendApi.patch<Character>(`/api/characters/${id}`, { currentHP })
      return res.data
    },
    onSuccess: (character) => {
      queryClient.setQueryData<Character[]>(characterKeys.all, (prev) =>
        prev?.map((existing) => (existing.id === character.id ? character : existing)),
      )
    },
  })

  return function adjustHp(id: string, currentHP: number) {
    queryClient.setQueryData<Character[]>(characterKeys.all, (prev) =>
      prev?.map((character) => (character.id === id ? { ...character, currentHP } : character)),
    )

    const pending = pendingSyncs.current.get(id)
    if (pending) clearTimeout(pending)

    pendingSyncs.current.set(
      id,
      setTimeout(() => {
        pendingSyncs.current.delete(id)
        syncHp.mutate({ id, currentHP })
      }, HP_SYNC_DELAY_MS),
    )
  }
}

export function useAddCharacterXp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, amount }: { id: string; amount: number }) => {
      const characters = queryClient.getQueryData<Character[]>(characterKeys.all)
      const currentXp = characters?.find((character) => character.id === id)?.xp ?? 0
      const res = await backendApi.patch<Character>(`/api/characters/${id}`, {
        xp: currentXp + amount,
      })
      return res.data
    },
    onSuccess: (character) => {
      queryClient.setQueryData<Character[]>(characterKeys.all, (prev) =>
        prev?.map((existing) => (existing.id === character.id ? character : existing)),
      )
    },
  })
}
