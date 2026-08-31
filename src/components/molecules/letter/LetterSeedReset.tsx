import { useState } from 'react'
import Button from '../../atoms/Button'

interface LetterSeedResetProps {
  onReset: () => void
}

function LetterSeedReset({ onReset }: LetterSeedResetProps) {
  const [confirm, setConfirm] = useState(false)

  function handleConfirm() {
    onReset()
    setConfirm(false)
  }

  if (confirm) {
    return (
      <>
        <span className="text-white-300/50 text-xs">Substituir todas as cartas pelo seed?</span>
        <Button variant="secondary" onClick={() => setConfirm(false)} className="px-3">
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleConfirm} className="px-3">
          Confirmar
        </Button>
      </>
    )
  }

  return (
    <Button variant="secondary" onClick={() => setConfirm(true)} className="px-3">
      Atualizar
    </Button>
  )
}

export default LetterSeedReset
