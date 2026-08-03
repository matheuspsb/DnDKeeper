import { useInitiative } from '../hooks/useInitiative'
import { useAdjustCharacterHp, useCharacters } from '../hooks/useCharacters'
import Button from '../components/atoms/Button'
import ChevronRightIcon from '../components/atoms/icons/ChevronRightIcon'
import RefreshIcon from '../components/atoms/icons/RefreshIcon'
import GroupHpBar from '../components/molecules/characters/GroupHpBar'
import InitiativeEmpty from '../components/molecules/initiative/InitiativeEmpty'
import CombatantRow from '../components/organisms/initiative/CombatantRow'
import InitiativeAddForm from '../components/organisms/initiative/InitiativeAddForm'

function Initiative() {
  const {
    combatants,
    currentIndex,
    round,
    addCombatant,
    removeCombatant,
    adjustHp,
    updateInitiative,
    setConditions,
    setImageUrl,
    nextTurn,
    goToTop,
    reset,
  } = useInitiative()

  const { data: characters = [] } = useCharacters()
  const adjustCharacterHp = useAdjustCharacterHp()

  function handleImportCharacters() {
    characters.forEach((char) => {
      addCombatant({
        name: char.name,
        initiative: 0,
        hp: char.currentHP,
        maxHp: char.maxHP,
        isPlayer: true,
        imageUrl: char.imageUrl || undefined,
        characterId: char.id,
      })
    })
  }

  function handleAdjustHp(combatant: (typeof combatants)[number], delta: number) {
    adjustHp(combatant.id, delta)
    if (combatant.characterId && combatant.hp !== null && combatant.maxHp !== null) {
      const newHp = Math.max(0, Math.min(combatant.maxHp, combatant.hp + delta))
      adjustCharacterHp(combatant.characterId, newHp)
    }
  }

  const partyCombatants = combatants.filter((c) => c.isPlayer && c.hp !== null && c.maxHp !== null)
  const totalGroupHP = partyCombatants.reduce((sum, c) => sum + (c.hp ?? 0), 0)
  const totalGroupMaxHP = partyCombatants.reduce((sum, c) => sum + (c.maxHp ?? 0), 0)
  const groupHpPercentage = totalGroupMaxHP > 0 ? (totalGroupHP / totalGroupMaxHP) * 100 : 0

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <h2 className="text-white-100 text-3xl font-bold">Iniciativa</h2>
            {combatants.length > 0 && (
              <span className="bg-black-400 border border-black-100 text-white-300 text-sm font-semibold px-3 py-1 rounded-full tabular-nums">
                Rodada {round}
              </span>
            )}
          </div>

          {combatants.length > 0 && (
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={reset} className="w-auto! px-4 gap-2">
                <RefreshIcon size={14} /> Resetar
              </Button>
              <Button variant="secondary" onClick={goToTop} className="w-auto! px-4">
                Ir para o topo
              </Button>
              <Button variant="primary" onClick={nextTurn} className="w-auto! px-5 gap-2">
                Próximo Turno <ChevronRightIcon size={15} />
              </Button>
            </div>
          )}
        </div>

        {partyCombatants.length > 1 && (
          <GroupHpBar
            totalHP={totalGroupHP}
            totalMaxHP={totalGroupMaxHP}
            percentage={groupHpPercentage}
          />
        )}

        {combatants.length === 0 ? (
          <InitiativeEmpty />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {combatants.map((combatant, i) => (
              <CombatantRow
                key={combatant.id}
                combatant={combatant}
                status={i === currentIndex ? 'current' : i < currentIndex ? 'done' : 'pending'}
                onRemove={() => removeCombatant(combatant.id)}
                onAdjustHp={(delta) => handleAdjustHp(combatant, delta)}
                onUpdateInitiative={(val) => updateInitiative(combatant.id, val)}
                onSetConditions={(conditions) => setConditions(combatant.id, conditions)}
                onSetImageUrl={(url) => setImageUrl(combatant.id, url)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-black-100 bg-black-500 px-8 py-4">
        <InitiativeAddForm
          onAdd={addCombatant}
          hasCharacters={characters.length > 0}
          onImportCharacters={handleImportCharacters}
        />
      </div>
    </div>
  )
}

export default Initiative
