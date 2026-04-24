import type { Combatant } from '../../../types/initiative'
import { useInitiativeAddForm } from '../../../hooks/useInitiativeAddForm'
import Input from '../../atoms/Input'
import Button from '../../atoms/Button'
import PlusIcon from '../../atoms/icons/PlusIcon'
import UsersIcon from '../../atoms/icons/UsersIcon'

interface InitiativeAddFormProps {
  onAdd: (data: Omit<Combatant, 'id'>) => void
  hasCharacters: boolean
  onImportCharacters: () => void
}

function InitiativeAddForm({ onAdd, hasCharacters, onImportCharacters }: InitiativeAddFormProps) {
  const { register, handleSubmit, setValue, errors, isPlayer } = useInitiativeAddForm(onAdd)

  return (
    <div className="bg-black-400 border border-black-100 rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-white-300 text-sm font-medium">Adicionar combatente</span>
        {hasCharacters && (
          <button
            type="button"
            onClick={onImportCharacters}
            className="flex items-center gap-1.5 text-xs text-white-300/60 hover:text-white-300 transition-colors"
          >
            <UsersIcon size={13} />
            Importar personagens
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-2 flex-wrap">
          <div className="flex rounded-lg overflow-hidden border border-black-100 shrink-0">
            <button
              type="button"
              onClick={() => setValue('isPlayer', false)}
              className={`px-3 py-2 text-xs font-semibold transition-colors ${!isPlayer ? 'bg-red-100 text-white-100' : 'bg-black-500 text-white-300/60 hover:text-white-300'}`}
            >
              Monster
            </button>
            <button
              type="button"
              onClick={() => setValue('isPlayer', true)}
              className={`px-3 py-2 text-xs font-semibold transition-colors ${isPlayer ? 'bg-yellow/80 text-black-500' : 'bg-black-500 text-white-300/60 hover:text-white-300'}`}
            >
              Player
            </button>
          </div>

          <div className="flex-1 min-w-36">
            <Input
              {...register('name')}
              error={!!errors.name}
              className="w-full bg-black-500 rounded-lg px-3 py-2"
              placeholder="Nome..."
            />
          </div>

          <div className="w-20">
            <Input
              {...register('initiative')}
              type="number"
              error={!!errors.initiative}
              className="w-full bg-black-500 rounded-lg px-3 py-2"
              placeholder="Init"
            />
          </div>

          <div className="w-24">
            <Input
              {...register('maxHp')}
              type="number"
              min={1}
              className="w-full bg-black-500 rounded-lg px-3 py-2"
              placeholder="HP máx"
            />
          </div>

          <Button type="submit" variant="primary" className="w-auto! px-4 gap-2 shrink-0">
            <PlusIcon size={14} /> Adicionar
          </Button>
        </div>

        {(errors.name || errors.initiative) && (
          <p className="text-red-100 text-xs">
            {errors.name?.message ?? errors.initiative?.message}
          </p>
        )}
      </form>
    </div>
  )
}

export default InitiativeAddForm
