import { useCallback, useEffect } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { Npc } from '../../types/npc.types'
import type { NpcRelation } from '../../types/npcRelation.types'
import { FACTION_COLOR } from '../../constants/npc.constants'
import { npcNodeTypes } from './NpcNode'
import { buildNodes, buildEdges } from './npcGraph.utils'
import NpcRelationLegend from './NpcRelationLegend'
import NpcRelationPanel from './NpcRelationPanel'

interface NpcGraphProps {
  npcs: Npc[]
  relations: NpcRelation[]
  onDeleteRelation: (id: string) => void
}

function NpcGraph({ npcs, relations, onDeleteRelation }: NpcGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(buildNodes(npcs))
  const [edges, setEdges, onEdgesChange] = useEdgesState(buildEdges(relations, onDeleteRelation))

  useEffect(() => {
    setEdges(buildEdges(relations, onDeleteRelation))
  }, [relations, onDeleteRelation, setEdges])

  useEffect(() => {
    setNodes(prev => {
      const prevMap = new Map(prev.map(n => [n.id, n]))
      const activeIds = new Set(npcs.map(n => n.id))
      const updated = prev
        .filter(n => activeIds.has(n.id))
        .map(n => {
          const npc = npcs.find(p => p.id === n.id)
          return npc ? { ...n, data: { npc } } : n
        })
      const existingIds = new Set(prevMap.keys())
      const added = buildNodes(npcs).filter(n => !existingIds.has(n.id))
      return [...updated, ...added]
    })
  }, [npcs, setNodes])

  const onConnect = useCallback<OnConnect>(
    (connection) => setEdges(eds => addEdge(connection, eds)),
    [setEdges],
  )

  if (npcs.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-white-300/40 text-sm">
        Cadastre NPCs na aba de NPCs para visualizar conexões aqui.
      </div>
    )
  }

  return (
    <div className="flex-1 relative" style={{ minHeight: 0 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={npcNodeTypes}
        fitView
        colorMode="dark"
        className="bg-black-500"
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#34353E" />
        <Controls className="[&>button]:bg-black-300 [&>button]:border-black-100 [&>button]:text-white-300 [&>button:hover]:bg-black-200" />
        <MiniMap
          nodeColor={node => {
            const npc = npcs.find(n => n.id === node.id)
            return npc ? FACTION_COLOR[npc.faction] : '#34353E'
          }}
          className="bg-black-400! border border-black-100 rounded-lg overflow-hidden"
        />
      </ReactFlow>

      <NpcRelationLegend />
      <NpcRelationPanel edges={edges} onDeleteRelation={onDeleteRelation} />
    </div>
  )
}

export default NpcGraph
