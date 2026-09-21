import { useCallback, useState } from 'react'

export function useTreeExpansion() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [mountedIds, setMountedIds] = useState<Set<string>>(new Set())

  const toggleExpanded = useCallback(
    (nodeId: string, siblingIds: string[] = [nodeId]) => {
      if (!expandedIds.has(nodeId)) {
        setMountedIds((prev) => (prev.has(nodeId) ? prev : new Set(prev).add(nodeId)))
      }
      setExpandedIds((prev) => {
        const isExpanding = !prev.has(nodeId)
        const next = new Set(prev)
        if (isExpanding) {
          for (const siblingId of siblingIds) next.delete(siblingId)
          next.add(nodeId)
        } else {
          next.delete(nodeId)
        }
        return next
      })
    },
    [expandedIds],
  )

  return { expandedIds, mountedIds, toggleExpanded }
}
