import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { AxiosError } from 'axios'
import type { Npc } from '../types/npc.types'
import type { NpcInput } from './useNpcs'
import { npcFormSchema, type NpcFormInput, type NpcFormOutput } from '../schemas/npc.schema'

interface ValidationErrorResponse {
  error: string
  details?: Record<string, string[]>
}

export function useNpcForm(initialNpc: Npc | null, onSave: (data: NpcInput) => Promise<void>) {
  const [saveError, setSaveError] = useState<string | null>(null)

  const defaultValues: NpcFormInput = initialNpc
    ? {
        name: initialNpc.name,
        faction: initialNpc.faction,
        status: initialNpc.status,
        description: initialNpc.description,
        notes: initialNpc.notes,
        imageUrl: initialNpc.imageUrl ?? '',
        imagePosition: initialNpc.imagePosition ?? 'top',
      }
    : {
        name: '',
        faction: 'Independente',
        status: 'vivo',
        description: '',
        notes: '',
        imageUrl: '',
        imagePosition: 'top',
      }

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<NpcFormInput, unknown, NpcFormOutput>({
    resolver: zodResolver(npcFormSchema),
    defaultValues,
  })

  const imageUrl = watch('imageUrl')
  const imagePosition = watch('imagePosition')

  const submit = handleSubmit(async (data: NpcFormOutput) => {
    setSaveError(null)
    try {
      await onSave({ ...data, imageUrl: data.imageUrl || undefined })
    } catch (err) {
      const details = (err as AxiosError<ValidationErrorResponse>).response?.data?.details
      if (details) {
        for (const [field, messages] of Object.entries(details)) {
          if (field in defaultValues) setError(field as keyof NpcFormInput, { message: messages[0] })
        }
      } else {
        setSaveError('Não foi possível salvar o NPC. Tente novamente.')
      }
    }
  })

  return {
    register,
    handleSubmit: submit,
    setValue,
    errors,
    imageUrl,
    imagePosition,
    isSubmitting,
    saveError,
  }
}
