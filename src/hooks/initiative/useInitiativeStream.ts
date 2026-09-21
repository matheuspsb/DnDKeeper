import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { initiativeKeys, saveLocal } from './useInitiative'
import { useLatestRef } from '../useLatestRef'

interface InitiativeStreamStatus {
  connected: boolean
  lastEventAt: number | null
}

export function useInitiativeStream(shouldSkip?: () => boolean): InitiativeStreamStatus {
  const queryClient = useQueryClient()
  const [connected, setConnected] = useState(false)
  const [lastEventAt, setLastEventAt] = useState<number | null>(null)
  const shouldSkipRef = useLatestRef(shouldSkip)

  useEffect(() => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/initiative/stream`
    const source = new EventSource(url, { withCredentials: true })

    source.addEventListener('open', () => setConnected(true))

    source.addEventListener('state', (event) => {
      try {
        setConnected(true)
        setLastEventAt(Date.now())
        if (shouldSkipRef.current?.()) return
        const { state } = JSON.parse((event as MessageEvent).data)
        queryClient.setQueryData(initiativeKeys.all, state)
        saveLocal(state)
      } catch {}
    })

    source.addEventListener('error', () => {
      setConnected(false)
    })

    return () => source.close()
  }, [queryClient])

  return { connected, lastEventAt }
}
