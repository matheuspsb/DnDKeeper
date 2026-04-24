import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Combatant } from '../types/initiative'
import {
  combatantFormSchema,
  type CombatantFormInput,
  type CombatantFormOutput,
} from '../schemas/initiative'

export function useInitiativeAddForm(onAdd: (data: Omit<Combatant, 'id'>) => void) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CombatantFormInput, unknown, CombatantFormOutput>({
    resolver: zodResolver(combatantFormSchema),
    defaultValues: { name: '', initiative: '' as unknown as number, maxHp: '', isPlayer: false },
  })

  const isPlayer = watch('isPlayer')

  return {
    register,
    handleSubmit: handleSubmit((data: CombatantFormOutput) => {
      onAdd(data)
      reset()
    }),
    setValue,
    errors,
    isPlayer,
  }
}
