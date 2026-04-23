import Button from '../../atoms/Button'
import PlusIcon from '../../atoms/icons/PlusIcon'
import UsersIcon from '../../atoms/icons/UsersIcon'

interface CharactersEmptyProps {
  onAddCharacter: () => void
  onImportJSON: () => void
}

function CharactersEmpty({ onAddCharacter, onImportJSON }: CharactersEmptyProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 py-24">
      <div className="w-24 h-24 rounded-full bg-black-300 border border-black-100 flex items-center justify-center text-white-300/20">
        <UsersIcon size={40} />
      </div>
      <div className="text-center max-w-sm">
        <p className="text-white-100 font-semibold text-lg">Nenhum personagem ainda</p>
        <p className="text-white-300/60 text-sm mt-2 leading-relaxed">
          Adicione os personagens da campanha para acompanhar HP, XP e anotações durante as sessões.
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={onAddCharacter} className="gap-2">
          <PlusIcon size={15} /> Adicionar personagem
        </Button>
        <Button variant="secondary" onClick={onImportJSON} className="w-auto! px-5">
          Importar JSON
        </Button>
      </div>
    </div>
  )
}

export default CharactersEmpty
