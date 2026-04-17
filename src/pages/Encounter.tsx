import { useCallback } from 'react'
import { useEncounter } from '../hooks/useEncounter'
import { useCharacters } from '../hooks/useCharacters'
import { useEncounterHistory } from '../hooks/useEncounterHistory'
import type { EncounterSnapshot } from '../types/encounter'
import EncounterPartyPanel from '../components/organisms/EncounterPartyPanel'
import EncounterMonstersPanel from '../components/organisms/EncounterMonstersPanel'
import EncounterResultPanel from '../components/organisms/EncounterResultPanel'
import EncounterHistoryPanel from '../components/organisms/EncounterHistoryPanel'
import Button from '../components/atoms/Button'

function Encounter() {
  const { characters, addXp } = useCharacters()
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

  const { history, saveEncounter, markAllSent, deleteSnapshot, clearHistory } = useEncounterHistory()

  const monsterCount = monsters.reduce((total, monster) => total + monster.quantity, 0)

  const handleSave = useCallback(() => {
    saveEncounter(party, monsters, result)
  }, [saveEncounter, party, monsters, result])

  const distributeXp = useCallback(
    (snapshots: EncounterSnapshot[]) => {
      snapshots.forEach(snapshot => {
        snapshot.party.forEach(member => {
          addXp(member.id, snapshot.xpPerPlayer)
        })
      })
    },
    [addXp],
  )

  const handleSendXp = useCallback(
    (id: string) => {
      const snapshot = history.find(s => s.id === id)
      if (!snapshot || snapshot.xpSent) return
      distributeXp([snapshot])
      markAllSent([id])
    },
    [history, distributeXp, markAllSent],
  )

  const handleSendAll = useCallback(() => {
    const unsent = history.filter(snapshot => !snapshot.xpSent)
    if (unsent.length === 0) return
    distributeXp(unsent)
    markAllSent(unsent.map(snapshot => snapshot.id))
  }, [history, distributeXp, markAllSent])

  return (
    <div className="flex flex-col gap-6 p-8 min-h-full">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-white-100 text-3xl font-bold">Calculadora de Encontro</h2>
          <p className="text-white-300/60 text-sm mt-1">
            Configure o grupo e os monstros para calcular a dificuldade do encontro
          </p>
        </div>
        {result.rawXp > 0 && party.length > 0 && (
          <Button variant="secondary" onClick={handleSave} className="w-auto! px-4 gap-2 shrink-0">
            Salvar Combate
          </Button>
        )}
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

      <EncounterHistoryPanel
        history={history}
        onSendXp={handleSendXp}
        onSendAll={handleSendAll}
        onDelete={deleteSnapshot}
        onClear={clearHistory}
      />
    </div>
  )
}

export default Encounter
