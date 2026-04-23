import type { Node, Edge } from '@xyflow/react'
import type { Npc } from '../../types/npc.types'
import type { NpcRelation } from '../../types/npcRelation.types'
import { RELATION_TYPE_COLOR, RELATION_TYPE_LABEL } from '../../constants/npc.constants'

export function buildNodes(npcs: Npc[]): Node[] {
  const cols = 4
  const spacingX = 220
  const spacingY = 220

  return npcs.map((npc, i) => ({
    id: npc.id,
    type: 'npc',
    position: {
      x: (i % cols) * spacingX + 60,
      y: Math.floor(i / cols) * spacingY + 60,
    },
    data: { npc },
  }))
}

export function buildEdges(relations: NpcRelation[], onDelete: (id: string) => void): Edge[] {
  const seen = new Set<string>()

  return relations.reduce<Edge[]>((acc, rel) => {
    const key = [rel.sourceId, rel.targetId].sort().join('|') + rel.type
    if (seen.has(key)) return acc
    seen.add(key)

    const color = RELATION_TYPE_COLOR[rel.type]
    acc.push({
      id: rel.id,
      source: rel.sourceId,
      target: rel.targetId,
      label: rel.label || RELATION_TYPE_LABEL[rel.type],
      type: 'smoothstep',
      style: { stroke: color, strokeWidth: 2 },
      labelStyle: { fill: color, fontSize: 10, fontWeight: 600 },
      labelBgStyle: { fill: '#27282F', fillOpacity: 0.85 },
      markerEnd: undefined,
      data: { onDelete, relId: rel.id },
    })
    return acc
  }, [])
}
