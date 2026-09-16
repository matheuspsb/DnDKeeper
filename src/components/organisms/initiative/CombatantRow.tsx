import type { Combatant, CombatantStatus } from '../../../types/initiative'
import { resolveImageUrl } from '../../../constants/arts'
import { useCombatantImagePicker } from '../../../hooks/useCombatantImagePicker'
import TrashIcon from '../../atoms/icons/TrashIcon'
import ImageIcon from '../../atoms/icons/ImageIcon'
import EyeIcon from '../../atoms/icons/EyeIcon'
import EyeOffIcon from '../../atoms/icons/EyeOffIcon'
import TypeBadge from '../../atoms/TypeBadge'
import InitiativeBadge from '../../molecules/initiative/InitiativeBadge'
import CombatantConditions from './CombatantConditions'
import CombatantHpControls from './CombatantHpControls'

interface CombatantRowProps {
  combatant: Combatant
  status: CombatantStatus
  onRemove: () => void
  onAdjustHp: (delta: number) => void
  onSetHp: (hp: number, maxHp: number) => void
  onUpdateInitiative: (val: number) => void
  onSetConditions: (conditions: string[]) => void
  onSetImageUrl: (url: string) => void
  onToggleHpReveal: () => void
}

function CombatantRow({
  combatant,
  status,
  onRemove,
  onAdjustHp,
  onSetHp,
  onUpdateInitiative,
  onSetConditions,
  onSetImageUrl,
  onToggleHpReveal,
}: CombatantRowProps) {
  const imagePicker = useCombatantImagePicker(onSetImageUrl)
  const isCurrent = status === 'current'

  return (
    <div className={`rounded-xl overflow-hidden ${isCurrent ? 'p-0.5 current-turn-border' : ''}`}>
      <div
        className={`relative overflow-hidden min-h-44
        ${
          isCurrent
            ? 'bg-black-300 rounded-[10px]'
            : 'bg-black-300 rounded-xl border border-black-100'
        }`}
      >
        {combatant.imageUrl && (
          <div className="absolute inset-0 pointer-events-none">
            <img
              src={resolveImageUrl(combatant.imageUrl)}
              alt="combatent image"
              aria-hidden
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-black-300/45" />
          </div>
        )}

        <div className="relative z-10 flex flex-col gap-3 p-4 h-full">
          <div className="flex items-start justify-between gap-2">
            <InitiativeBadge
              value={combatant.initiative}
              isCurrent={isCurrent}
              onUpdate={onUpdateInitiative}
            />
            <div className="flex items-center gap-1 shrink-0">
              {!combatant.isPlayer && combatant.hp !== null && (
                <button
                  onClick={onToggleHpReveal}
                  title={
                    combatant.hpRevealed
                      ? 'HP numérico visível na mesa — clique para esconder'
                      : 'HP escondido na mesa (jogadores veem só a faixa) — clique para revelar'
                  }
                  className={`flex items-center justify-center w-7 h-7 rounded-lg transition-colors cursor-pointer
                  ${combatant.hpRevealed ? 'text-yellow hover:text-yellow/80' : 'text-white-300/30 hover:text-white-300/70'}`}
                >
                  {combatant.hpRevealed ? <EyeIcon size={13} /> : <EyeOffIcon size={13} />}
                </button>
              )}
              <button
                onClick={imagePicker.open}
                title="Definir imagem"
                className={`flex items-center justify-center w-7 h-7 rounded-lg transition-colors cursor-pointer
                ${combatant.imageUrl ? 'text-white-300/70 hover:text-white-300' : 'text-white-300/30 hover:text-white-300/70'}`}
              >
                <ImageIcon size={13} />
              </button>
              <button
                onClick={onRemove}
                title="Remover"
                className="flex items-center justify-center w-7 h-7 rounded-lg text-white-300/40 hover:text-white-300 transition-colors cursor-pointer"
              >
                <TrashIcon size={13} />
              </button>
            </div>
          </div>

          {imagePicker.isOpen && (
            <div className="flex gap-1.5">
              <input
                ref={imagePicker.inputRef}
                value={imagePicker.value}
                onChange={(e) => imagePicker.setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') imagePicker.confirm()
                  if (e.key === 'Escape') imagePicker.close()
                }}
                placeholder="URL da imagem ou link do Drive..."
                className="flex-1 min-w-0 text-xs bg-black-500 border border-black-100 rounded-lg px-2 py-1.5 text-white-100 placeholder-white-300/40 outline-none focus:border-white-300/40"
              />
              <button
                onClick={imagePicker.confirm}
                className="text-xs px-2 py-1.5 rounded-lg bg-red-100 text-white-100 font-semibold cursor-pointer hover:bg-red-200 transition-colors shrink-0"
              >
                OK
              </button>
            </div>
          )}

          <div className="flex-1">
            <span
              className={`font-bold leading-tight block ${isCurrent ? 'text-white-100 text-base' : 'text-white-100 text-sm'}`}
            >
              {combatant.name}
            </span>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <TypeBadge isPlayer={combatant.isPlayer} />
            </div>
            <CombatantConditions
              combatantName={combatant.name}
              conditions={combatant.conditions ?? []}
              onSave={onSetConditions}
            />
          </div>

          {combatant.hp !== null && combatant.maxHp !== null && (
            <CombatantHpControls
              hp={combatant.hp}
              maxHp={combatant.maxHp}
              canEdit={!combatant.isPlayer}
              onAdjustHp={onAdjustHp}
              onSetHp={onSetHp}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default CombatantRow
