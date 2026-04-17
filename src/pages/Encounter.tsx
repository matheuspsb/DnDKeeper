import { useEncounter } from '../hooks/useEncounter'
import { useCharacters } from '../hooks/useCharacters'
import EncounterPartyPanel from '../components/organisms/EncounterPartyPanel'
import EncounterMonstersPanel from '../components/organisms/EncounterMonstersPanel'
import EncounterResultPanel from '../components/organisms/EncounterResultPanel'

function Encounter() {
  const { characters } = useCharacters()
  const {
    party,
    monsters,
    result,
    addPartyMember,
    updatePartyMember,
    removePartyMember,
    importFromCharacters,
    addMonster,
    updateMonster,
    removeMonster,
    clearMonsters,
  } = useEncounter()

  const monsterCount = monsters.reduce((s, m) => s + m.quantity, 0)

  return (
    <div className="flex flex-col gap-6 p-8 min-h-full">
      <div>
        <h2 className="text-white-100 text-3xl font-bold">Calculadora de Encontro</h2>
        <p className="text-white-300/60 text-sm mt-1">
          Configure o grupo e os monstros para calcular a dificuldade do encontro
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <EncounterPartyPanel
          party={party}
          onAdd={addPartyMember}
          onUpdate={updatePartyMember}
          onRemove={removePartyMember}
          onImportCharacters={() => importFromCharacters(characters)}
          hasCharacters={characters.length > 0}
        />
        <EncounterMonstersPanel
          monsters={monsters}
          onAdd={addMonster}
          onUpdate={updateMonster}
          onRemove={removeMonster}
          onClear={clearMonsters}
        />
      </div>

      <EncounterResultPanel
        result={result}
        partySize={party.length}
        monsterCount={monsterCount}
      />
    </div>
  )
}

export default Encounter
