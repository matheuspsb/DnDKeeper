import MaskIcon from '../atoms/icons/MaskIcon'

interface NpcEmptyProps {
  onAdd: () => void
}

function NpcEmpty({ onAdd }: NpcEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="text-white-300/20">
        <MaskIcon size={56} />
      </div>
      <div>
        <p className="text-white-300 font-medium">Nenhum NPC cadastrado</p>
        <p className="text-white-300/50 text-sm mt-1">Adicione personagens não-jogáveis da sua campanha</p>
      </div>
      <button
        onClick={onAdd}
        className="text-sm font-medium text-red-100 hover:text-red-200 underline underline-offset-4 transition-colors cursor-pointer"
      >
        Adicionar primeiro NPC
      </button>
    </div>
  )
}

export default NpcEmpty
