import type { NpcImagePosition } from '../../types/npc.types'

const positions: { value: NpcImagePosition; label: string }[] = [
  { value: 'top', label: 'Topo' },
  { value: 'center', label: 'Centro' },
  { value: 'bottom', label: 'Base' },
]

interface NpcImagePositionPickerProps {
  value: NpcImagePosition
  onChange: (position: NpcImagePosition) => void
}

function NpcImagePositionPicker({ value, onChange }: NpcImagePositionPickerProps) {
  return (
    <div>
      <label className="block text-white-300 text-xs font-medium mb-1.5">Enquadramento</label>
      <div className="flex gap-2">
        {positions.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => onChange(p.value)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              value === p.value
                ? 'bg-red-100 border-red-100 text-white-100'
                : 'bg-black-500 border-black-100 text-white-300 hover:border-white-300/40'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default NpcImagePositionPicker
