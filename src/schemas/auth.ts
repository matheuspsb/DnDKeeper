import { z } from 'zod'

export const dmLoginSchema = z.object({
  username: z.string().min(1, 'Usuário obrigatório'),
  password: z.string().min(1, 'Senha obrigatória'),
})

export const guestSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').max(32, 'Nome muito longo'),
})

export type DmLoginInput = z.infer<typeof dmLoginSchema>
export type GuestInput = z.infer<typeof guestSchema>
