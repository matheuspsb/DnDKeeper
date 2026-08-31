import { useInitiative } from '../hooks/useInitiative'
import { useInitiativeStream } from '../hooks/useInitiativeStream'
import { resolveImageUrl } from '../constants/arts'
import { resolveHpBarColor } from '../utils/character'
import type { Combatant } from '../types/initiative'

function hpPercent(c: Combatant): number | null {
  if (c.hp === null || c.maxHp === null || c.maxHp <= 0) return null
  return Math.max(0, Math.min(100, Math.round((c.hp / c.maxHp) * 100)))
}

function LiveDot({ connected }: { connected: boolean }) {
  return (
    <span className="flex items-center gap-2 text-sm font-medium tracking-wide">
      <span
        className={`inline-block h-2.5 w-2.5 rounded-full ${
          connected ? 'animate-pulse bg-green-400' : 'bg-yellow'
        }`}
      />
      <span className={connected ? 'text-green-400' : 'text-yellow'}>
        {connected ? 'ao vivo' : 'reconectando…'}
      </span>
    </span>
  )
}

function OrderCard({ combatant, status }: { combatant: Combatant; status: 'current' | 'done' | 'pending' }) {
  const pct = hpPercent(combatant)
  const color = pct === null ? '#C0C0C0' : resolveHpBarColor(pct)
  const isCurrent = status === 'current'

  return (
    <div
      className={`relative flex items-center gap-3 rounded-xl border p-3 transition-opacity ${
        isCurrent
          ? 'border-red-100 bg-black-300'
          : status === 'done'
            ? 'border-black-100 bg-black-400 opacity-40'
            : 'border-black-100 bg-black-400'
      }`}
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-black-500">
        {combatant.imageUrl ? (
          <img
            src={resolveImageUrl(combatant.imageUrl)}
            alt=""
            aria-hidden
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-white-300/30 text-lg">
            {combatant.name.charAt(0)}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-base font-semibold text-white-100">{combatant.name}</span>
          <span className="shrink-0 tabular-nums text-xs text-white-300/50">
            init {combatant.initiative}
          </span>
        </div>

        {pct !== null ? (
          <>
            <div className="mt-1.5 flex items-center justify-between text-xs">
              <span className="tabular-nums font-semibold" style={{ color }}>
                {combatant.hp} / {combatant.maxHp}
              </span>
              <span className="text-white-300/40">{combatant.isPlayer ? 'PC' : 'Monstro'}</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-black-500">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: color }}
              />
            </div>
          </>
        ) : (
          <span className="mt-1 block text-xs text-white-300/40">
            {combatant.isPlayer ? 'PC' : 'Monstro'}
          </span>
        )}

        {(combatant.conditions ?? []).length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {combatant.conditions!.map((cond) => (
              <span
                key={cond}
                className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold leading-tight text-amber-400"
              >
                {cond}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Table() {
  const { connected } = useInitiativeStream()
  const { combatants, currentIndex, round } = useInitiative()

  const current = combatants[currentIndex] ?? null
  const currentPct = current ? hpPercent(current) : null
  const currentColor = currentPct === null ? '#C0C0C0' : resolveHpBarColor(currentPct)

  return (
    <div className="flex min-h-screen w-full flex-col bg-black-500 px-6 py-6 text-white-100 md:px-10 md:py-8">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-4">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-white-300/40">
            Rodada
          </span>
          <span className="tabular-nums text-5xl font-bold leading-none md:text-6xl">{round}</span>
        </div>
        <LiveDot connected={connected} />
      </header>

      {combatants.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
          <p className="text-2xl font-bold text-white-300">Combate não iniciado</p>
          <p className="text-sm text-white-300/50">Aguardando o mestre montar a ordem.</p>
        </div>
      ) : (
        <>
          {current && (
            <div className="mt-6 rounded-2xl p-0.5 current-turn-border">
              <div className="relative overflow-hidden rounded-[14px] bg-black-300">
                {current.imageUrl && (
                  <div className="absolute inset-0">
                    <img
                      src={resolveImageUrl(current.imageUrl)}
                      alt=""
                      aria-hidden
                      className="h-full w-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-black-500/60" />
                  </div>
                )}

                <div className="relative z-10 flex flex-col gap-5 p-6 md:p-9">
                  <span className="text-xs font-semibold uppercase tracking-[0.35em] text-red-100">
                    Turno atual
                  </span>

                  <div>
                    <h1 className="text-4xl font-bold leading-tight md:text-6xl">{current.name}</h1>
                    <p className="mt-1 text-sm uppercase tracking-wide text-white-300/50">
                      {current.isPlayer ? 'Personagem' : 'Monstro'} · iniciativa {current.initiative}
                    </p>
                  </div>

                  {(current.conditions ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {current.conditions!.map((cond) => (
                        <span
                          key={cond}
                          className="rounded-md bg-amber-500/20 px-2.5 py-1 text-sm font-semibold text-amber-400"
                        >
                          {cond}
                        </span>
                      ))}
                    </div>
                  )}

                  {currentPct !== null && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-end justify-between">
                        <span className="text-sm font-medium uppercase tracking-wide text-white-300/50">
                          Pontos de vida
                        </span>
                        <span
                          className="tabular-nums text-3xl font-bold md:text-4xl"
                          style={{ color: currentColor }}
                        >
                          {current.hp} <span className="text-xl text-white-300/40">/ {current.maxHp}</span>
                        </span>
                      </div>
                      <div className="h-4 w-full overflow-hidden rounded-full bg-black-500">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${currentPct}%`, backgroundColor: currentColor }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <h2 className="mt-8 mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-white-300/40">
            Ordem de iniciativa
          </h2>
          <div className="grid grid-cols-1 gap-3 pb-4 sm:grid-cols-2 lg:grid-cols-3">
            {combatants.map((combatant, i) => (
              <OrderCard
                key={combatant.id}
                combatant={combatant}
                status={i === currentIndex ? 'current' : i < currentIndex ? 'done' : 'pending'}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Table
