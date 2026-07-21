import type { HierarchyTree } from '../../../constants/cult'
import { FILTER_ID, TreeFilters } from './TreeFilters'
import { TreeConnector } from './TreeConnector'
import { TreeNode } from './TreeNode'

const ROOT_RADIUS = 52
const CHILD_RADIUS = 42
const IMAGE_RADIUS = CHILD_RADIUS - 3
const ROOT_CENTER_Y = 100
const CHILD_CENTER_Y = 300
const SVG_HEIGHT = 480
const PADDING_X = 80
const MIN_SVG_WIDTH = 1280

interface TreeViewProps {
  tree: HierarchyTree
}

export function TreeView({ tree }: TreeViewProps) {
  const nodeCount = tree.children.length
  const svgWidth = Math.max(MIN_SVG_WIDTH, PADDING_X * 2 + (nodeCount - 1) * 100)
  const nodeSpacing = (svgWidth - PADDING_X * 2) / (nodeCount - 1)
  const rootCenterX = svgWidth / 2

  function getChildCenterX(index: number) {
    return PADDING_X + index * nodeSpacing
  }

  return (
    <svg width={svgWidth} height={SVG_HEIGHT}>
      <defs>
        <TreeFilters />
      </defs>

      {tree.children.map((child, index) => (
        <TreeConnector
          key={child.id}
          fromCenterX={rootCenterX}
          fromCenterY={ROOT_CENTER_Y}
          fromRadius={ROOT_RADIUS}
          toCenterX={getChildCenterX(index)}
          toCenterY={CHILD_CENTER_Y}
          toRadius={CHILD_RADIUS}
          status={child.status}
        />
      ))}

      <g transform={`translate(${rootCenterX}, ${ROOT_CENTER_Y})`}>
        <circle
          r={ROOT_RADIUS}
          fill="#120a1e"
          stroke="#7c3aed"
          strokeWidth={2}
          filter={`url(#${FILTER_ID.glowRoot})`}
        />
        <text y={-6} textAnchor="middle" fill="#a78bfa" fontSize={22} fontWeight="bold">
          ?
        </text>
        <text y={12} textAnchor="middle" fill="#c4b5fd" fontSize={11} fontWeight="600">
          {tree.root.label}
        </text>
        <text y={ROOT_RADIUS + 18} textAnchor="middle" fill="#6b7280" fontSize={10}>
          {tree.root.faction}
        </text>
      </g>

      {tree.children.map((child, index) => (
        <g key={child.id} transform={`translate(${getChildCenterX(index)}, ${CHILD_CENTER_Y})`}>
          <TreeNode node={child} radius={CHILD_RADIUS} imageRadius={IMAGE_RADIUS} />
        </g>
      ))}
    </svg>
  )
}
