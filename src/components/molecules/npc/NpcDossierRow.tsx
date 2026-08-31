import { useState } from 'react'
import type { Npc } from '../../../types/npc.types'
import { resolveImageUrl } from '../../../constants/arts'
import NpcStatusStamp from '../../atoms/NpcStatusStamp'
import MaskIcon from '../../atoms/icons/MaskIcon'
import ChevronRightIcon from '../../atoms/icons/ChevronRightIcon'

interface NpcDossierRowProps {
  npc: Npc
  expanded: boolean
  canEdit: boolean
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
  onImageClick: () => void
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d
    .toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    .replace('.', '')
    .toLowerCase()
}

function NpcDossierRow({
  npc,
  expanded,
  canEdit,
  onToggle,
  onEdit,
  onDelete,
  onImageClick,
}: NpcDossierRowProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const isDead = npc.status === 'morto'
  const image = npc.imageUrl ? resolveImageUrl(npc.imageUrl) : ''
  const revised = npc.updatedAt && npc.updatedAt !== npc.createdAt

  return (
    <article className={`border-b border-ink-800/70 ${isDead ? 'opacity-60' : ''}`}>
      <button
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-center gap-3 py-2.5 pr-2 text-left transition-colors hover:bg-ink-900/60 focus-visible:outline focus-visible:outline-brass"
      >
        <span className="relative h-11 w-11 shrink-0 overflow-hidden border border-ink-800 bg-ink-800">
          {image ? (
            <img
              src={image}
              alt={npc.name}
              className="h-full w-full object-cover"
              style={{ objectPosition: npc.imagePosition ?? 'top' }}
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-bone-400/30">
              <MaskIcon size={20} />
            </span>
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2.5">
            <span className="truncate font-display text-[15px] font-medium tracking-wide text-bone-100">
              {npc.name}
            </span>
            <NpcStatusStamp status={npc.status} animate={false} />
          </span>
          {npc.description && (
            <span className="mt-0.5 block truncate font-body text-[13px] leading-snug text-bone-400">
              {npc.description}
            </span>
          )}
        </span>

        <ChevronRightIcon
          size={16}
          className={`shrink-0 text-bone-400/50 transition-transform duration-200 ${
            expanded ? 'rotate-90' : ''
          }`}
        />
      </button>

      {expanded && (
        <div className="dossier-open flex flex-col gap-4 pb-5 pl-14 sm:flex-row">
          <button
            onClick={onImageClick}
            disabled={!image}
            className={`h-40 w-32 shrink-0 overflow-hidden border border-ink-800 bg-ink-800 ${
              image ? 'cursor-zoom-in' : 'cursor-default'
            }`}
          >
            {image ? (
              <img
                src={image}
                alt={npc.name}
                className="h-full w-full object-cover"
                style={{ objectPosition: npc.imagePosition ?? 'top' }}
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-bone-400/25">
                <MaskIcon size={40} />
              </span>
            )}
          </button>

          <div className="flex min-w-0 flex-1 flex-col gap-3 pr-2">
            {npc.description && (
              <p className="font-body text-[14px] leading-relaxed text-bone-100/90">
                {npc.description}
              </p>
            )}

            {npc.notes && (
              <div>
                <p className="mb-1 font-display text-[10px] tracking-[0.22em] text-brass/80 uppercase">
                  Anotações
                </p>
                <p className="font-body text-[13px] leading-relaxed text-bone-400 italic">
                  {npc.notes}
                </p>
              </div>
            )}

            <p className="font-mono text-[10px] text-bone-400/55">
              ficha aberta {fmtDate(npc.createdAt)}
              {revised && ` · rev. ${fmtDate(npc.updatedAt)}`}
            </p>

            {canEdit && (
              <div className="mt-1 flex items-center gap-2">
                <button
                  onClick={onEdit}
                  className="border border-ink-800 px-3 py-1.5 font-mono text-[11px] tracking-wider text-bone-400 uppercase transition-colors hover:border-bone-400 hover:text-bone-100"
                >
                  Editar
                </button>
                {confirmingDelete ? (
                  <span className="flex items-center gap-2 font-mono text-[11px] tracking-wider text-bone-400 uppercase">
                    remover?
                    <button
                      onClick={onDelete}
                      className="border border-wax/60 px-2 py-1.5 text-wax transition-colors hover:bg-wax/10"
                    >
                      sim
                    </button>
                    <button
                      onClick={() => setConfirmingDelete(false)}
                      className="border border-ink-800 px-2 py-1.5 transition-colors hover:border-bone-400 hover:text-bone-100"
                    >
                      não
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={() => setConfirmingDelete(true)}
                    className="border border-wax/40 px-3 py-1.5 font-mono text-[11px] tracking-wider text-wax uppercase transition-colors hover:bg-wax/10"
                  >
                    Remover
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  )
}

export default NpcDossierRow
