import { FILTER_ID } from './TreeFilters'

interface NodeImageProps {
  nodeId: string
  imageUrl: string
  radius: number
  grayscale?: boolean
}

export function NodeImage({ nodeId, imageUrl, radius, grayscale }: NodeImageProps) {
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
        preserveAspectRatio="xMidYMid slice"
        filter={grayscale ? `url(#${FILTER_ID.grayscale})` : undefined}
      />
    </>
  )
}
