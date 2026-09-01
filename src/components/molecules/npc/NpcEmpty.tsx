import MaskIcon from '../../atoms/icons/MaskIcon'

interface NpcEmptyProps {
  onAdd: () => void
}

function NpcEmpty({ onAdd }: NpcEmptyProps) {
  return (
    <div className="flex flex-col items-center gap-5 py-24 text-center">
      <div className="text-bone-400/20">
        <MaskIcon size={56} />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="font-display text-xl font-semibold tracking-widest text-bone-100 uppercase">
          Arquivo vazio
        </p>
        <p className="max-w-sm font-body text-[15px] leading-relaxed text-bone-300">
          Nenhuma ficha registrada. Comece pelos rostos que a mesa vai encontrar primeiro.
        </p>
      </div>
      <button
        onClick={onAdd}
        className="border border-brass/50 px-5 py-2.5 font-mono text-[12px] tracking-[0.12em] text-brass uppercase transition-colors hover:bg-brass/10"
      >
        Abrir a primeira ficha
      </button>
    </div>
  )
}

export default NpcEmpty
