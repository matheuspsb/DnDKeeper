import { useState } from 'react'

export function useConfirm() {
  const [armed, setArmed] = useState(false)

  function arm() {
    setArmed(true)
  }

  function disarm() {
    setArmed(false)
  }

  function confirm(action: () => void) {
    action()
    setArmed(false)
  }

  return { armed, arm, disarm, confirm }
}
