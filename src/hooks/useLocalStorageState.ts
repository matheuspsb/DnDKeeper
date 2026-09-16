import { useCallback, useState } from 'react'

interface Options<T> {
  serialize?: (value: T) => string
  deserialize?: (raw: string) => T
}

type SetLocalStorageState<T> = (next: T | ((prev: T) => T)) => void

export function useLocalStorageState<T>(
  key: string,
  initialValue: T,
  options: Options<T> = {},
): [T, SetLocalStorageState<T>] {
  const serialize = options.serialize ?? JSON.stringify
  const deserialize = options.deserialize ?? JSON.parse

  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? deserialize(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  const set = useCallback<SetLocalStorageState<T>>(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (prev: T) => T)(prev) : next
        try {
          localStorage.setItem(key, serialize(resolved))
        } catch {
          /* modo privado / cota — segue sem persistir */
        }
        return resolved
      })
    },
    [key, serialize],
  )

  return [value, set]
}
