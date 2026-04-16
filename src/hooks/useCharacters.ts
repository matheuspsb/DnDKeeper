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
    setCharacters(prev => {
      const next = updater(prev)
      persist(next)
      return next
    })
  }, [])

  const addCharacter = useCallback(
    (data: Omit<Character, 'id'>) => {
      mutate(prev => [...prev, { ...data, id: crypto.randomUUID() }])
    },
    [mutate],
  )

  const updateCharacter = useCallback(
    (id: string, data: Partial<Omit<Character, 'id'>>) => {
      mutate(prev => prev.map(c => (c.id === id ? { ...c, ...data } : c)))
    },
    [mutate],
  )

  const deleteCharacter = useCallback(
    (id: string) => {
      mutate(prev => prev.filter(c => c.id !== id))
    },
    [mutate],
  )

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(characters, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'personagens-dnd.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [characters])

  const importJSON = useCallback(
    (file: File) => {
      const reader = new FileReader()
      reader.onload = e => {
        try {
          const parsed = JSON.parse(e.target?.result as string)
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

  return { characters, addCharacter, updateCharacter, deleteCharacter, exportJSON, importJSON }
}
