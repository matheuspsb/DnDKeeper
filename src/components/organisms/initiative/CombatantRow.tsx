import { useState, useRef } from 'react'
import type { Combatant, CombatantStatus } from '../../../types/initiative'
import { HP_DELTAS } from '../../../constants/initiative'
import { resolveImageUrl } from '../../../constants/arts'
import TrashIcon from '../../atoms/icons/TrashIcon'
import ImageIcon from '../../atoms/icons/ImageIcon'
import TypeBadge from '../../atoms/TypeBadge'
import InitiativeBadge from '../../molecules/initiative/InitiativeBadge'
import ConditionBadge from '../../molecules/initiative/ConditionBadge'
import ConditionModal from './ConditionModal'

function parseDriveUrl(input: string): string {
  const match = input.match(/\/d\/([a-zA-Z0-9_-]+)/)
  if (match) return `/drive-img?id=${match[1]}&sz=w800`
  return input
}

interface CombatantRowProps {
  combatant: Combatant
  status: CombatantStatus
  onRemove: () => void
  onAdjustHp: (delta: number) => void
  onUpdateInitiative: (val: number) => void
  onSetConditions: (conditions: string[]) => void
  onSetImageUrl: (url: string) => void
}

function CombatantRow({
  combatant,
  status,
  onRemove,
  onAdjustHp,
  onUpdateInitiative,
  onSetConditions,
  onSetImageUrl,
}: CombatantRowProps) {
  const [conditionModalOpen, setConditionModalOpen] = useState(false)
  const [imageInputOpen, setImageInputOpen] = useState(false)
  const [imageInputValue, setImageInputValue] = useState('')
  const imageInputRef = useRef<HTMLInputElement>(null)

  function handleOpenImageInput() {
    setImageInputValue('')
    setImageInputOpen(true)
    setTimeout(() => imageInputRef.current?.focus(), 0)
  }

  function handleConfirmImage() {
    if (imageInputValue.trim()) onSetImageUrl(parseDriveUrl(imageInputValue.trim()))
    setImageInputOpen(false)
  }
  const isCurrent = status === 'current'

  const hpPercent =
    combatant.hp !== null && combatant.maxHp !== null && combatant.maxHp > 0
      ? Math.round((combatant.hp / combatant.maxHp) * 100)
      : null

  const hpColor =
    hpPercent === null
      ? '#C0C0C0'
      : hpPercent > 50
        ? '#4ade80'
        : hpPercent > 25
          ? '#facc15'
          : '#D72334'

  return (
    <>
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
                <button
                  onClick={handleOpenImageInput}
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

            {imageInputOpen && (
              <div className="flex gap-1.5">
                <input
                  ref={imageInputRef}
                  value={imageInputValue}
                  onChange={(e) => setImageInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleConfirmImage()
                    if (e.key === 'Escape') setImageInputOpen(false)
                  }}
                  placeholder="URL da imagem ou link do Drive..."
                  className="flex-1 min-w-0 text-xs bg-black-500 border border-black-100 rounded-lg px-2 py-1.5 text-white-100 placeholder-white-300/40 outline-none focus:border-white-300/40"
                />
                <button
                  onClick={handleConfirmImage}
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
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                {(combatant.conditions ?? []).map((c) => (
                  <ConditionBadge key={c} label={c} />
                ))}
                <button
                  onClick={() => setConditionModalOpen(true)}
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded border border-dashed border-white-300/30 text-white-300/60 hover:text-white-300 hover:border-white-300/60 transition-colors cursor-pointer leading-tight shrink-0"
                >
                  {(combatant.conditions?.length ?? 0) > 0 ? 'Editar' : '+ Condição'}
                </button>
              </div>
            </div>

            {combatant.hp !== null && combatant.maxHp !== null && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium" style={{ color: hpColor }}>
                    ♥ HP
                  </span>
                  <span className="tabular-nums font-semibold" style={{ color: hpColor }}>
                    {combatant.hp} / {combatant.maxHp}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-black-500/80 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${hpPercent}%`, backgroundColor: hpColor }}
                  />
                </div>
              </div>
            )}

            {combatant.hp !== null && (
              <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  {HP_DELTAS.filter((delta) => delta < 0).map((delta) => (
                    <button
                      key={delta}
                      onClick={() => onAdjustHp(delta)}
                      className="flex-1 text-xs font-semibold py-1.5 rounded-lg border transition-colors cursor-pointer border-red-400/40 text-red-100/80 bg-black-500/60 hover:text-white-100 hover:bg-red-100 hover:border-red-100"
                    >
                      {delta}
                    </button>
                  ))}
                </div>
                <div className="flex gap-1">
                  {HP_DELTAS.filter((delta) => delta > 0).map((delta) => (
                    <button
                      key={delta}
                      onClick={() => onAdjustHp(delta)}
                      className="flex-1 text-xs font-semibold py-1.5 rounded-lg border transition-colors cursor-pointer border-black-100/60 text-white-300/70 hover:text-white-100 bg-black-500/60 hover:bg-black-400/80"
                    >
                      +{delta}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {conditionModalOpen && (
        <ConditionModal
          combatantName={combatant.name}
          active={combatant.conditions ?? []}
          onSave={onSetConditions}
          onClose={() => setConditionModalOpen(false)}
        />
      )}
    </>
  )
}

export default CombatantRow
