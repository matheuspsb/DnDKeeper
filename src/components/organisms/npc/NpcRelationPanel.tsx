import type { Edge } from '@xyflow/react'
import TrashIcon from '../../atoms/icons/TrashIcon'

interface NpcRelationPanelProps {
  edges: Edge[]
  onDeleteRelation: (id: string) => void
}

function NpcRelationPanel({ edges, onDeleteRelation }: NpcRelationPanelProps) {
  if (edges.length === 0) return null

  return (
    <div className="absolute top-3 right-3 bg-black-400/90 backdrop-blur-sm border border-black-100 rounded-xl p-2 max-h-48 overflow-y-auto flex flex-col gap-1">
      <p className="text-white-300/50 text-xs px-1 mb-0.5">Conexões</p>
      {edges.map((edge) => (
        <div
          key={edge.id}
          className="flex items-center justify-between gap-3 px-1 py-0.5 hover:bg-black-300 rounded group/edge"
        >
          <span className="text-xs text-white-300/70 truncate max-w-36">{String(edge.label)}</span>
          <button
            onClick={() => {
              const relId = (edge.data as { relId: string }).relId
              onDeleteRelation(relId)
            }}
            className="text-white-300/30 hover:text-red-100 transition-colors opacity-0 group-hover/edge:opacity-100 cursor-pointer shrink-0"
          >
            <TrashIcon size={12} />
          </button>
        </div>
      ))}
    </div>
  )
}

export default NpcRelationPanel
