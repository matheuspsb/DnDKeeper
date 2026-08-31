import type { PartyMember } from '../../../types/encounter'
import Input from '../../atoms/Input'
import Button from '../../atoms/Button'
import PlusIcon from '../../atoms/icons/PlusIcon'
import TrashIcon from '../../atoms/icons/TrashIcon'
import UsersIcon from '../../atoms/icons/UsersIcon'

interface XpPartyPanelProps {
  party: PartyMember[]
  onAdd: () => void
  onUpdate: (id: string, data: Partial<Omit<PartyMember, 'id'>>) => void
  onRemove: (id: string) => void
  onImportCharacters: () => void
  hasCharacters: boolean
}

const LEVELS = Array.from({ length: 20 }, (_, i) => i + 1)

function XpPartyPanel({
  party,
  onAdd,
  onUpdate,
  onRemove,
  onImportCharacters,
  hasCharacters,
}: XpPartyPanelProps) {
  return (
    <div className="bg-black-300 border border-black-100 rounded-xl flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-black-100">
        <div className="flex items-center gap-2">
          <span className="text-white-100 font-semibold text-sm">Grupo</span>
          {party.length > 0 && (
            <span className="text-[10px] bg-black-400 border border-black-100 text-white-300 px-2 py-0.5 rounded-full">
              {party.length} jogador{party.length !== 1 ? 'es' : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasCharacters && (
            <button
              type="button"
              onClick={onImportCharacters}
              className="flex items-center gap-1.5 text-xs text-white-300/60 hover:text-white-300 transition-colors"
            >
              <UsersIcon size={13} />
              Importar
            </button>
          )}
          <button
            type="button"
            onClick={onAdd}
            className="flex items-center gap-1 text-xs text-red-100 hover:text-red-200 transition-colors font-medium"
          >
            <PlusIcon size={13} />
            Adicionar
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4">
        {party.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
            <UsersIcon size={28} className="text-white-300/20" />
            <p className="text-white-300/40 text-xs max-w-45">
              Adicione os jogadores ou importe da página de personagens
            </p>
            <Button variant="primary" onClick={onAdd} className="px-4 gap-2 h-9 text-xs">
              <PlusIcon size={12} /> Adicionar jogador
            </Button>
          </div>
        )}

        {party.map((member) => (
          <div key={member.id} className="flex items-center gap-2">
            <Input
              value={member.name}
              onChange={(e) => onUpdate(member.id, { name: e.target.value })}
              placeholder="Nome do jogador..."
              className="flex-1 min-w-0 bg-black-500 rounded-lg px-3 py-2"
            />
            <div className="relative shrink-0">
              <select
                value={member.level}
                onChange={(e) => onUpdate(member.id, { level: Number(e.target.value) })}
                className="w-20 bg-black-500 border border-black-100 rounded-lg px-3 py-2 text-white-100 text-sm appearance-none pr-6 focus:outline-none focus:border-red-100 transition-colors cursor-pointer"
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl} className="bg-black-500">
                    Nv {lvl}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white-300/40 text-[10px]">
                ▾
              </span>
            </div>
            <button
              type="button"
              onClick={() => onRemove(member.id)}
              className="shrink-0 text-white-300/40 hover:text-red-100 transition-colors"
            >
              <TrashIcon size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default XpPartyPanel
