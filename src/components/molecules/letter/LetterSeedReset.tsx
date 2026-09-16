import { useConfirm } from '../../../hooks/useConfirm'
import Button from '../../atoms/Button'

interface LetterSeedResetProps {
  onReset: () => void
}

function LetterSeedReset({ onReset }: LetterSeedResetProps) {
  const { armed, arm, disarm, confirm } = useConfirm()

  if (armed) {
    return (
      <>
        <span className="text-white-300/50 text-xs">Substituir todas as cartas pelo seed?</span>
        <Button variant="secondary" onClick={disarm} className="px-3">
          Cancelar
        </Button>
        <Button variant="primary" onClick={() => confirm(onReset)} className="px-3">
          Confirmar
        </Button>
      </>
    )
  }

  return (
    <Button variant="secondary" onClick={arm} className="px-3">
      Atualizar
    </Button>
  )
}

export default LetterSeedReset
