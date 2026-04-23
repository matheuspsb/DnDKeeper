import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Npc } from '../../types/npc.types'
import NpcImagePositionPicker from './NpcImagePositionPicker'
import { npcFormSchema, type NpcFormInput, type NpcFormOutput } from '../../schemas/npc.schema'
import { FACTIONS } from '../../constants/npc.constants'
import Button from '../atoms/Button'
import NpcModalHeader from './NpcModalHeader'
import NpcImagePicker from './NpcImagePicker'
import SelectArrow from '../atoms/SelectArrow'

interface NpcModalProps {
  initialNpc: Npc | null
  onSave: (data: Omit<Npc, 'id'>) => void
  onClose: () => void
}

const inputClass = `
  w-full bg-black-500 border border-black-100 rounded-lg px-2 py-2
  text-white-100 text-sm placeholder:text-white-300/30
  focus:outline-none focus:border-red-100 transition-colors
`
const inputErrorClass = `
  w-full bg-black-500 border border-red-200 rounded-lg px-3 py-2
  text-white-100 text-sm placeholder:text-white-300/30
  focus:outline-none focus:border-red-100 transition-colors
`
const selectClass = `${inputClass} appearance-none`
const labelClass = 'block text-white-300 text-xs font-medium mb-1.5'
const errorClass = 'text-red-100 text-xs mt-1'

function NpcModal({ initialNpc, onSave, onClose }: NpcModalProps) {
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

  function onSubmit(data: NpcFormOutput) {
    onSave({ ...data, imageUrl: data.imageUrl || undefined })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-black-400 border border-black-100 rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl">
        <NpcModalHeader isEditing={!!initialNpc} onClose={onClose} />

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 flex flex-col gap-4">
          <NpcImagePicker
            imageUrl={imageUrl}
            onSelect={(url) => setValue('imageUrl', url, { shouldValidate: true })}
            registration={register('imageUrl')}
          />

          {imageUrl && (
            <NpcImagePositionPicker
              value={imagePosition ?? 'top'}
              onChange={(pos) => setValue('imagePosition', pos)}
            />
          )}

          <div>
            <label className={labelClass}>Nome *</label>
            <input
              {...register('name')}
              className={errors.name ? inputErrorClass : inputClass}
              placeholder="Silvara Moonshadow"
            />
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Facção</label>
              <div className="relative">
                <select {...register('faction')} className={selectClass}>
                  {FACTIONS.map((faction) => (
                    <option key={faction} value={faction}>
                      {faction}
                    </option>
                  ))}
                </select>
                <SelectArrow />
              </div>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <div className="relative">
                <select {...register('status')} className={selectClass}>
                  <option value="vivo">Vivo</option>
                  <option value="morto">Morto</option>
                  <option value="desaparecido">Desaparecido</option>
                  <option value="desconhecido">Desconhecido</option>
                </select>
                <SelectArrow />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Descrição</label>
            <textarea
              {...register('description')}
              className={`${inputClass} resize-none h-20`}
              placeholder="Aparência, personalidade, papel na campanha..."
            />
          </div>

          <div>
            <label className={labelClass}>O que sabe / O que possui</label>
            <textarea
              {...register('notes')}
              className={`${inputClass} resize-none h-20`}
              placeholder="Informações que este NPC carrega..."
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" onClick={onClose} className="w-auto! flex-1">
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="w-auto! flex-1">
              {initialNpc ? 'Salvar Alterações' : 'Adicionar NPC'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NpcModal
