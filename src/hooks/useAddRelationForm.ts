import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  npcRelationFormSchema,
  type NpcRelationFormInput,
  type NpcRelationFormOutput,
} from '../schemas/npcRelation.schema'

export function useAddRelationForm(
  preselectedSourceId: string | undefined,
  onSave: (data: NpcRelationFormOutput) => void,
) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NpcRelationFormInput, unknown, NpcRelationFormOutput>({
    resolver: zodResolver(npcRelationFormSchema),
    defaultValues: {
      sourceId: preselectedSourceId ?? '',
      targetId: '',
      type: 'neutro',
      label: '',
    },
  })

  return {
    register,
    handleSubmit: handleSubmit(onSave),
    errors,
  }
}
