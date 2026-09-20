import { memo } from 'react'
import type { HierarchyTree } from '../../../constants/cult'
import { FACTION_COLOR } from '../../../constants/npc.constants'
import { TreeNode } from './TreeNode'
import { TreeDescendants } from './TreeDescendants'
import type { TreeLevelStyle } from './TreeDescendants'
import { useTreeExpansion } from '../../../hooks/useTreeExpansion'

const ROOT_RADIUS = 52
const CHILD_RADIUS = 36
const CHILD_IMG_R = CHILD_RADIUS - 3
const GRANDCHILD_RADIUS = 32
const GRANDCHILD_IMG_R = GRANDCHILD_RADIUS - 2
const GREAT_GRANDCHILD_RADIUS = 28
const GREAT_GRANDCHILD_IMG_R = GREAT_GRANDCHILD_RADIUS - 2
const LEVEL4_RADIUS = 22
const LEVEL4_IMG_R = LEVEL4_RADIUS - 2
const LEVEL_SPACING_X = 220
const CHILD_SPACING_Y = 140
const GRANDCHILD_SPACING_Y = 100
const GREAT_GRANDCHILD_SPACING_Y = 90
const LEVEL4_SPACING_Y = 70

const LEVELS: TreeLevelStyle[] = [
  { radius: CHILD_RADIUS, imageRadius: CHILD_IMG_R, acrossSpacing: CHILD_SPACING_Y },
  {
    radius: GRANDCHILD_RADIUS,
    imageRadius: GRANDCHILD_IMG_R,
    acrossSpacing: GRANDCHILD_SPACING_Y,
    clickable: false,
  },
  {
    radius: GREAT_GRANDCHILD_RADIUS,
    imageRadius: GREAT_GRANDCHILD_IMG_R,
    acrossSpacing: GREAT_GRANDCHILD_SPACING_Y,
    fontSize: 10,
    clickable: false,
  },
  {
    radius: LEVEL4_RADIUS,
    imageRadius: LEVEL4_IMG_R,
    acrossSpacing: LEVEL4_SPACING_Y,
    fontSize: 8,
    clickable: false,
  },
]

export function getLeftTreeSpan(tree: HierarchyTree): number {
  return Math.max(200, (tree.children.length - 1) * CHILD_SPACING_Y + CHILD_RADIUS * 2)
}

interface LeftTreeProps {
  tree: HierarchyTree
  wasJustClick: () => boolean
}

export const LeftTree = memo(function LeftTree({ tree, wasJustClick }: LeftTreeProps) {
  const { expandedIds, mountedIds, toggleExpanded } = useTreeExpansion()

  const accentColor = tree.root.color ?? FACTION_COLOR[tree.root.faction as keyof typeof FACTION_COLOR]
  const hideRoot = tree.hideRoot ?? false
  const childX = hideRoot ? 0 : -LEVEL_SPACING_X
  const alongByDepth = [
    childX,
    childX - LEVEL_SPACING_X,
    childX - LEVEL_SPACING_X * 2,
    childX - LEVEL_SPACING_X * 3,
  ]

  return (
    <>
      {!hideRoot && (
        <TreeNode
          node={{
            id: '__root__',
            label: tree.root.label,
            name: tree.root.name,
            status: tree.root.status ?? 'desconhecido',
            imageUrl: tree.root.imageUrl,
            imagePosition: tree.root.imagePosition,
          }}
          radius={ROOT_RADIUS}
          imageRadius={ROOT_RADIUS - 4}
          accentColor={accentColor}
        />
      )}

      <TreeDescendants
        nodes={tree.children}
        depth={1}
        parentAlong={0}
        parentAcross={0}
        parentRadius={ROOT_RADIUS}
        alongByDepth={alongByDepth}
        levels={LEVELS}
        direction="left"
        expandedIds={expandedIds}
        mountedIds={mountedIds}
        onToggle={toggleExpanded}
        wasJustClick={wasJustClick}
        visible
        accentColor={accentColor}
        hideParentConnector={hideRoot}
      />
    </>
  )
})
