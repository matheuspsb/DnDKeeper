import { useRef, useState } from 'react'
import { resolveDriveUrl } from '../../utils/driveUrl'

export function useCombatantImagePicker(onSetImageUrl: (url: string) => void) {
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function open() {
    setValue('')
    setIsOpen(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function confirm() {
    if (value.trim()) onSetImageUrl(resolveDriveUrl(value.trim()))
    setIsOpen(false)
  }

  function close() {
    setIsOpen(false)
  }

  return { isOpen, value, setValue, inputRef, open, confirm, close }
}
