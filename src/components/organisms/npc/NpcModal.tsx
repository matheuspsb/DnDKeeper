import type { Npc } from '../../../types/npc.types'
import { FACTIONS } from '../../../constants/npc.constants'
import { useNpcForm } from '../../../hooks/useNpcForm'
import type { NpcInput } from '../../../hooks/useNpcs'
import { labelClass } from '../../../styles/form'
import Input from '../../atoms/Input'
import Button from '../../atoms/Button'
import SelectArrow from '../../atoms/SelectArrow'
import NpcModalHeader from './NpcModalHeader'
import NpcImagePicker from './NpcImagePicker'
import NpcImagePositionPicker from './NpcImagePositionPicker'

interface NpcModalProps {
  initialNpc: Npc | null
  onSave: (data: NpcInput) => Promise<void>
  onClose: () => void
}

const fieldClass = 'w-full bg-black-500 rounded-lg px-3 py-2'
const selectClass = `${fieldClass} border border-black-100 text-white-100 text-sm focus:outline-none focus:border-red-100 transition-colors appearance-none`
const textareaClass = `${fieldClass} border border-black-100 text-white-100 text-sm placeholder:text-white-300/30 focus:outline-none focus:border-red-100 transition-colors resize-none h-20`
const errorClass = 'text-red-100 text-xs mt-1'

function NpcModal({ initialNpc, onSave, onClose }: NpcModalProps) {
  const { register, handleSubmit, setValue, errors, imageUrl, imagePosition, isSubmitting, saveError } =
    useNpcForm(initialNpc, onSave)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-black-400 border border-black-100 rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl">
        <NpcModalHeader isEditing={!!initialNpc} onClose={onClose} />

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
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
            <Input
              {...register('name')}
              error={!!errors.name}
              className={fieldClass}
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
              className={textareaClass}
              placeholder="Aparência, personalidade, papel na campanha..."
            />
          </div>

          <div>
            <label className={labelClass}>O que sabe / O que possui</label>
            <textarea
              {...register('notes')}
              className={textareaClass}
              placeholder="Informações que este NPC carrega..."
            />
          </div>

          {saveError && <p className={errorClass}>{saveError}</p>}

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="flex-1 disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando…' : initialNpc ? 'Salvar Alterações' : 'Adicionar NPC'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NpcModal
