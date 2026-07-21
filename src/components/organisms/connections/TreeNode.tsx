import type { NpcStatus } from '../../../types/npc.types'
import type { HierarchyNode } from '../../../constants/cult'
import { FILTER_ID } from './TreeFilters'
import { NodeImage } from './NodeImage'

const BORDER_COLOR: Record<NpcStatus, string> = {
  vivo: '#7c3aed',
  morto: '#7f1d1d',
  desconhecido: '#374151',
  desaparecido: '#facc15',
}

const BACKGROUND_COLOR: Record<NpcStatus, string> = {
  vivo: '#1e1030',
  morto: '#1c0f0f',
  desconhecido: '#17181c',
  desaparecido: '#1e1030',
}

interface TreeNodeProps {
  node: HierarchyNode
  radius: number
  imageRadius: number
}

export function TreeNode({ node, radius, imageRadius }: TreeNodeProps) {
  const isRevealed = node.status !== 'desconhecido'
  const isDead = node.status === 'morto'
  const borderColor = BORDER_COLOR[node.status]
  const background = BACKGROUND_COLOR[node.status]

  return (
    <>
      {isRevealed && (
        <circle
          r={radius + 5}
          fill="none"
          stroke={borderColor}
          strokeWidth={1}
          strokeOpacity={0.25}
          filter={`url(#${FILTER_ID.glowNode})`}
        />
      )}

      <circle
        r={radius}
        fill={background}
        stroke={borderColor}
        strokeWidth={isRevealed ? 2 : 1.5}
        strokeDasharray={!isRevealed ? '5 3' : undefined}
      />

      {node.imageUrl ? (
        <NodeImage
          nodeId={node.id}
          imageUrl={node.imageUrl}
          radius={imageRadius}
          grayscale={isDead}
        />
      ) : (
        <text y={5} textAnchor="middle" fill="#4b5563" fontSize={20}>
          ?
        </text>
      )}

      <text
        y={radius + 17}
        textAnchor="middle"
        fill={isRevealed ? '#e5e7eb' : '#6b7280'}
        fontSize={11}
        fontWeight={isRevealed ? '600' : '400'}
      >
        {node.label}
      </text>

      {node.name && (
        <text y={radius + 31} textAnchor="middle" fill="#a78bfa" fontSize={10}>
          {node.name}
        </text>
      )}
    </>
  )
}
