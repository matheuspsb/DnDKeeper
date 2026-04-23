import { useState, type KeyboardEvent } from 'react'

interface InitiativeBadgeProps {
  value: number
  isCurrent: boolean
  onUpdate: (val: number) => void
}

function InitiativeBadge({ value, isCurrent, onUpdate }: InitiativeBadgeProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  function startEdit() {
    setDraft(String(value))
    setEditing(true)
  }

  function commit() {
    const parsed = parseInt(draft, 10)
    if (!isNaN(parsed)) onUpdate(parsed)
    setEditing(false)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') commit()
    if (e.key === 'Escape') setEditing(false)
  }

  const base =
    'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-colors'
  const style = isCurrent
    ? `${base} bg-red-100 text-white-100`
    : `${base} bg-black-500 text-white-300 border border-black-100`

  if (editing) {
    return (
      <input
        autoFocus
        type="number"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        className="w-10 h-10 rounded-lg bg-black-500 border border-red-100 text-center text-white-100 text-sm font-bold focus:outline-none tabular-nums shrink-0"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={startEdit}
      title="Clique para editar iniciativa"
      className={`${style} hover:opacity-70 cursor-pointer`}
    >
      {value}
    </button>
  )
}

export default InitiativeBadge
