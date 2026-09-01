import type { SpotlightImage } from '../../../types/initiative'

interface SpotlightImageLayerProps {
  spotlight: SpotlightImage | null
}

function SpotlightImageLayer({ spotlight }: SpotlightImageLayerProps) {
  if (!spotlight) return null

  return (
    <div className="spotlight-in fixed inset-0 z-60 flex items-center justify-center bg-black p-4">
      <img
        src={spotlight.url}
        alt={spotlight.label ?? ''}
        className="max-h-full max-w-full object-contain"
      />
      {spotlight.label && (
        <p className="absolute inset-x-0 bottom-5 text-center text-sm tracking-wide text-white-300/50">
          {spotlight.label}
        </p>
      )}
    </div>
  )
}

export default SpotlightImageLayer
