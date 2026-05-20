import { useState, useCallback } from 'react'
import type { Letter } from '../types/letter'
import { LETTER_SEED } from '../constants/letterSeed'

const STORAGE_KEY = 'dndkeeper_letters'

function load(): Letter[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Letter[]
    persist(LETTER_SEED)
    return LETTER_SEED
  } catch {
    return LETTER_SEED
  }
}

function persist(letters: Letter[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(letters))
}

export function useLetters() {
  const [letters, setLetters] = useState<Letter[]>(load)

  const mutate = useCallback((updater: (prev: Letter[]) => Letter[]) => {
    setLetters((prev) => {
      const next = updater(prev)
      persist(next)
      return next
    })
  }, [])

  const addLetter = useCallback(
    (data: Omit<Letter, 'id'>) => {
      mutate((prev) => [...prev, { ...data, id: crypto.randomUUID() }])
    },
    [mutate],
  )

  const updateLetter = useCallback(
    (id: string, data: Partial<Omit<Letter, 'id'>>) => {
      mutate((prev) => prev.map((l) => (l.id === id ? { ...l, ...data } : l)))
    },
    [mutate],
  )

  const deleteLetter = useCallback(
    (id: string) => {
      mutate((prev) => prev.filter((l) => l.id !== id))
    },
    [mutate],
  )

  const toggleShown = useCallback(
    (id: string) => {
      mutate((prev) => prev.map((l) => (l.id === id ? { ...l, shown: !l.shown } : l)))
    },
    [mutate],
  )

  const resetToSeed = useCallback(() => {
    persist(LETTER_SEED)
    setLetters(LETTER_SEED)
  }, [])

  return { letters, addLetter, updateLetter, deleteLetter, toggleShown, resetToSeed }
}
