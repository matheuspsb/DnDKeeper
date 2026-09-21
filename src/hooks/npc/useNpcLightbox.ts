import { useMemo, useState } from 'react'
import type { Npc } from '../../types/npc.types'

export function useNpcLightbox(npcs: Npc[]) {
  const [activeNpc, setActiveNpc] = useState<Npc | null>(null)

  const npcsWithImage = useMemo(() => npcs.filter((npc) => npc.imageUrl), [npcs])
  const activeIndex = activeNpc ? npcsWithImage.findIndex((npc) => npc.id === activeNpc.id) : -1

  return {
    activeNpc,
    open: setActiveNpc,
    close: () => setActiveNpc(null),
    hasPrev: activeIndex > 0,
    hasNext: activeIndex >= 0 && activeIndex < npcsWithImage.length - 1,
    goPrev: () => setActiveNpc(npcsWithImage[activeIndex - 1]),
    goNext: () => setActiveNpc(npcsWithImage[activeIndex + 1]),
  }
}
