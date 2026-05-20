import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Letter } from '../types/letter'
import {
  letterFormSchema,
  type LetterFormInput,
  type LetterFormOutput,
} from '../schemas/letter.schema'

export function useLetterForm(
  initialLetter: Letter | null,
  onSave: (data: Omit<Letter, 'id'>) => void,
) {
  const defaultValues: LetterFormInput = initialLetter
    ? {
        title: initialLetter.title,
        content: initialLetter.content,
        recipient: initialLetter.recipient ?? '',
        writtenAt: initialLetter.writtenAt ?? '',
        foundAt: initialLetter.foundAt,
      }
    : {
        title: '',
        content: '',
        recipient: '',
        writtenAt: '',
        foundAt: '',
      }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LetterFormInput, unknown, LetterFormOutput>({
    resolver: zodResolver(letterFormSchema),
    defaultValues,
  })

  return {
    register,
    handleSubmit: handleSubmit((data: LetterFormOutput) =>
      onSave({
        ...data,
        recipient: data.recipient || undefined,
        writtenAt: data.writtenAt || undefined,
      }),
    ),
    errors,
  }
}
