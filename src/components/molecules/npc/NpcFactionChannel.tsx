import type { ReactNode } from 'react'
import type { Faction } from '../../../types/npc.types'
import { FACTION_COLOR, FACTION_IMAGE } from '../../../constants/npc.constants'

interface NpcFactionChannelProps {
  faction: Faction
  count: number
  children: ReactNode
}

function NpcFactionChannel({ faction, count, children }: NpcFactionChannelProps) {
  const color = FACTION_COLOR[faction]
  const sigil = FACTION_IMAGE[faction]

  return (
    <section className="relative">
      <div className="absolute top-0 bottom-0 left-0 w-1" style={{ background: color }} />

      {sigil && (
        <img
          src={sigil}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -left-10 top-10 h-44 w-44 object-contain opacity-[0.07] grayscale select-none"
        />
      )}

      <header className="sticky top-0 z-10 flex items-baseline gap-3 bg-ink-950/95 py-2.5 pr-1 pl-5 backdrop-blur-sm">
        <span
          aria-hidden
          className="translate-y-px h-2.5 w-2.5 shrink-0"
          style={{ background: color }}
        />
        <h3 className="font-display text-base font-semibold tracking-[0.16em] text-bone-100 uppercase">
          {faction}
        </h3>
        <span className="flex-1 -translate-y-1 border-b border-dotted border-bone-400/30" />
        <span className="font-mono text-[13px] text-bone-300">{count}</span>
      </header>

      <div className="pl-5">{children}</div>
    </section>
  )
}

export default NpcFactionChannel
