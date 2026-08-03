import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { AxiosError } from 'axios'
import type { Character } from '../types/character'
import type { CharacterInput } from './useCharacters'
import {
  characterFormSchema,
  type CharacterFormInput,
  type CharacterFormOutput,
} from '../schemas/character'

interface ValidationErrorResponse {
  error: string
  details?: Record<string, string[]>
}

export function useCharacterForm(
  initialCharacter: Character | null,
  onSave: (data: CharacterInput) => Promise<void>,
) {
  const [saveError, setSaveError] = useState<string | null>(null)

  const defaultValues: CharacterFormInput = initialCharacter
    ? {
        imageUrl: initialCharacter.imageUrl ?? '',
        name: initialCharacter.name,
        playerName: initialCharacter.playerName,
        characterClass: initialCharacter.characterClass,
        race: initialCharacter.race,
        maxHP: initialCharacter.maxHP,
        currentHP: initialCharacter.currentHP,
        xp: initialCharacter.xp,
        notes: initialCharacter.notes,
      }
    : {
        imageUrl: '',
        name: '',
        playerName: '',
        characterClass: '',
        race: '',
        maxHP: '' as unknown as number,
        currentHP: '',
        xp: 0,
        notes: '',
      }

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CharacterFormInput, unknown, CharacterFormOutput>({
    resolver: zodResolver(characterFormSchema),
    defaultValues,
  })

  const imageUrl = watch('imageUrl')

  const submit = handleSubmit(async (data: CharacterFormOutput) => {
    setSaveError(null)
    try {
      await onSave({ ...data, imageUrl: data.imageUrl || undefined })
    } catch (err) {
      const details = (err as AxiosError<ValidationErrorResponse>).response?.data?.details
      if (details) {
        for (const [field, messages] of Object.entries(details)) {
          if (field in defaultValues) setError(field as keyof CharacterFormInput, { message: messages[0] })
        }
      } else {
        setSaveError('Não foi possível salvar o personagem. Tente novamente.')
      }
    }
  })

  return {
    register,
    handleSubmit: submit,
    setValue,
    errors,
    imageUrl,
    isSubmitting,
    saveError,
  }
}
