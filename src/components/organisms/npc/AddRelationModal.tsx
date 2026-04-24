import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Npc } from '../../../types/npc.types'
import {
  npcRelationFormSchema,
  type NpcRelationFormInput,
  type NpcRelationFormOutput,
} from '../../../schemas/npcRelation.schema'
import { RELATION_TYPE_LABEL } from '../../../constants/npc.constants'
import Button from '../../atoms/Button'
import XIcon from '../../atoms/icons/XIcon'

interface AddRelationModalProps {
  npcs: Npc[]
  preselectedSourceId?: string
  onSave: (data: NpcRelationFormOutput) => void
  onClose: () => void
}

const inputClass = `
  w-full bg-black-500 border border-black-100 rounded-lg px-3 py-2
  text-white-100 text-sm placeholder:text-white-300/30
  focus:outline-none focus:border-red-100 transition-colors
`
const inputErrorClass = `
  w-full bg-black-500 border border-red-200 rounded-lg px-3 py-2
  text-white-100 text-sm placeholder:text-white-300/30
  focus:outline-none focus:border-red-100 transition-colors
`
const labelClass = 'block text-white-300 text-xs font-medium mb-1.5'
const errorClass = 'text-red-100 text-xs mt-1'

function AddRelationModal({ npcs, preselectedSourceId, onSave, onClose }: AddRelationModalProps) {
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

  function onSubmit(data: NpcRelationFormOutput) {
    onSave(data)
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-black-400 border border-black-100 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-black-200">
          <h2 className="text-white-100 font-bold text-lg">Nova Conexão</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white-300 hover:text-white-100 transition-colors p-1"
          >
            <XIcon size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className={labelClass}>NPC de Origem *</label>
            <select
              {...register('sourceId')}
              className={errors.sourceId ? inputErrorClass : inputClass}
            >
              <option value="">Selecione um NPC...</option>
              {npcs.map((npc) => (
                <option key={npc.id} value={npc.id}>
                  {npc.name}
                </option>
              ))}
            </select>
            {errors.sourceId && <p className={errorClass}>{errors.sourceId.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Tipo de Relação</label>
            <select {...register('type')} className={inputClass}>
              {(Object.entries(RELATION_TYPE_LABEL) as [string, string][]).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>NPC de Destino *</label>
            <select
              {...register('targetId')}
              className={errors.targetId ? inputErrorClass : inputClass}
            >
              <option value="">Selecione um NPC...</option>
              {npcs.map((npc) => (
                <option key={npc.id} value={npc.id}>
                  {npc.name}
                </option>
              ))}
            </select>
            {errors.targetId && <p className={errorClass}>{errors.targetId.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Descrição (opcional)</label>
            <input
              {...register('label')}
              className={inputClass}
              placeholder="ex: pai de, lidera, traiu..."
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" onClick={onClose} className="w-auto! flex-1">
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="w-auto! flex-1">
              Conectar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddRelationModal
