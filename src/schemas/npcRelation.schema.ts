import { z } from 'zod'

const relationTypeEnum = z.enum(['familiar', 'aliado', 'inimigo', 'neutro', 'subordinado'])

export const npcRelationFormSchema = z.object({
  sourceId: z.string().min(1, 'Selecione o NPC de origem'),
  targetId: z.string().min(1, 'Selecione o NPC de destino'),
  type: relationTypeEnum,
  label: z.string().trim(),
})

export type NpcRelationFormInput = z.input<typeof npcRelationFormSchema>
export type NpcRelationFormOutput = z.output<typeof npcRelationFormSchema>
