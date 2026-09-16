import { useConfirm } from '../../../hooks/useConfirm'
import PencilIcon from '../../atoms/icons/PencilIcon'
import TrashIcon from '../../atoms/icons/TrashIcon'

interface CharacterCardActionsProps {
  onEdit: () => void
  onDelete: () => void
}

function CharacterCardActions({ onEdit, onDelete }: CharacterCardActionsProps) {
  const { armed, arm, disarm, confirm } = useConfirm()

  return (
    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <button
        onClick={onEdit}
        title="Editar"
        className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-white-100 hover:bg-red-200 transition-colors cursor-pointer"
      >
        <PencilIcon size={14} />
      </button>
      {armed ? (
        <div className="flex items-center gap-0.5 bg-red-100/90 backdrop-blur-sm rounded-lg px-1">
          <button
            onClick={disarm}
            className="text-white-100/70 hover:text-white-100 transition-colors px-1.5 py-1 text-xs cursor-pointer"
          >
            Não
          </button>
          <button
            onClick={() => confirm(onDelete)}
            className="text-white-100 hover:text-white-200 transition-colors font-semibold px-1.5 py-1 text-xs cursor-pointer"
          >
            Sim
          </button>
        </div>
      ) : (
        <button
          onClick={arm}
          title="Remover"
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-white-100 hover:bg-red-200 transition-colors cursor-pointer"
        >
          <TrashIcon size={14} />
        </button>
      )}
    </div>
  )
}

export default CharacterCardActions
