export const HP_DELTAS = [-10, -5, -1, 1, 5, 10] as const

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
