import type { Character } from '../../../types/character'
import type { CharacterInput } from '../../../hooks/useCharacters'
import { useCharacterForm } from '../../../hooks/useCharacterForm'
import Input from '../../atoms/Input'
import Button from '../../atoms/Button'
import CharacterModalHeader from './CharacterModalHeader'
import CharacterImagePicker from './CharacterImagePicker'
import { labelClass } from '../../../styles/form'

interface CharacterModalProps {
  initialCharacter: Character | null
  onSave: (data: CharacterInput) => Promise<void>
  onClose: () => void
}

const fieldClass = 'w-full bg-black-500 rounded-lg px-3 py-2'
const errorClass = 'text-red-100 text-xs mt-1'

function CharacterModal({ initialCharacter, onSave, onClose }: CharacterModalProps) {
  const { register, handleSubmit, setValue, errors, imageUrl, isSubmitting, saveError } =
    useCharacterForm(initialCharacter, onSave)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-black-400 border border-black-100 rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl">
        <CharacterModalHeader isEditing={!!initialCharacter} onClose={onClose} />

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <CharacterImagePicker imageUrl={imageUrl} register={register} setValue={setValue} />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Nome do Personagem *</label>
              <Input
                {...register('name')}
                error={!!errors.name}
                className={fieldClass}
                placeholder="Gandalf"
              />
              {errors.name && <p className={errorClass}>{errors.name.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Nome do Jogador</label>
              <Input {...register('playerName')} className={fieldClass} placeholder="João" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Classe</label>
              <Input {...register('characterClass')} className={fieldClass} placeholder="Mago" />
            </div>
            <div>
              <label className={labelClass}>Raça</label>
              <Input {...register('race')} className={fieldClass} placeholder="Elfo" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>HP Máximo</label>
              <Input
                {...register('maxHP')}
                type="number"
                min={1}
                error={!!errors.maxHP}
                className={fieldClass}
                placeholder="45"
              />
              {errors.maxHP && <p className={errorClass}>{errors.maxHP.message}</p>}
            </div>
            <div>
              <label className={labelClass}>HP Atual</label>
              <Input
                {...register('currentHP')}
                type="number"
                min={0}
                error={!!errors.currentHP}
                className={fieldClass}
                placeholder="= HP Máximo"
              />
              {errors.currentHP && <p className={errorClass}>{errors.currentHP.message}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>Pontos de Experiência (XP Total)</label>
            <Input
              {...register('xp')}
              type="number"
              min={0}
              error={!!errors.xp}
              className={fieldClass}
              placeholder="0"
            />
            {errors.xp && <p className={errorClass}>{errors.xp.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Anotações</label>
            <textarea
              {...register('notes')}
              className="w-full bg-black-500 border border-black-100 rounded-lg px-3 py-2 text-white-100 text-sm placeholder:text-white-300/30 focus:outline-none focus:border-red-100 transition-colors resize-none h-18"
              placeholder="Condições, itens importantes, lembretes rápidos..."
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
              {isSubmitting
                ? 'Salvando…'
                : initialCharacter
                  ? 'Salvar Alterações'
                  : 'Adicionar Personagem'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CharacterModal
