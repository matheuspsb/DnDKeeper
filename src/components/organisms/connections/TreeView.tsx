import { useEffect } from 'react'
import type { HierarchyTree } from '../../../constants/cult'
import { useCanvasInteraction } from '../../../hooks/useCanvasInteraction'
import { TreeFilters } from './TreeFilters'
import { DownTree, getDownTreeWidth } from './DownTree'
import { RightTree } from './RightTree'
import { computeLayout } from './treeLayout.utils'

const INITIAL_ZOOM = 0.7

interface TreeViewProps {
  trees: HierarchyTree[]
}

export function TreeView({ trees }: TreeViewProps) {
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

  const layout = computeLayout(trees)

  useEffect(() => {
    const firstDown = layout.downTrees[0]
    const worldCenterX = firstDown
      ? layout.downOffsets[0].x + getDownTreeWidth(firstDown) / 2
      : (layout.rightOffsets[0]?.x ?? 400)
    centerContent(worldCenterX, 400, INITIAL_ZOOM)
  }, [])

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
        {layout.downTrees.map((tree, index) => (
          <g
            key={tree.root.faction || index}
            transform={`translate(${layout.downOffsets[index].x}, ${layout.downOffsets[index].y})`}
          >
            <DownTree tree={tree} wasJustClick={wasJustClick} />
          </g>
        ))}

        {layout.rightTrees.map((tree, index) => (
          <g
            key={tree.root.faction || `right-${index}`}
            transform={`translate(${layout.rightOffsets[index].x}, ${layout.rightOffsets[index].y})`}
          >
            <RightTree tree={tree} wasJustClick={wasJustClick} />
          </g>
        ))}
      </g>
    </svg>
  )
}
