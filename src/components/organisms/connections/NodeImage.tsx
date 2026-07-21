import type { ImagePosition } from '../../../constants/cult'
import { FILTER_ID } from './TreeFilters'

const PRESERVE_ASPECT_RATIO: Record<ImagePosition, string> = {
  top:    'xMidYMin slice',
  center: 'xMidYMid slice',
  bottom: 'xMidYMax slice',
}

interface NodeImageProps {
  nodeId: string
  imageUrl: string
  radius: number
  grayscale?: boolean
  imagePosition?: ImagePosition
}

export function NodeImage({ nodeId, imageUrl, radius, grayscale, imagePosition = 'center' }: NodeImageProps) {
  const clipId = `clip-node-${nodeId}`

  return (
    <>
      <clipPath id={clipId}>
        <circle cx={0} cy={0} r={radius} />
      </clipPath>
      <image
        href={imageUrl}
        x={-radius}
        y={-radius}
        width={radius * 2}
        height={radius * 2}
        clipPath={`url(#${clipId})`}
        preserveAspectRatio={PRESERVE_ASPECT_RATIO[imagePosition]}
        filter={grayscale ? `url(#${FILTER_ID.grayscale})` : undefined}
      />
    </>
  )
}
