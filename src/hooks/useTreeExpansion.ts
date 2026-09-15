import { useCallback, useState } from 'react'

export function useTreeExpansion() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [mountedIds, setMountedIds] = useState<Set<string>>(new Set())

  const toggleExpanded = useCallback(
    (nodeId: string) => {
      if (!expandedIds.has(nodeId)) {
        setMountedIds((prev) => (prev.has(nodeId) ? prev : new Set(prev).add(nodeId)))
      }
      setExpandedIds((prev) => {
        const next = new Set(prev)
        if (next.has(nodeId)) next.delete(nodeId)
        else next.add(nodeId)
        return next
      })
    },
    [expandedIds],
  )

  return { expandedIds, mountedIds, toggleExpanded }
}
