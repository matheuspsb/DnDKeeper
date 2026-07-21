import type { NpcStatus } from '../../../types/npc.types'

const CONNECTOR_COLOR: Record<NpcStatus, string> = {
  vivo:         '#2d2f3a',
  morto:        '#7f1d1d',
  desconhecido: '#2d2f3a',
  desaparecido: '#2d2f3a',
}

const CONTROL_POINT_OFFSET = 70

interface TreeConnectorProps {
  fromCenterX: number
  fromCenterY: number
  fromRadius: number
  toCenterX: number
  toCenterY: number
  toRadius: number
  status: NpcStatus
}

export function TreeConnector({
  fromCenterX,
  fromCenterY,
  fromRadius,
  toCenterX,
  toCenterY,
  toRadius,
  status,
}: TreeConnectorProps) {
  const isDead = status === 'morto'

  const startY     = fromCenterY + fromRadius
  const endY       = toCenterY - toRadius
  const controlY1  = startY + CONTROL_POINT_OFFSET
  const controlY2  = endY - CONTROL_POINT_OFFSET

  const path = `M ${fromCenterX} ${startY} C ${fromCenterX} ${controlY1}, ${toCenterX} ${controlY2}, ${toCenterX} ${endY}`

  return (
    <path
      d={path}
      fill="none"
      stroke={CONNECTOR_COLOR[status]}
      strokeWidth={isDead ? 1 : 1.5}
      strokeDasharray={isDead ? '4 4' : undefined}
      strokeOpacity={isDead ? 0.6 : 1}
    />
  )
}
