import { useState } from 'react'
import type { HierarchyTree } from '../../../constants/cult'
import { FACTION_COLOR } from '../../../constants/npc.constants'
import { FILTER_ID } from './TreeFilters'
import { TreeConnector } from './TreeConnector'
import { TreeNode } from './TreeNode'

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

export function DownTree({ tree, wasJustClick }: DownTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const nodeCount = tree.children.length
  const treeWidth = getDownTreeWidth(tree)
  const nodeSpacing = (treeWidth - PADDING_X * 2) / (nodeCount - 1)
  const rootCenterX = treeWidth / 2

  function toggleExpanded(nodeId: string) {
    setExpandedIds((previous) => {
      const next = new Set(previous)
      if (next.has(nodeId)) next.delete(nodeId)
      else next.add(nodeId)
      return next
    })
  }

  function getChildCenterX(index: number) {
    return PADDING_X + index * nodeSpacing
  }

  function getGrandchildCenterX(parentCenterX: number, childIndex: number, childCount: number) {
    const totalSpan = (childCount - 1) * GRANDCHILD_SPACING
    return parentCenterX - totalSpan / 2 + childIndex * GRANDCHILD_SPACING
  }

  function getGreatGrandchildCenterX(
    grandchildCenterX: number,
    childIndex: number,
    childCount: number,
  ) {
    const totalSpan = (childCount - 1) * GREAT_GRANDCHILD_SPACING
    return grandchildCenterX - totalSpan / 2 + childIndex * GREAT_GRANDCHILD_SPACING
  }

  const rootColor = FACTION_COLOR[tree.root.faction as keyof typeof FACTION_COLOR] ?? '#7c3aed'

  return (
    <>
      {/* Nível 1 → 2 */}
      {tree.children.map((child, index) => (
        <TreeConnector
          key={`l12-${child.id}`}
          fromCenterX={rootCenterX}
          fromCenterY={ROOT_CENTER_Y}
          fromRadius={ROOT_RADIUS}
          toCenterX={getChildCenterX(index)}
          toCenterY={CHILD_CENTER_Y}
          toRadius={CHILD_RADIUS}
          status={child.status}
        />
      ))}

      {/* Nível 2 → 3 (expandidos) */}
      {tree.children.map((child, index) => {
        if (!expandedIds.has(child.id) || !child.children?.length) return null
        const parentX = getChildCenterX(index)
        return child.children.map((grandchild, gcIndex) => (
          <TreeConnector
            key={`l23-${grandchild.id}`}
            fromCenterX={parentX}
            fromCenterY={CHILD_CENTER_Y}
            fromRadius={CHILD_RADIUS}
            toCenterX={getGrandchildCenterX(parentX, gcIndex, child.children!.length)}
            toCenterY={GRANDCHILD_CENTER_Y}
            toRadius={GRANDCHILD_RADIUS}
            status={grandchild.status}
          />
        ))
      })}

      {/* Nível 3 → 4 */}
      {tree.children.map((child, childIndex) => {
        if (!expandedIds.has(child.id) || !child.children?.length) return null
        const parentX = getChildCenterX(childIndex)
        return child.children.map((grandchild, gcIndex) => {
          if (!grandchild.children?.length) return null
          const gcX = getGrandchildCenterX(parentX, gcIndex, child.children!.length)
          return grandchild.children.map((ggc, ggcIndex) => (
            <TreeConnector
              key={`l34-${ggc.id}`}
              fromCenterX={gcX}
              fromCenterY={GRANDCHILD_CENTER_Y}
              fromRadius={GRANDCHILD_RADIUS}
              toCenterX={getGreatGrandchildCenterX(gcX, ggcIndex, grandchild.children!.length)}
              toCenterY={GREAT_GRANDCHILD_CENTER_Y}
              toRadius={GREAT_GRANDCHILD_RADIUS}
              status={ggc.status}
            />
          ))
        })
      })}

      {/* Nó raiz */}
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

      {/* Nível 2 */}
      {tree.children.map((child, index) => {
        const hasChildren = !!child.children?.length
        const isExpanded = expandedIds.has(child.id)
        return (
          <g
            key={child.id}
            transform={`translate(${getChildCenterX(index)}, ${CHILD_CENTER_Y})`}
            onClick={
              hasChildren
                ? () => {
                    if (wasJustClick()) toggleExpanded(child.id)
                  }
                : undefined
            }
            cursor={hasChildren ? 'pointer' : undefined}
          >
            <TreeNode
              node={child}
              radius={CHILD_RADIUS}
              imageRadius={IMAGE_RADIUS}
              hasChildren={hasChildren}
              isExpanded={isExpanded}
            />
          </g>
        )
      })}

      {/* Nível 3 */}
      {tree.children.map((child, index) => {
        if (!expandedIds.has(child.id) || !child.children?.length) return null
        const parentX = getChildCenterX(index)
        return child.children.map((grandchild, gcIndex) => (
          <g
            key={grandchild.id}
            transform={`translate(${getGrandchildCenterX(parentX, gcIndex, child.children!.length)}, ${GRANDCHILD_CENTER_Y})`}
          >
            <TreeNode node={grandchild} radius={GRANDCHILD_RADIUS} imageRadius={GRANDCHILD_IMG_R} />
          </g>
        ))
      })}

      {/* Nível 4 */}
      {tree.children.map((child, childIndex) => {
        if (!expandedIds.has(child.id) || !child.children?.length) return null
        const parentX = getChildCenterX(childIndex)
        return child.children.map((grandchild, gcIndex) => {
          if (!grandchild.children?.length) return null
          const gcX = getGrandchildCenterX(parentX, gcIndex, child.children!.length)
          return grandchild.children.map((ggc, ggcIndex) => (
            <g
              key={ggc.id}
              transform={`translate(${getGreatGrandchildCenterX(gcX, ggcIndex, grandchild.children!.length)}, ${GREAT_GRANDCHILD_CENTER_Y})`}
            >
              <TreeNode
                node={ggc}
                radius={GREAT_GRANDCHILD_RADIUS}
                imageRadius={GREAT_GRANDCHILD_IMG_R}
                fontSize={8}
              />
            </g>
          ))
        })
      })}
    </>
  )
}
