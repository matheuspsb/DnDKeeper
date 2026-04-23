import SwordsIcon from '../../atoms/icons/SwordsIcon'

function InitiativeEmpty() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 py-24">
      <div className="w-24 h-24 rounded-full bg-black-300 border border-black-100 flex items-center justify-center text-white-300/20">
        <SwordsIcon size={40} />
      </div>
      <div className="text-center max-w-sm">
        <p className="text-white-100 font-semibold text-lg">Nenhum combatente</p>
        <p className="text-white-300/60 text-sm mt-2 leading-relaxed">
          Adicione personagens e monstros abaixo para iniciar o controle de turnos.
        </p>
      </div>
    </div>
  )
}

export default InitiativeEmpty
