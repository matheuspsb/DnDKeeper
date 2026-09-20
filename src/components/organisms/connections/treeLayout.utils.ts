import type { HierarchyTree } from '../../../constants/cult'
import { getDownTreeWidth, DOWN_TREE_ROOT_Y } from './DownTree'
import { getRightTreeSpan } from './RightTree'
import { getLeftTreeSpan } from './LeftTree'

const DOWN_RIGHT_GAP = 200
const RIGHT_TREE_GAP = 80

export interface TreeOffset {
  x: number
  y: number
}

export interface TreeLayout {
  downTrees: HierarchyTree[]
  rightTrees: HierarchyTree[]
  leftTrees: HierarchyTree[]
  downOffsets: TreeOffset[]
  rightOffsets: TreeOffset[]
  leftOffsets: TreeOffset[]
  totalDownWidth: number
}

export function computeLayout(trees: HierarchyTree[]): TreeLayout {
  const downTrees  = trees.filter((t) => t.direction !== 'right' && t.direction !== 'left')
  const rightTrees = trees.filter((t) => t.direction === 'right')
  const leftTrees  = trees.filter((t) => t.direction === 'left')

  let cumulativeX = 0
  const downOffsets: TreeOffset[] = downTrees.map((tree) => {
    const offset = { x: cumulativeX, y: 0 }
    cumulativeX += getDownTreeWidth(tree)
    return offset
  })
  const totalDownWidth = cumulativeX

  const rightStartX = totalDownWidth + (downTrees.length > 0 ? DOWN_RIGHT_GAP : 0)
  let currentRootY  = DOWN_TREE_ROOT_Y
  const rightOffsets: TreeOffset[] = rightTrees.map((tree, index) => {
    const span = getRightTreeSpan(tree)
    if (index > 0) currentRootY += getRightTreeSpan(rightTrees[index - 1]) / 2 + RIGHT_TREE_GAP + span / 2
    return { x: rightStartX, y: currentRootY }
  })

  const leftStartX = -(downTrees.length > 0 ? DOWN_RIGHT_GAP : 0)
  let currentLeftRootY = DOWN_TREE_ROOT_Y
  const leftOffsets: TreeOffset[] = leftTrees.map((tree, index) => {
    const span = getLeftTreeSpan(tree)
    if (index > 0) currentLeftRootY += getLeftTreeSpan(leftTrees[index - 1]) / 2 + RIGHT_TREE_GAP + span / 2
    return { x: leftStartX, y: currentLeftRootY }
  })

  return { downTrees, rightTrees, leftTrees, downOffsets, rightOffsets, leftOffsets, totalDownWidth }
}
