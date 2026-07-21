import { useState, useEffect } from 'react'
import type { HierarchyTree } from '../../../constants/cult'
import { useCanvasInteraction } from '../../../hooks/useCanvasInteraction'
import { FILTER_ID, TreeFilters } from './TreeFilters'
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
const MIN_TREE_WIDTH = 1280
const INITIAL_ZOOM = 0.7

interface TreeViewProps {
  tree: HierarchyTree
}

export function TreeView({ tree }: TreeViewProps) {
  const {
    pan,
    zoom,
    isDragging,
    svgRef,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    wasJustClick,
    centerContent,
  } = useCanvasInteraction()

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const nodeCount = tree.children.length
  const treeWidth = Math.max(MIN_TREE_WIDTH, PADDING_X * 2 + (nodeCount - 1) * 100)
  const nodeSpacing = (treeWidth - PADDING_X * 2) / (nodeCount - 1)
  const rootCenterX = treeWidth / 2
  const anyExpanded = expandedIds.size > 0
  const hasVisibleGreatGrandchildren = tree.children.some(
    (child) => expandedIds.has(child.id) && child.children?.some((gc) => gc.children?.length),
  )
  const treeHeight = hasVisibleGreatGrandchildren ? 810 : anyExpanded ? 660 : 480

  useEffect(() => {
    centerContent(rootCenterX, treeHeight / 2, INITIAL_ZOOM)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      style={{ cursor: isDragging ? 'grabbing' : 'grab', display: 'block' }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <defs>
        <TreeFilters />
      </defs>

      <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
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

        {tree.children.map((child, index) => {
          if (!expandedIds.has(child.id) || !child.children?.length) return null
          const parentCenterX = getChildCenterX(index)

          return child.children.map((grandchild, grandchildIndex) => (
            <TreeConnector
              key={grandchild.id}
              fromCenterX={parentCenterX}
              fromCenterY={CHILD_CENTER_Y}
              fromRadius={CHILD_RADIUS}
              toCenterX={getGrandchildCenterX(
                parentCenterX,
                grandchildIndex,
                child.children!.length,
              )}
              toCenterY={GRANDCHILD_CENTER_Y}
              toRadius={GRANDCHILD_RADIUS}
              status={grandchild.status}
            />
          ))
        })}

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

        {tree.children.map((child, index) => {
          if (!expandedIds.has(child.id) || !child.children?.length) return null
          const parentCenterX = getChildCenterX(index)

          return child.children.map((grandchild, grandchildIndex) => (
            <g
              key={grandchild.id}
              transform={`translate(${getGrandchildCenterX(parentCenterX, grandchildIndex, child.children!.length)}, ${GRANDCHILD_CENTER_Y})`}
            >
              <TreeNode
                node={grandchild}
                radius={GRANDCHILD_RADIUS}
                imageRadius={GRANDCHILD_IMG_R}
              />
            </g>
          ))
        })}

        {tree.children.map((child, childIndex) => {
          if (!expandedIds.has(child.id) || !child.children?.length) return null
          const parentCenterX = getChildCenterX(childIndex)

          return child.children.map((grandchild, grandchildIndex) => {
            if (!grandchild.children?.length) return null
            const grandchildCenterX = getGrandchildCenterX(
              parentCenterX,
              grandchildIndex,
              child.children!.length,
            )

            return grandchild.children.map((greatGrandchild, greatGrandchildIndex) => (
              <TreeConnector
                key={`conn-${greatGrandchild.id}`}
                fromCenterX={grandchildCenterX}
                fromCenterY={GRANDCHILD_CENTER_Y}
                fromRadius={GRANDCHILD_RADIUS}
                toCenterX={getGreatGrandchildCenterX(
                  grandchildCenterX,
                  greatGrandchildIndex,
                  grandchild.children!.length,
                )}
                toCenterY={GREAT_GRANDCHILD_CENTER_Y}
                toRadius={GREAT_GRANDCHILD_RADIUS}
                status={greatGrandchild.status}
              />
            ))
          })
        })}

        {tree.children.map((child, childIndex) => {
          if (!expandedIds.has(child.id) || !child.children?.length) return null
          const parentCenterX = getChildCenterX(childIndex)

          return child.children.map((grandchild, grandchildIndex) => {
            if (!grandchild.children?.length) return null
            const grandchildCenterX = getGrandchildCenterX(
              parentCenterX,
              grandchildIndex,
              child.children!.length,
            )

            return grandchild.children.map((greatGrandchild, greatGrandchildIndex) => (
              <g
                key={greatGrandchild.id}
                transform={`translate(${getGreatGrandchildCenterX(grandchildCenterX, greatGrandchildIndex, grandchild.children!.length)}, ${GREAT_GRANDCHILD_CENTER_Y})`}
              >
                <TreeNode
                  node={greatGrandchild}
                  radius={GREAT_GRANDCHILD_RADIUS}
                  imageRadius={GREAT_GRANDCHILD_IMG_R}
                  fontSize={6}
                />
              </g>
            ))
          })
        })}
      </g>
    </svg>
  )
}
