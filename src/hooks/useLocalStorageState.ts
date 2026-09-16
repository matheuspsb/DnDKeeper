import { useCallback, useRef, useSyncExternalStore } from 'react'

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

  const initialValueRef = useRef(initialValue)

  const initializedRef = useRef(false)
  const valueRef = useRef<T>(initialValueRef.current)
  if (!initializedRef.current) {
    initializedRef.current = true
    try {
      const raw = localStorage.getItem(key)
      valueRef.current = raw !== null ? deserialize(raw) : initialValueRef.current
    } catch {
      valueRef.current = initialValueRef.current
    }
  }

  const onStoreChangeRef = useRef<(() => void) | null>(null)

  const getSnapshot = useCallback(() => valueRef.current, [])

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      onStoreChangeRef.current = onStoreChange
      function handleStorage(event: StorageEvent) {
        if (event.key !== key) return
        if (event.newValue === null) {
          valueRef.current = initialValueRef.current
          onStoreChange()
          return
        }
        try {
          valueRef.current = deserialize(event.newValue)
          onStoreChange()
        } catch {
          /* valor inválido vindo de outra aba — ignora, mantém o atual */
        }
      }
      window.addEventListener('storage', handleStorage)
      return () => {
        window.removeEventListener('storage', handleStorage)
        onStoreChangeRef.current = null
      }
    },
    [key, deserialize],
  )

  const value = useSyncExternalStore(subscribe, getSnapshot)

  const set = useCallback<SetLocalStorageState<T>>(
    (next) => {
      const resolved =
        typeof next === 'function' ? (next as (prev: T) => T)(valueRef.current) : next
      valueRef.current = resolved
      try {
        localStorage.setItem(key, serialize(resolved))
      } catch {
        /* modo privado / cota — segue sem persistir */
      }
      onStoreChangeRef.current?.()
    },
    [key, serialize],
  )

  return [value, set]
}
