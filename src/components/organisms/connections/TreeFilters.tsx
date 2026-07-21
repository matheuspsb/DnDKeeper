export const FILTER_ID = {
  glowRoot: 'glow-root',
  glowNode: 'glow-node',
  grayscale: 'filter-grayscale',
} as const

export function TreeFilters() {
  return (
    <>
      <filter id={FILTER_ID.glowRoot} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <filter id={FILTER_ID.glowNode} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <filter id={FILTER_ID.grayscale}>
        <feColorMatrix type="saturate" values="0" />
      </filter>
    </>
  )
}
