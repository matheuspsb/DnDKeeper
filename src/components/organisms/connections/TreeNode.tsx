import type { NpcStatus } from '../../../types/npc.types'
import type { HierarchyNode } from '../../../constants/cult'
import { FILTER_ID } from './TreeFilters'
import { NodeImage } from './NodeImage'
import SkullBadge from '../../atoms/icons/SkullBadge'
import { TreeChevron } from './TreeChevron'

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
  hasChildren?: boolean
  isExpanded?: boolean
  fontSize?: number
  expandDirection?: 'down' | 'right'
  accentColor?: string
}

export function TreeNode({
  node,
  radius,
  imageRadius,
  hasChildren,
  isExpanded,
  fontSize = 11,
  expandDirection = 'down',
  accentColor,
}: TreeNodeProps) {
  const isRevealed = node.status !== 'desconhecido'
  const isDead = node.status === 'morto'
  const isVivo = node.status === 'vivo'
  const borderColor = isVivo && accentColor ? accentColor : BORDER_COLOR[node.status]
  const nameColor = isVivo && accentColor ? accentColor : '#a78bfa'
  const background = isVivo && accentColor ? '#17181c' : BACKGROUND_COLOR[node.status]
  const lineHeight = fontSize + 3
  const labelY = radius + lineHeight + 3
  const nameY = labelY + lineHeight
  const chevronY = node.name ? nameY + lineHeight : labelY + lineHeight

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
          imagePosition={node.imagePosition}
        />
      ) : (
        <text y={5} textAnchor="middle" fill="#4b5563" fontSize={20}>
          ?
        </text>
      )}

      {isDead && <SkullBadge radius={radius} />}

      <text
        y={labelY}
        textAnchor="middle"
        fill={isRevealed ? '#e5e7eb' : '#6b7280'}
        fontSize={fontSize}
        fontWeight={isRevealed ? '600' : '400'}
      >
        {node.label}
      </text>

      {node.name && (
        <text y={nameY} textAnchor="middle" fill={nameColor} fontSize={fontSize - 1}>
          {node.name}
        </text>
      )}

      {hasChildren && (
        <TreeChevron
          y={chevronY}
          direction={
            expandDirection === 'right'
              ? isExpanded ? 'left' : 'right'
              : isExpanded ? 'up' : 'down'
          }
        />
      )}
    </>
  )
}
