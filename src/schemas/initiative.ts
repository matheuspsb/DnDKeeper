import { z } from 'zod'

const intField = (label: string) =>
  z
    .union([z.string(), z.number()])
    .transform((val) => (val === '' ? NaN : Number(val)))
    .pipe(z.number({ error: `Informe ${label}` }).int())

export const combatantFormSchema = z
  .object({
    name: z.string().trim().min(1, 'Nome é obrigatório'),
    initiative: intField('a iniciativa'),
    maxHp: z
      .union([z.string(), z.number()])
      .transform((val) => (val === '' ? null : Number(val)))
      .pipe(z.number().int().min(1).nullable()),
    isPlayer: z.boolean(),
  })
  .transform(({ maxHp, ...rest }) => ({
    ...rest,
    maxHp,
    hp: maxHp,
  }))

export type CombatantFormInput = z.input<typeof combatantFormSchema>
export type CombatantFormOutput = z.output<typeof combatantFormSchema>
