import { useEffect, useRef, useState } from 'react'
import { useInitiative } from '../hooks/useInitiative'
import { useInitiativeStream } from '../hooks/useInitiativeStream'
import { resolveImageUrl } from '../constants/arts'
import { resolveHpBarColor } from '../utils/character'
import { getHealthBand } from '../constants/initiative'
import type { Combatant } from '../types/initiative'

const OFFLINE_GRACE_MS = 4000

function reducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    !!window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function hpPercent(c: Combatant): number | null {
  if (c.hp === null || c.maxHp === null || c.maxHp <= 0) return null
  return Math.max(0, Math.min(100, Math.round((c.hp / c.maxHp) * 100)))
}

function relativeTime(deltaMs: number): string {
  const s = Math.max(0, Math.round(deltaMs / 1000))
  if (s < 5) return 'agora'
  if (s < 60) return `há ${s}s`
  return `há ${Math.round(s / 60)} min`
}

function LiveStatus({
  connected,
  lastEventAt,
  now,
}: {
  connected: boolean
  lastEventAt: number | null
  now: number
}) {
  return (
    <div className="flex flex-col items-end gap-0.5">
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
      {lastEventAt !== null && (
        <span className="text-[11px] text-white-300/40">
          atualizado {relativeTime(now - lastEventAt)}
        </span>
      )}
    </div>
  )
}

interface CombatantViewProps {
  combatant: Combatant
  hideHp: boolean
}

function OrderCard({
  combatant,
  status,
  hideHp,
}: CombatantViewProps & { status: 'current' | 'done' | 'pending' }) {
  const pct = hpPercent(combatant)
  const isCurrent = status === 'current'
  const band = pct !== null && hideHp ? getHealthBand(pct) : null

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
          <span className="flex h-full w-full items-center justify-center text-lg text-white-300/30">
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

        {band ? (
          <div className="mt-1.5 flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wide" style={{ color: band.color }}>
              {band.label}
            </span>
            <span className="text-white-300/40">Monstro</span>
          </div>
        ) : pct !== null ? (
          <>
            <div className="mt-1.5 flex items-center justify-between text-xs">
              <span
                className="tabular-nums font-semibold"
                style={{ color: resolveHpBarColor(pct) }}
              >
                {combatant.hp} / {combatant.maxHp}
              </span>
              <span className="text-white-300/40">{combatant.isPlayer ? 'PC' : 'Monstro'}</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-black-500">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: resolveHpBarColor(pct) }}
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

function CurrentHero({ combatant, hideHp }: CombatantViewProps) {
  const pct = hpPercent(combatant)
  const band = pct !== null && hideHp ? getHealthBand(pct) : null
  const barColor = pct === null ? '#C0C0C0' : resolveHpBarColor(pct)

  return (
    <div className="mt-6 rounded-2xl p-0.5 current-turn-border">
      <div className="relative overflow-hidden rounded-[14px] bg-black-300">
        {combatant.imageUrl && (
          <div className="absolute inset-0">
            <img
              src={resolveImageUrl(combatant.imageUrl)}
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
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">{combatant.name}</h1>
            <p className="mt-1 text-sm uppercase tracking-wide text-white-300/50">
              {combatant.isPlayer ? 'Personagem' : 'Monstro'} · iniciativa {combatant.initiative}
            </p>
          </div>

          {(combatant.conditions ?? []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {combatant.conditions!.map((cond) => (
                <span
                  key={cond}
                  className="rounded-md bg-amber-500/20 px-2.5 py-1 text-sm font-semibold text-amber-400"
                >
                  {cond}
                </span>
              ))}
            </div>
          )}

          {band ? (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium uppercase tracking-wide text-white-300/50">
                Condição
              </span>
              <span
                className="text-3xl font-bold uppercase tracking-wide md:text-4xl"
                style={{ color: band.color }}
              >
                {band.label}
              </span>
            </div>
          ) : (
            pct !== null && (
              <div className="flex flex-col gap-2">
                <div className="flex items-end justify-between">
                  <span className="text-sm font-medium uppercase tracking-wide text-white-300/50">
                    Pontos de vida
                  </span>
                  <span
                    className="tabular-nums text-3xl font-bold md:text-4xl"
                    style={{ color: barColor }}
                  >
                    {combatant.hp}{' '}
                    <span className="text-xl text-white-300/40">/ {combatant.maxHp}</span>
                  </span>
                </div>
                <div className="h-4 w-full overflow-hidden rounded-full bg-black-500">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: barColor }}
                  />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

function Table() {
  const { connected, lastEventAt } = useInitiativeStream()
  const { combatants, currentIndex, round, hideMonsterHp } = useInitiative()

  const current = combatants[currentIndex] ?? null

  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const [showOffline, setShowOffline] = useState(false)
  useEffect(() => {
    if (connected) {
      setShowOffline(false)
      return
    }
    const id = setTimeout(() => setShowOffline(true), OFFLINE_GRACE_MS)
    return () => clearTimeout(id)
  }, [connected])

  const currentRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    currentRef.current?.scrollIntoView({
      behavior: reducedMotion() ? 'auto' : 'smooth',
      block: 'center',
    })
  }, [currentIndex])

  const prevRound = useRef(round)
  const [roundFlash, setRoundFlash] = useState(false)
  useEffect(() => {
    if (prevRound.current === round) return
    prevRound.current = round
    if (combatants.length === 0 || reducedMotion()) return
    setRoundFlash(true)
    const id = setTimeout(() => setRoundFlash(false), 1600)
    return () => clearTimeout(id)
  }, [round, combatants.length])

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-black-500 px-6 text-white-100 md:px-10">
      {showOffline && (
        <div className="mb-4 rounded-lg border border-yellow/40 bg-yellow/10 px-4 py-2 text-center text-sm font-medium text-yellow">
          Sem conexão com o mestre — tentando reconectar…
        </div>
      )}

      <header className="flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-4">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-white-300/40">
            Rodada
          </span>
          <span
            key={round}
            className="round-pop inline-block tabular-nums text-5xl font-bold leading-none md:text-6xl"
          >
            {round}
          </span>
        </div>
        <LiveStatus connected={connected} lastEventAt={lastEventAt} now={now} />
      </header>

      {combatants.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
          <p className="text-2xl font-bold text-white-300">Combate não iniciado</p>
          <p className="text-sm text-white-300/50">Aguardando o mestre montar a ordem.</p>
        </div>
      ) : (
        <>
          {current && (
            <CurrentHero combatant={current} hideHp={hideMonsterHp && !current.isPlayer} />
          )}

          <h2 className="mt-8 mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-white-300/40">
            Ordem de iniciativa
          </h2>
          <div className="grid grid-cols-1 gap-3 pb-4 sm:grid-cols-2 lg:grid-cols-3">
            {combatants.map((combatant, i) => (
              <div key={combatant.id} ref={i === currentIndex ? currentRef : undefined}>
                <OrderCard
                  combatant={combatant}
                  status={i === currentIndex ? 'current' : i < currentIndex ? 'done' : 'pending'}
                  hideHp={hideMonsterHp && !combatant.isPlayer}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {roundFlash && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
          <span className="round-flash text-6xl font-bold uppercase tracking-[0.2em] text-red-100 md:text-8xl">
            Rodada {round}
          </span>
        </div>
      )}
    </div>
  )
}

export default Table
