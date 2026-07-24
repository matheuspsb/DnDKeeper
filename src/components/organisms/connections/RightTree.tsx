import { useState } from 'react'
import type { HierarchyTree, HierarchyNode } from '../../../constants/cult'
import { FACTION_COLOR } from '../../../constants/npc.constants'
import { TreeConnector } from './TreeConnector'
import { TreeNode } from './TreeNode'

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

export function getRightTreeSpan(tree: HierarchyTree): number {
  return Math.max(200, (tree.children.length - 1) * CHILD_SPACING_Y + CHILD_RADIUS * 2)
}

function getChildY(index: number, count: number): number {
  return (index - (count - 1) / 2) * CHILD_SPACING_Y
}

function getGrandchildY(childY: number, index: number, count: number): number {
  return childY + (index - (count - 1) / 2) * GRANDCHILD_SPACING_Y
}

function getGreatGrandchildY(gcY: number, index: number, count: number): number {
  return gcY + (index - (count - 1) / 2) * GREAT_GRANDCHILD_SPACING_Y
}

function getLevel4Y(ggcY: number, index: number, count: number): number {
  return ggcY + (index - (count - 1) / 2) * LEVEL4_SPACING_Y
}

interface RightTreeProps {
  tree: HierarchyTree
  wasJustClick: () => boolean
}

