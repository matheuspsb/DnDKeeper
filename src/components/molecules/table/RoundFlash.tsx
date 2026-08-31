interface RoundFlashProps {
  round: number
  visible: boolean
}

function RoundFlash({ round, visible }: RoundFlashProps) {
  if (!visible) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
      <span className="round-flash text-6xl font-bold uppercase tracking-[0.2em] text-red-100 md:text-8xl">
        Rodada {round}
      </span>
    </div>
  )
}

export default RoundFlash
