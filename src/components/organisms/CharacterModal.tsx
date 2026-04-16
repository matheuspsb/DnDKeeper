import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Character } from '../../types/character'
import { characterFormSchema, type CharacterFormInput, type CharacterFormOutput } from '../../schemas/character'
import { LOCAL_ARTS, resolveImageUrl, toLocalArtUrl } from '../../constants/arts'
import Button from '../atoms/Button'
import XIcon from '../atoms/icons/XIcon'

interface CharacterModalProps {
  initialCharacter: Character | null
  onSave: (data: Omit<Character, 'id'>) => void
  onClose: () => void
}

function CharacterModal({ initialCharacter, onSave, onClose }: CharacterModalProps) {
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

  function onSubmit(data: CharacterFormOutput) {
    onSave(data)
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-black-400 border border-black-100 rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-black-200">
          <h2 className="text-white-100 font-bold text-lg">
            {initialCharacter ? 'Editar Personagem' : 'Novo Personagem'}
          </h2>
          <button type="button" onClick={onClose} className="text-white-300 hover:text-white-100 transition-colors p-1">
            <XIcon size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className={labelClass}>Imagem do Personagem</label>
            <div className="flex gap-2">
              {LOCAL_ARTS.map(art => {
                const artKey = toLocalArtUrl(art.key)
                return (
                  <button
                    key={art.key}
                    type="button"
                    onClick={() => setValue('imageUrl', artKey, { shouldValidate: true })}
                    className={`w-14 h-18 rounded-lg overflow-hidden border-2 shrink-0 transition-colors ${imageUrl === artKey ? 'border-red-100' : 'border-black-100 hover:border-white-300/40'}`}
                  >
                    <img src={art.url} alt={art.name} className="w-full h-full object-cover" />
                  </button>
                )
              })}
              {imageUrl && !LOCAL_ARTS.some(a => toLocalArtUrl(a.key) === imageUrl) && (
                <div className="w-14 h-18 rounded-lg overflow-hidden border-2 border-red-100 shrink-0">
                  <img src={resolveImageUrl(imageUrl)} alt="preview" className="w-full h-full object-cover" onError={e => { e.currentTarget.style.display = 'none' }} />
                </div>
              )}
            </div>
            <input
              {...register('imageUrl')}
              className={inputClass}
              placeholder="ou cole uma URL externa..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Nome do Personagem *</label>
              <input
                {...register('name')}
                className={errors.name ? inputErrorClass : inputClass}
                placeholder="Gandalf"
              />
              {errors.name && <p className={errorClass}>{errors.name.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Nome do Jogador</label>
              <input
                {...register('playerName')}
                className={inputClass}
                placeholder="João"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Classe</label>
              <input
                {...register('characterClass')}
                className={inputClass}
                placeholder="Mago"
              />
            </div>
            <div>
              <label className={labelClass}>Raça</label>
              <input
                {...register('race')}
                className={inputClass}
                placeholder="Elfo"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>HP Máximo</label>
              <input
                {...register('maxHP')}
                type="number"
                min={1}
                className={errors.maxHP ? inputErrorClass : inputClass}
                placeholder="45"
              />
              {errors.maxHP && <p className={errorClass}>{errors.maxHP.message}</p>}
            </div>
            <div>
              <label className={labelClass}>HP Atual</label>
              <input
                {...register('currentHP')}
                type="number"
                min={0}
                className={errors.currentHP ? inputErrorClass : inputClass}
                placeholder="= HP Máximo"
              />
              {errors.currentHP && <p className={errorClass}>{errors.currentHP.message}</p>}
            </div>
          </div>
          <div>
            <label className={labelClass}>Pontos de Experiência (XP Total)</label>
            <input
              {...register('xp')}
              type="number"
              min={0}
              className={errors.xp ? inputErrorClass : inputClass}
              placeholder="0"
            />
            {errors.xp && <p className={errorClass}>{errors.xp.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Anotações</label>
            <textarea
              {...register('notes')}
              className={`${inputClass} resize-none h-18`}
              placeholder="Condições, itens importantes, lembretes rápidos..."
            />
          </div>
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" onClick={onClose} className="w-auto! flex-1">Cancelar</Button>
            <Button type="submit" variant="primary" className="w-auto! flex-1">
              {initialCharacter ? 'Salvar Alterações' : 'Adicionar Personagem'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CharacterModal