export function RightTree({ tree, wasJustClick }: RightTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [mountedIds, setMountedIds] = useState<Set<string>>(new Set())

  function toggleExpanded(nodeId: string) {
    if (!wasJustClick()) return
    if (!expandedIds.has(nodeId)) {
      setMountedIds((prev) => new Set(prev).add(nodeId))
    }
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(nodeId)) next.delete(nodeId)
      else next.add(nodeId)
      return next
    })
  }

  const accentColor = FACTION_COLOR[tree.root.faction as keyof typeof FACTION_COLOR]
  const hideRoot = tree.hideRoot ?? false
  const childX = hideRoot ? 0 : LEVEL_SPACING_X
  const grandchildX = childX + LEVEL_SPACING_X
  const greatGrandchildX = childX + LEVEL_SPACING_X * 2
  const level4X = childX + LEVEL_SPACING_X * 3
  const childCount = tree.children.length

  return (
    <>
      {/* Nó raiz */}
      {!hideRoot &&
        (() => {
          const rootAsNode: HierarchyNode = {
            id: '__root__',
            label: tree.root.label,
            name: tree.root.name,
            status: tree.root.status ?? 'desconhecido',
            imageUrl: tree.root.imageUrl,
            imagePosition: tree.root.imagePosition,
          }
          return (
            <g>
              <TreeNode
                node={rootAsNode}
                radius={ROOT_RADIUS}
                imageRadius={ROOT_RADIUS - 4}
                accentColor={accentColor}
              />
            </g>
          )
        })()}

      {/* Raiz → L1 */}
      {!hideRoot &&
        tree.children.map((child, index) => (
          <TreeConnector
            key={`rc-${child.id}`}
            direction="right"
            fromCenterX={0}
            fromCenterY={0}
            fromRadius={ROOT_RADIUS}
            toCenterX={childX}
            toCenterY={getChildY(index, childCount)}
            toRadius={CHILD_RADIUS}
            status={child.status}
          />
        ))}

      {/* L1 → L2 connectors */}
      {tree.children.map((child, index) => {
        if (!mountedIds.has(child.id) || !child.children?.length) return null
        const childY = getChildY(index, childCount)
        const isL1Expanded = expandedIds.has(child.id)
        return (
          <g
            key={`l1l2c-${child.id}`}
            visibility={isL1Expanded ? undefined : 'hidden'}
            pointerEvents="none"
          >
            {child.children!.map((grandchild, gcIndex) => (
              <TreeConnector
                key={`l1l2-${grandchild.id}`}
                direction="right"
                fromCenterX={childX}
                fromCenterY={childY}
                fromRadius={CHILD_RADIUS}
                toCenterX={grandchildX}
                toCenterY={getGrandchildY(childY, gcIndex, child.children!.length)}
                toRadius={GRANDCHILD_RADIUS}
                status={grandchild.status}
              />
            ))}
          </g>
        )
      })}

      {/* L2 → L3 connectors — visíveis quando L2 expandido */}
      {tree.children.map((child, index) => {
        if (!mountedIds.has(child.id) || !child.children?.length) return null
        const childY = getChildY(index, childCount)
        const isL1Expanded = expandedIds.has(child.id)
        return child.children.map((grandchild, gcIndex) => {
          if (!mountedIds.has(grandchild.id) || !grandchild.children?.length) return null
          const gcY = getGrandchildY(childY, gcIndex, child.children!.length)
          const isL2Expanded = expandedIds.has(grandchild.id)
          return (
            <g
              key={`l2l3c-${grandchild.id}`}
              visibility={isL1Expanded && isL2Expanded ? undefined : 'hidden'}
              pointerEvents="none"
            >
              {grandchild.children!.map((ggc, ggcIndex) => (
                <TreeConnector
                  key={`l2l3-${ggc.id}`}
                  direction="right"
                  fromCenterX={grandchildX}
                  fromCenterY={gcY}
                  fromRadius={GRANDCHILD_RADIUS}
                  toCenterX={greatGrandchildX}
                  toCenterY={getGreatGrandchildY(gcY, ggcIndex, grandchild.children!.length)}
                  toRadius={GREAT_GRANDCHILD_RADIUS}
                  status={ggc.status}
                />
              ))}
            </g>
          )
        })
      })}

      {/* L3 → L4 connectors — visíveis quando L2 expandido */}
      {tree.children.map((child, index) => {
        if (!mountedIds.has(child.id) || !child.children?.length) return null
        const childY = getChildY(index, childCount)
        const isL1Expanded = expandedIds.has(child.id)
        return child.children.map((grandchild, gcIndex) => {
          if (!mountedIds.has(grandchild.id) || !grandchild.children?.length) return null
          const gcY = getGrandchildY(childY, gcIndex, child.children!.length)
          const isL2Expanded = expandedIds.has(grandchild.id)
          return grandchild.children.map((ggc, ggcIndex) => {
            if (!ggc.children?.length) return null
            const ggcY = getGreatGrandchildY(gcY, ggcIndex, grandchild.children!.length)
            return (
              <g
                key={`l3l4c-${ggc.id}`}
                visibility={isL1Expanded && isL2Expanded ? undefined : 'hidden'}
                pointerEvents="none"
              >
                {ggc.children!.map((l4, l4Index) => (
                  <TreeConnector
                    key={`l3l4-${l4.id}`}
                    direction="right"
                    fromCenterX={greatGrandchildX}
                    fromCenterY={ggcY}
                    fromRadius={GREAT_GRANDCHILD_RADIUS}
                    toCenterX={level4X}
                    toCenterY={getLevel4Y(ggcY, l4Index, ggc.children!.length)}
                    toRadius={LEVEL4_RADIUS}
                    status={l4.status}
                  />
                ))}
              </g>
            )
          })
        })
      })}

      {/* Nós L1 — clicáveis */}
      {tree.children.map((child, index) => {
        const childY = getChildY(index, childCount)
        const hasChildren = !!child.children?.length
        const isExpanded = expandedIds.has(child.id)
        return (
          <g
            key={child.id}
            transform={`translate(${childX}, ${childY})`}
            onClick={hasChildren ? () => toggleExpanded(child.id) : undefined}
            cursor={hasChildren ? 'pointer' : undefined}
          >
            <TreeNode
              node={child}
              radius={CHILD_RADIUS}
              imageRadius={CHILD_IMG_R}
              hasChildren={hasChildren}
              isExpanded={isExpanded}
              expandDirection="right"
              accentColor={accentColor}
            />
          </g>
        )
      })}

      {/* Nós L2 — clicáveis, visíveis quando L1 expandido */}
      {tree.children.map((child, index) => {
        if (!mountedIds.has(child.id) || !child.children?.length) return null
        const childY = getChildY(index, childCount)
        const isL1Expanded = expandedIds.has(child.id)
        return (
          <g
            key={`l2n-${child.id}`}
            visibility={isL1Expanded ? undefined : 'hidden'}
            pointerEvents={isL1Expanded ? undefined : 'none'}
          >
            {child.children!.map((grandchild, gcIndex) => {
              const gcY = getGrandchildY(childY, gcIndex, child.children!.length)
              const hasChildren = !!grandchild.children?.length
              const isExpanded = expandedIds.has(grandchild.id)
              return (
                <g
                  key={grandchild.id}
                  transform={`translate(${grandchildX}, ${gcY})`}
                  onClick={hasChildren ? () => toggleExpanded(grandchild.id) : undefined}
                  cursor={hasChildren ? 'pointer' : undefined}
                >
                  <TreeNode
                    node={grandchild}
                    radius={GRANDCHILD_RADIUS}
                    imageRadius={GRANDCHILD_IMG_R}
                    hasChildren={hasChildren}
                    isExpanded={isExpanded}
                    expandDirection="right"
                    accentColor={accentColor}
                  />
                </g>
              )
            })}
          </g>
        )
      })}

      {/* Nós L3 — auto-exibidos quando L2 expandido, sem ícone, sem clique */}
      {tree.children.map((child, index) => {
        if (!mountedIds.has(child.id) || !child.children?.length) return null
        const childY = getChildY(index, childCount)
        const isL1Expanded = expandedIds.has(child.id)
        return child.children.map((grandchild, gcIndex) => {
          if (!mountedIds.has(grandchild.id) || !grandchild.children?.length) return null
          const gcY = getGrandchildY(childY, gcIndex, child.children!.length)
          const isL2Expanded = expandedIds.has(grandchild.id)
          return (
            <g
              key={`l3n-${grandchild.id}`}
              visibility={isL1Expanded && isL2Expanded ? undefined : 'hidden'}
              pointerEvents={isL1Expanded && isL2Expanded ? undefined : 'none'}
            >
              {grandchild.children!.map((ggc, ggcIndex) => {
                const ggcY = getGreatGrandchildY(gcY, ggcIndex, grandchild.children!.length)
                return (
                  <g
                    key={ggc.id}
                    transform={`translate(${greatGrandchildX}, ${ggcY})`}
                  >
                    <TreeNode
                      node={ggc}
                      radius={GREAT_GRANDCHILD_RADIUS}
                      imageRadius={GREAT_GRANDCHILD_IMG_R}
                      fontSize={10}
                      accentColor={accentColor}
                    />
                  </g>
                )
              })}
            </g>
          )
        })
      })}

      {/* Nós L4 — auto-exibidos quando L2 expandido */}
      {tree.children.map((child, index) => {
        if (!mountedIds.has(child.id) || !child.children?.length) return null
        const childY = getChildY(index, childCount)
        const isL1Expanded = expandedIds.has(child.id)
        return child.children.map((grandchild, gcIndex) => {
          if (!mountedIds.has(grandchild.id) || !grandchild.children?.length) return null
          const gcY = getGrandchildY(childY, gcIndex, child.children!.length)
          const isL2Expanded = expandedIds.has(grandchild.id)
          return grandchild.children.map((ggc, ggcIndex) => {
            if (!ggc.children?.length) return null
            const ggcY = getGreatGrandchildY(gcY, ggcIndex, grandchild.children!.length)
            return (
              <g
                key={`l4n-${ggc.id}`}
                visibility={isL1Expanded && isL2Expanded ? undefined : 'hidden'}
                pointerEvents={isL1Expanded && isL2Expanded ? undefined : 'none'}
              >
                {ggc.children!.map((l4, l4Index) => (
                  <g
                    key={l4.id}
                    transform={`translate(${level4X}, ${getLevel4Y(ggcY, l4Index, ggc.children!.length)})`}
                  >
                    <TreeNode
                      node={l4}
                      radius={LEVEL4_RADIUS}
                      imageRadius={LEVEL4_IMG_R}
                      fontSize={8}
                      accentColor={accentColor}
                    />
                  </g>
                ))}
              </g>
            )
          })
        })
      })}
    </>
  )
}
