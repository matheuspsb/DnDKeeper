import { z } from 'zod'

export const letterFormSchema = z.object({
  title: z.string().trim().min(1, 'Título é obrigatório'),
  content: z.string().trim().min(1, 'Conteúdo é obrigatório'),
  recipient: z.string().trim(),
  foundAt: z.string().trim().min(1, 'Data de encontro é obrigatória'),
  shown: z.boolean(),
})

export type LetterFormInput = z.input<typeof letterFormSchema>
export type LetterFormOutput = z.output<typeof letterFormSchema>
