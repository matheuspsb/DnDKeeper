import { memo } from 'react'
import type { HierarchyTree } from '../../../constants/cult'
import { FACTION_COLOR } from '../../../constants/npc.constants'
import { FILTER_ID } from './TreeFilters'
import { TreeDescendants } from './TreeDescendants'
import type { TreeLevelStyle } from './TreeDescendants'
import { useTreeExpansion } from '../../../hooks/connections/useTreeExpansion'

const ROOT_RADIUS = 52
const CHILD_RADIUS = 42
const IMAGE_RADIUS = CHILD_RADIUS - 3
const GRANDCHILD_RADIUS = 28
const GRANDCHILD_IMG_R = GRANDCHILD_RADIUS - 2
const GREAT_GRANDCHILD_RADIUS = 20
const GREAT_GRANDCHILD_IMG_R = GREAT_GRANDCHILD_RADIUS - 2
const ROOT_CENTER_Y = 100
const CHILD_CENTER_Y = 300
const GRANDCHILD_CENTER_Y = 490
const GREAT_GRANDCHILD_CENTER_Y = 650
const GRANDCHILD_SPACING = 70
const GREAT_GRANDCHILD_SPACING = 55
const PADDING_X = 80
const CHILD_STEP = 100

export const DOWN_TREE_MIN_WIDTH = 1280
export const DOWN_TREE_ROOT_Y = ROOT_CENTER_Y

export function getDownTreeWidth(tree: HierarchyTree): number {
  return Math.max(DOWN_TREE_MIN_WIDTH, PADDING_X * 2 + (tree.children.length - 1) * CHILD_STEP)
}

interface DownTreeProps {
  tree: HierarchyTree
  wasJustClick: () => boolean
}

export const DownTree = memo(function DownTree({ tree, wasJustClick }: DownTreeProps) {
  const { expandedIds, mountedIds, toggleExpanded } = useTreeExpansion()

  const nodeCount = tree.children.length
  const treeWidth = getDownTreeWidth(tree)
  const nodeSpacing = (treeWidth - PADDING_X * 2) / (nodeCount - 1)
  const rootCenterX = treeWidth / 2
  const rootColor =
    tree.root.color ?? FACTION_COLOR[tree.root.faction as keyof typeof FACTION_COLOR] ?? '#7c3aed'

  const levels: TreeLevelStyle[] = [
    { radius: CHILD_RADIUS, imageRadius: IMAGE_RADIUS, acrossSpacing: nodeSpacing },
    {
      radius: GRANDCHILD_RADIUS,
      imageRadius: GRANDCHILD_IMG_R,
      acrossSpacing: GRANDCHILD_SPACING,
      clickable: false,
    },
    {
      radius: GREAT_GRANDCHILD_RADIUS,
      imageRadius: GREAT_GRANDCHILD_IMG_R,
      acrossSpacing: GREAT_GRANDCHILD_SPACING,
      fontSize: 8,
      clickable: false,
    },
  ]
  const alongByDepth = [CHILD_CENTER_Y, GRANDCHILD_CENTER_Y, GREAT_GRANDCHILD_CENTER_Y]

  return (
    <>
      <g transform={`translate(${rootCenterX}, ${ROOT_CENTER_Y})`}>
        <circle
          r={ROOT_RADIUS}
          fill="#120a1e"
          stroke={rootColor}
          strokeWidth={2}
          filter={`url(#${FILTER_ID.glowRoot})`}
        />
        <text y={-6} textAnchor="middle" fill={rootColor} fontSize={22} fontWeight="bold">
          ?
        </text>
        <text y={12} textAnchor="middle" fill={rootColor} fontSize={11} fontWeight="600">
          {tree.root.label}
        </text>
        <text y={ROOT_RADIUS + 18} textAnchor="middle" fill="#6b7280" fontSize={10}>
          {tree.root.faction}
        </text>
      </g>

      <TreeDescendants
        nodes={tree.children}
        depth={1}
        parentAlong={ROOT_CENTER_Y}
        parentAcross={rootCenterX}
        parentRadius={ROOT_RADIUS}
        alongByDepth={alongByDepth}
        levels={levels}
        direction="down"
        expandedIds={expandedIds}
        mountedIds={mountedIds}
        onToggle={toggleExpanded}
        wasJustClick={wasJustClick}
        visible
      />
    </>
  )
})
