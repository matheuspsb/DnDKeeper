import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Npc } from '../types/npc.types'
import { npcFormSchema, type NpcFormInput, type NpcFormOutput } from '../schemas/npc.schema'

export function useNpcForm(
  initialNpc: Npc | null,
  onSave: (data: Omit<Npc, 'id'>) => void,
) {
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
    formState: { errors },
  } = useForm<NpcFormInput, unknown, NpcFormOutput>({
    resolver: zodResolver(npcFormSchema),
    defaultValues,
  })

  const imageUrl = watch('imageUrl')
  const imagePosition = watch('imagePosition')

  return {
    register,
    handleSubmit: handleSubmit((data: NpcFormOutput) =>
      onSave({ ...data, imageUrl: data.imageUrl || undefined }),
    ),
    setValue,
    errors,
    imageUrl,
    imagePosition,
  }
}
