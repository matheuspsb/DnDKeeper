import { useState, useCallback } from 'react'
import type { Character } from '../types/character'

const STORAGE_KEY = 'dndkeeper_characters'

function load(): Character[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Character[]) : []
  } catch {
    return []
  }
}

function persist(characters: Character[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(characters))
}

export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>(load)

  const mutate = useCallback((updater: (prev: Character[]) => Character[]) => {
    setCharacters((prev) => {
      const next = updater(prev)
      persist(next)
      return next
    })
  }, [])

  const addCharacter = useCallback(
    (data: Omit<Character, 'id'>) => {
      mutate((prev) => [...prev, { ...data, id: crypto.randomUUID() }])
    },
    [mutate],
  )

  const updateCharacter = useCallback(
    (id: string, data: Partial<Omit<Character, 'id'>>) => {
      mutate((prev) =>
        prev.map((character) => (character.id === id ? { ...character, ...data } : character)),
      )
    },
    [mutate],
  )

  const deleteCharacter = useCallback(
    (id: string) => {
      mutate((prev) => prev.filter((character) => character.id !== id))
    },
    [mutate],
  )

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(characters, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'personagens-dnd.json'
    link.click()
    URL.revokeObjectURL(url)
  }, [characters])

  const importJSON = useCallback(
    (file: File) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string)
          if (Array.isArray(parsed)) {
            mutate(() => parsed as Character[])
          }
        } catch {
          // JSON inválido — ignora silenciosamente
        }
      }
      reader.readAsText(file)
    },
    [mutate],
  )

  const addXp = useCallback(
    (id: string, amount: number) => {
      mutate((prev) =>
        prev.map((character) =>
          character.id === id ? { ...character, xp: character.xp + amount } : character,
        ),
      )
    },
    [mutate],
  )

  return {
    characters,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    exportJSON,
    importJSON,
    addXp,
  }
}
