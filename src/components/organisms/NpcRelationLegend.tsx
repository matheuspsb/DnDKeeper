import { RELATION_TYPE_COLOR, RELATION_TYPE_LABEL } from '../../constants/npc.constants'

function NpcRelationLegend() {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black-400/90 backdrop-blur-sm border border-black-100 rounded-xl px-4 py-2">
      {(Object.entries(RELATION_TYPE_COLOR) as [string, string][]).map(([type, color]) => (
        <span key={type} className="flex items-center gap-1.5 text-xs">
          <span
            className="w-4 h-0.5 rounded-full inline-block"
            style={{ backgroundColor: color }}
          />
          <span className="text-white-300/70">
            {RELATION_TYPE_LABEL[type as keyof typeof RELATION_TYPE_LABEL]}
          </span>
        </span>
      ))}
    </div>
  )
}

export default NpcRelationLegend
