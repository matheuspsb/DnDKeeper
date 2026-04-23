import { useCallback, useEffect } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  addEdge,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeTypes,
  type OnConnect,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { Npc } from '../../types/npc.types'
import type { NpcRelation } from '../../types/npcRelation.types'
import { FACTION_COLOR, NPC_STATUS_COLOR, RELATION_TYPE_COLOR, RELATION_TYPE_LABEL } from '../../constants/npc.constants'
import { resolveImageUrl } from '../../constants/arts'
import MaskIcon from '../atoms/icons/MaskIcon'
import NpcRelationLegend from './NpcRelationLegend'
import NpcRelationPanel from './NpcRelationPanel'

interface NpcNodeData {
  npc: Npc
  [key: string]: unknown
}

interface NpcNodeProps {
  data: NpcNodeData
}

function NpcNode({ data }: NpcNodeProps) {
  const { npc } = data
  const factionColor = FACTION_COLOR[npc.faction]
  const statusColor = NPC_STATUS_COLOR[npc.status]

  return (
    <>
      <Handle type="source" id="s-top"    position={Position.Top}    style={{ opacity: 0 }} />
      <Handle type="source" id="s-bottom" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="source" id="s-left"   position={Position.Left}   style={{ opacity: 0 }} />
      <Handle type="source" id="s-right"  position={Position.Right}  style={{ opacity: 0 }} />
      <Handle type="target" id="t-top"    position={Position.Top}    style={{ opacity: 0 }} />
      <Handle type="target" id="t-bottom" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="target" id="t-left"   position={Position.Left}   style={{ opacity: 0 }} />
      <Handle type="target" id="t-right"  position={Position.Right}  style={{ opacity: 0 }} />
      <div
        className="bg-black-300 border-2 rounded-xl overflow-hidden shadow-xl w-36"
        style={{ borderColor: factionColor }}
      >
      <div className="h-24 relative bg-black-400">
        {npc.imageUrl ? (
          <img
            src={resolveImageUrl(npc.imageUrl)}
            alt={npc.name}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white-300/20">
            <MaskIcon size={32} />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-black-300 to-transparent pointer-events-none" />
        <span
          className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full border border-black-300"
          style={{ backgroundColor: statusColor }}
          title={npc.status}
        />
      </div>
      <div className="px-2.5 py-2">
        <p className="text-white-100 text-xs font-bold leading-tight truncate">{npc.name}</p>
        <p className="text-xs mt-0.5 truncate font-medium" style={{ color: factionColor }}>
          {npc.faction}
        </p>
      </div>
      </div>
    </>
  )
}

const nodeTypes: NodeTypes = { npc: NpcNode }

interface NpcGraphProps {
  npcs: Npc[]
  relations: NpcRelation[]
  onDeleteRelation: (id: string) => void
}

function buildInitialNodes(npcs: Npc[]): Node[] {
  const cols = 4
  const spacingX = 220
  const spacingY = 220

  return npcs.map((npc, i) => ({
    id: npc.id,
    type: 'npc',
    position: {
      x: (i % cols) * spacingX + 60,
      y: Math.floor(i / cols) * spacingY + 60,
    },
    data: { npc },
  }))
}

function buildEdges(relations: NpcRelation[], onDelete: (id: string) => void): Edge[] {
  const seen = new Set<string>()

  return relations.reduce<Edge[]>((acc, rel) => {
    const key = [rel.sourceId, rel.targetId].sort().join('|') + rel.type
    if (seen.has(key)) return acc
    seen.add(key)

    const color = RELATION_TYPE_COLOR[rel.type]
    acc.push({
      id: rel.id,
      source: rel.sourceId,
      target: rel.targetId,
      label: rel.label || RELATION_TYPE_LABEL[rel.type],
      type: 'smoothstep',
      style: { stroke: color, strokeWidth: 2 },
      labelStyle: { fill: color, fontSize: 10, fontWeight: 600 },
      labelBgStyle: { fill: '#27282F', fillOpacity: 0.85 },
      markerEnd: undefined,
      data: { onDelete, relId: rel.id },
    })
    return acc
  }, [])
}

function NpcGraph({ npcs, relations, onDeleteRelation }: NpcGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(buildInitialNodes(npcs))
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
      const added = buildInitialNodes(npcs).filter(n => !existingIds.has(n.id))
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
        nodeTypes={nodeTypes}
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
