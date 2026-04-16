import { z } from 'zod'

const intField = (min: number, message: string) =>
  z
    .union([z.string(), z.number()])
    .transform(val => (val === '' ? NaN : Number(val)))
    .pipe(
      z
        .number({ error: message })
        .int()
        .min(min, `Mínimo ${min}`),
    )

export const characterFormSchema = z
  .object({
    imageUrl: z.string().trim(),
    name: z.string().trim().min(1, 'Nome é obrigatório'),
    playerName: z.string().trim(),
    characterClass: z.string().trim(),
    race: z.string().trim(),
    maxHP: intField(1, 'Informe um valor'),
    currentHP: z
      .union([z.string(), z.number()])
      .transform(val => (val === '' ? null : Number(val)))
      .pipe(z.number().int().min(0, 'Mínimo 0').nullable()),
    xp: intField(0, 'Informe um valor'),
    notes: z.string().trim(),
  })
  .transform(({ currentHP, maxHP, ...rest }) => ({
    ...rest,
    maxHP: Math.max(1, maxHP),
    currentHP: currentHP !== null ? Math.min(currentHP, maxHP) : maxHP,
  }))

export type CharacterFormInput = z.input<typeof characterFormSchema>
export type CharacterFormOutput = z.output<typeof characterFormSchema>
