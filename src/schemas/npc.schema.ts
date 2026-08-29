import { z } from 'zod'
import { FACTIONS } from '../constants/npc.constants'
import { resolveDriveUrl } from '../constants/arts'
import type { Faction } from '../types/npc.types'

const factionEnum = z.enum(FACTIONS as [Faction, ...Faction[]])
const statusEnum = z.enum(['vivo', 'morto', 'desaparecido', 'desconhecido'])

export const npcFormSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório'),
  faction: factionEnum,
  status: statusEnum,
  description: z.string().trim(),
  notes: z.string().trim(),
  location: z.string().trim(),
  currentActivity: z.string().trim(),
  imageUrl: z.string().trim().transform(resolveDriveUrl),
  imagePosition: z.enum(['top', 'center', 'bottom']).optional(),
})

export type NpcFormInput = z.input<typeof npcFormSchema>
export type NpcFormOutput = z.output<typeof npcFormSchema>
