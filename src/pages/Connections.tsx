import type { HierarchyNode, HierarchyTree } from '../constants/cult'
import { CULT_TREE } from '../constants/cult'

const STROKE: Record<HierarchyNode['status'], string> = {
  vivo: '#7c3aed',
  morto: '#7f1d1d',
  desconhecido: '#374151',
  desaparecido: '#facc15',
}

const NODE_FILL: Record<HierarchyNode['status'], string> = {
  vivo: '#1e1030',
  morto: '#1c0f0f',
  desconhecido: '#17181c',
  desaparecido: '#1e1030',
}

const PAD_X = 80
const ROOT_R = 52
const CHILD_R = 42
const IMG_R = CHILD_R - 3
const ROOT_Y = 100
const CHILD_Y = 300
const SVG_HEIGHT = 480

function TreeView({ tree }: { tree: HierarchyTree }) {
  const n = tree.children.length
  const svgWidth = Math.max(1280, PAD_X * 2 + (n - 1) * 100)
  const spacing = (svgWidth - PAD_X * 2) / (n - 1)
  const rootX = svgWidth / 2
  const cx = (i: number) => PAD_X + i * spacing

  return (
    <svg width={svgWidth} height={SVG_HEIGHT}>
      <defs>
        <filter id="glow-root" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-node" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="blur-dead">
          <feColorMatrix type="saturate" values="0" />
        </filter>
        {tree.children.map((child) =>
          child.imageUrl ? (
            <clipPath key={child.id} id={`clip-${child.id}`}>
              <circle cx={0} cy={0} r={IMG_R} />
            </clipPath>
          ) : null,
        )}
      </defs>

      {tree.children.map((child, i) => {
        const dead = child.status === 'morto'
        return (
          <path
            key={i}
            d={`M ${rootX} ${ROOT_Y + ROOT_R} C ${rootX} ${ROOT_Y + ROOT_R + 70}, ${cx(i)} ${CHILD_Y - CHILD_R - 70}, ${cx(i)} ${CHILD_Y - CHILD_R}`}
            fill="none"
            stroke={dead ? '#7f1d1d' : '#2d2f3a'}
            strokeWidth={dead ? 1 : 1.5}
            strokeDasharray={dead ? '4 4' : undefined}
            strokeOpacity={dead ? 0.6 : 1}
          />
        )
      })}

      {/* Root node */}
      <g transform={`translate(${rootX}, ${ROOT_Y})`}>
        <circle
          r={ROOT_R}
          fill="#120a1e"
          stroke="#7c3aed"
          strokeWidth={2}
          filter="url(#glow-root)"
        />
        <text y={-6} textAnchor="middle" fill="#a78bfa" fontSize={22} fontWeight="bold">
          ?
        </text>
        <text y={12} textAnchor="middle" fill="#c4b5fd" fontSize={11} fontWeight="600">
          {tree.root.label}
        </text>
        <text y={ROOT_R + 18} textAnchor="middle" fill="#6b7280" fontSize={10}>
          {tree.root.faction}
        </text>
      </g>

      {/* Child nodes */}
      {tree.children.map((child, i) => {
        const x = cx(i)
        const known = child.status !== 'desconhecido'

        return (
          <g key={child.id} transform={`translate(${x}, ${CHILD_Y})`}>
            {known && (
              <circle
                r={CHILD_R + 5}
                fill="none"
                stroke={STROKE[child.status]}
                strokeWidth={1}
                strokeOpacity={0.25}
                filter="url(#glow-node)"
              />
            )}

            <circle
              r={CHILD_R}
              fill={NODE_FILL[child.status]}
              stroke={STROKE[child.status]}
              strokeWidth={known ? 2 : 1.5}
              strokeDasharray={!known ? '5 3' : undefined}
            />

            {child.imageUrl ? (
              <image
                href={child.imageUrl}
                x={-IMG_R}
                y={-IMG_R}
                width={IMG_R * 2}
                height={IMG_R * 2}
                clipPath={`url(#clip-${child.id})`}
                preserveAspectRatio="xMidYMid slice"
                filter={child.status === 'morto' ? 'url(#blur-dead)' : undefined}
              />
            ) : (
              <text y={5} textAnchor="middle" fill="#4b5563" fontSize={20}>
                ?
              </text>
            )}

            <text
              y={CHILD_R + 17}
              textAnchor="middle"
              fill={known ? '#e5e7eb' : '#6b7280'}
              fontSize={11}
              fontWeight={known ? '600' : '400'}
            >
              {child.label}
            </text>
            {child.name && (
              <text y={CHILD_R + 31} textAnchor="middle" fill="#a78bfa" fontSize={10}>
                {child.name}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function Connections() {
  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 px-8 pt-6 pb-4">
        <h2 className="text-white-100 text-3xl font-bold">Conexões</h2>
        <p className="text-white-300/40 text-sm mt-1">Hierarquias e relações entre facções</p>
      </div>

      <div className="flex-1 overflow-auto px-8 pb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-purple-400/60 mb-4">
          Culto do Dragão
        </p>
        <div className="overflow-x-auto">
          <TreeView tree={CULT_TREE} />
        </div>
      </div>
    </div>
  )
}

export default Connections
