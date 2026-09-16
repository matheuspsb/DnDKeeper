import type { MapLocation } from '../../../types/mapLocation'
import CloseButton from '../../atoms/CloseButton'

type Props = {
  location: MapLocation
  screenX: number
  screenY: number
  onClose: () => void
}

export default function MapLocationPopup({ location, screenX, screenY, onClose }: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        left: screenX,
        top: screenY,
        transform: 'translate(-50%, calc(-100% - 14px))',
        zIndex: 30,
      }}
      className="w-70 bg-black-300 border border-black-100 rounded-lg shadow-2xl overflow-visible"
    >
      <div className="rounded-lg overflow-hidden">
        {location.imageUrl && (
          <img src={location.imageUrl} alt={location.name} className="w-full h-40 object-cover" />
        )}

        <div className="p-3">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-white-100 font-bold text-sm leading-tight">{location.name}</h3>
            <CloseButton onClick={onClose} size={14} className="shrink-0 mt-0.5" />
          </div>

          {location.description && (
            <p className="text-white-300 text-xs leading-relaxed mt-2">{location.description}</p>
          )}

          {location.details && (
            <p className="text-white-200 text-xs leading-relaxed mt-2 max-h-32 overflow-y-auto">
              {location.details}
            </p>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-black-300 border-b border-r border-black-100 rotate-45" />
    </div>
  )
}
