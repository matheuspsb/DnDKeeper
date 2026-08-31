import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { initiativeKeys, saveLocal } from './useInitiative'

export function useInitiativeStream(): { connected: boolean } {
  const queryClient = useQueryClient()
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/initiative/stream`
    const source = new EventSource(url, { withCredentials: true })

    source.addEventListener('open', () => setConnected(true))

    source.addEventListener('state', (event) => {
      try {
        const { state } = JSON.parse((event as MessageEvent).data)
        queryClient.setQueryData(initiativeKeys.all, state)
        saveLocal(state)
        setConnected(true)
      } catch {}
    })

    source.addEventListener('error', () => {
      setConnected(false)
      queryClient.invalidateQueries({ queryKey: initiativeKeys.all })
    })

    return () => source.close()
  }, [queryClient])

  return { connected }
}
