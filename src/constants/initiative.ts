export const HP_DELTAS = [-10, -5, -1, 1, 5, 10] as const

export function getHealthBand(percentage: number): { label: string; color: string } {
  if (percentage >= 100) return { label: 'Ileso', color: '#22c55e' }
  if (percentage >= 65) return { label: 'Ferido', color: '#a3e635' }
  if (percentage >= 35) return { label: 'Machucado', color: '#ECC83B' }
  if (percentage >= 1) return { label: 'Cambaleante', color: '#D72334' }
  return { label: 'Caído', color: '#9ca3af' }
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
