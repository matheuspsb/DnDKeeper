import type { MapLocation } from '../types/mapLocation'
import type { Point } from '../hooks/useMapRuler'

export function findLocationAt(coords: Point, locations: MapLocation[]): MapLocation | undefined {
  return locations.find(
    (loc) => coords.x >= loc.x1 && coords.x <= loc.x2 && coords.y >= loc.y1 && coords.y <= loc.y2,
  )
}
