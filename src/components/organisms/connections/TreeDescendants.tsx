import type { HierarchyNode } from '../../../constants/cult'
import { TreeConnector } from './TreeConnector'
import { TreeNode } from './TreeNode'
import { getSpreadPosition } from './treeGeometry'

export interface TreeLevelStyle {
  radius: number
  imageRadius: number
  acrossSpacing: number
  fontSize?: number
  clickable?: boolean
}

interface TreeDescendantsProps {
  nodes: HierarchyNode[]
  depth: number
  parentAlong: number
  parentAcross: number
  parentRadius: number
  alongByDepth: number[]
  levels: TreeLevelStyle[]
  direction: 'right' | 'down' | 'left'
  expandedIds: Set<string>
  mountedIds: Set<string>
  onToggle: (nodeId: string, siblingIds: string[]) => void
  wasJustClick: () => boolean
  visible: boolean
  accentColor?: string
  hideParentConnector?: boolean
}

function toPoint(along: number, across: number, direction: 'right' | 'down' | 'left') {
  return direction === 'down' ? { x: across, y: along } : { x: along, y: across }
}

export function TreeDescendants({
  nodes,
  depth,
  parentAlong,
  parentAcross,
  parentRadius,
  alongByDepth,
  levels,
  direction,
  expandedIds,
  mountedIds,
  onToggle,
  wasJustClick,
  visible,
  accentColor,
  hideParentConnector,
}: TreeDescendantsProps) {
  const style = levels[depth - 1]
  if (!style) return null

  const along = alongByDepth[depth - 1]
  const count = nodes.length
  const clickable = style.clickable ?? true
  const parentPoint = toPoint(parentAlong, parentAcross, direction)
  const siblingIds = nodes.map((n) => n.id)

  return (
    <>
      {nodes.map((node, index) => {
        const across = getSpreadPosition(parentAcross, index, count, style.acrossSpacing)
        const point = toPoint(along, across, direction)
        const hasChildren = !!node.children?.length
        const isExpanded = clickable ? expandedIds.has(node.id) : true
        const canRecurse = hasChildren && (clickable ? mountedIds.has(node.id) : true)

        return (
          <g
            key={node.id}
            visibility={visible ? undefined : 'hidden'}
            pointerEvents={visible ? undefined : 'none'}
          >
            {!hideParentConnector && (
              <TreeConnector
                direction={direction}
                fromCenterX={parentPoint.x}
                fromCenterY={parentPoint.y}
                fromRadius={parentRadius}
                toCenterX={point.x}
                toCenterY={point.y}
                toRadius={style.radius}
                status={node.status}
              />
            )}

            <g
              transform={`translate(${point.x}, ${point.y})`}
              onClick={
                clickable && hasChildren
                  ? () => {
                      if (wasJustClick()) onToggle(node.id, siblingIds)
                    }
                  : undefined
              }
              cursor={clickable && hasChildren ? 'pointer' : undefined}
            >
              <TreeNode
                node={node}
                radius={style.radius}
                imageRadius={style.imageRadius}
                hasChildren={clickable ? hasChildren : undefined}
                isExpanded={clickable ? isExpanded : undefined}
                fontSize={style.fontSize}
                expandDirection={direction}
                accentColor={accentColor}
              />
            </g>

            {canRecurse && (
              <TreeDescendants
                nodes={node.children!}
                depth={depth + 1}
                parentAlong={along}
                parentAcross={across}
                parentRadius={style.radius}
                alongByDepth={alongByDepth}
                levels={levels}
                direction={direction}
                expandedIds={expandedIds}
                mountedIds={mountedIds}
                onToggle={onToggle}
                wasJustClick={wasJustClick}
                visible={visible && isExpanded}
                accentColor={accentColor}
              />
            )}
          </g>
        )
      })}
    </>
  )
}
