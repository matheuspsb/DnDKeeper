import { memo } from 'react'
import type { Point, RulerMode } from '../../hooks/useMapRuler'

const MARKER_PX = 7
const STROKE_PX = 2
const DASH_PX = 16
const GAP_PX = 8
const FONT_PX = 26

type MapSvgOverlayProps = {
  imgSize: { width: number; height: number }
  points: Point[]
  mousePos: Point | null
  mode: RulerMode
  distance: string | null
  midpoint: Point | null
  previewLabel: string | null
  showPreviewLine: boolean
  currentScale: number
}

const MapSvgOverlay = memo(function MapSvgOverlay({
  imgSize,
  points,
  mousePos,
  mode,
  distance,
  midpoint,
  previewLabel,
  showPreviewLine,
  currentScale,
}: MapSvgOverlayProps) {
  const markerRadius = MARKER_PX / currentScale
  const strokeWidth = STROKE_PX / currentScale
  const strokeDasharray = `${DASH_PX / currentScale} ${GAP_PX / currentScale}`
  const fontSize = FONT_PX / currentScale

  const rulerColor = mode === 'calibrating' ? '#ECC83B' : '#D72334'
  const rulerColorFill = mode === 'calibrating' ? '#ECC83B33' : '#D7233433'

  return (
    <svg
      width={imgSize.width}
      height={imgSize.height}
      viewBox={`0 0 ${imgSize.width} ${imgSize.height}`}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', userSelect: 'none' }}
    >
      {showPreviewLine && mousePos && (
        <>
          <line
            x1={points[0].x}
            y1={points[0].y}
            x2={mousePos.x}
            y2={mousePos.y}
            stroke={rulerColor}
            strokeWidth={strokeWidth * 2}
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            opacity={0.6}
          />
          {previewLabel && (
            <text
              x={(points[0].x + mousePos.x) / 2}
              y={(points[0].y + mousePos.y) / 2 - markerRadius * 2.5}
              fontSize={fontSize}
              textAnchor="middle"
              dominantBaseline="auto"
              fill="white"
              stroke="#17181C"
              strokeWidth={fontSize * 0.18}
              paintOrder="stroke"
              fontWeight="600"
              opacity={0.7}
            >
              {previewLabel}
            </text>
          )}
        </>
      )}

      {points.length === 2 && (
        <line
          x1={points[0].x}
          y1={points[0].y}
          x2={points[1].x}
          y2={points[1].y}
          stroke={rulerColor}
          strokeWidth={strokeWidth * 2}
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
        />
      )}

      {points.map((point, index) => (
        <g key={index}>
          <circle cx={point.x} cy={point.y} r={markerRadius * 1.8} fill={rulerColorFill} />
          <circle
            cx={point.x}
            cy={point.y}
            r={markerRadius}
            fill={rulerColor}
            stroke="white"
            strokeWidth={strokeWidth}
          />
        </g>
      ))}

      {distance && midpoint && (
        <text
          x={midpoint.x}
          y={midpoint.y - markerRadius * 2.5}
          fontSize={fontSize}
          textAnchor="middle"
          dominantBaseline="auto"
          fill="white"
          stroke="#17181C"
          strokeWidth={fontSize * 0.18}
          paintOrder="stroke"
          fontWeight="600"
        >
          {distance}
        </text>
      )}
    </svg>
  )
})

export default MapSvgOverlay
