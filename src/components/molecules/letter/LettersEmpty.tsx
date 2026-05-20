import Button from '../../atoms/Button'
import ScrollIcon from '../../atoms/icons/ScrollIcon'
import PlusIcon from '../../atoms/icons/PlusIcon'

interface LettersEmptyProps {
  isDm: boolean
  onAdd: () => void
}

function LettersEmpty({ isDm, onAdd }: LettersEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <ScrollIcon size={48} className="text-white-300/20" />
      <div>
        <p className="text-white-200 font-medium">Nenhuma carta ainda</p>
        <p className="text-white-300/60 text-sm mt-1">
          Adicione cartas e documentos revelados aos jogadores
        </p>
      </div>
      {isDm && (
        <Button variant="primary" onClick={onAdd} className="flex items-center gap-2 w-auto!">
          <PlusIcon size={16} />
          Nova Carta
        </Button>
      )}
    </div>
  )
}

export default LettersEmpty
