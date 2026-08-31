export const HP_DELTAS = [-10, -5, -1, 1, 5, 10] as const

export interface HealthBand {
  minPercent: number
  label: string
  color: string
}

export const HEALTH_BANDS: readonly HealthBand[] = [
  { minPercent: 100, label: 'Ileso', color: '#22c55e' },
  { minPercent: 65, label: 'Ferido', color: '#a3e635' },
  { minPercent: 35, label: 'Machucado', color: '#ecc83b' },
  { minPercent: 1, label: 'Cambaleante', color: '#d72334' },
  { minPercent: 0, label: 'Caído', color: '#9ca3af' },
]

export function getHealthBand(hpPercentage: number): HealthBand {
  const pct = Math.max(0, Math.min(100, hpPercentage))
  return (
    HEALTH_BANDS.find((band) => pct >= band.minPercent) ?? HEALTH_BANDS[HEALTH_BANDS.length - 1]
  )
}

export const CONDITIONS = [
  'Amedrontado',
  'Agarrado',
  'Atordoado',
  'Cego',
  'Caído',
  'Encantado',
  'Ensurdecido',
  'Envenenado',
  'Exaustão',
  'Imobilizado',
  'Incapacitado',
  'Inconsciente',
  'Invisível',
  'Paralisado',
  'Petrificado',
] as const

export type Condition = (typeof CONDITIONS)[number]
