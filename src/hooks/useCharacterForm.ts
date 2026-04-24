import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Character } from '../types/character'
import {
  characterFormSchema,
  type CharacterFormInput,
  type CharacterFormOutput,
} from '../schemas/character'

export function useCharacterForm(
  initialCharacter: Character | null,
  onSave: (data: Omit<Character, 'id'>) => void,
) {
  const defaultValues: CharacterFormInput = initialCharacter
    ? {
        imageUrl: initialCharacter.imageUrl,
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
    formState: { errors },
  } = useForm<CharacterFormInput, unknown, CharacterFormOutput>({
    resolver: zodResolver(characterFormSchema),
    defaultValues,
  })

  const imageUrl = watch('imageUrl')

  return {
    register,
    handleSubmit: handleSubmit((data: CharacterFormOutput) => onSave(data)),
    setValue,
    errors,
    imageUrl,
  }
}
