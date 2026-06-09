import type { Npc } from '../../../types/npc.types'
import deadWatermark from '../../../assets/watermarks/dead.png'
import { resolveImageUrl } from '../../../constants/arts'
import { FACTION_IMAGE } from '../../../constants/npc.constants'
import MaskIcon from '../../atoms/icons/MaskIcon'

interface NpcCardImageProps {
  npc: Npc
  onImageClick?: () => void
}

function NpcCardImage({ npc, onImageClick }: NpcCardImageProps) {
  const isDead = npc.status === 'morto'
  const factionImg = FACTION_IMAGE[npc.faction]

  return (
    <div
      className={`h-52 relative bg-black-400 shrink-0 ${npc.imageUrl && onImageClick ? 'cursor-pointer' : ''}`}
      onClick={npc.imageUrl ? onImageClick : undefined}
    >
      <div className="absolute inset-0 overflow-hidden">
        {npc.imageUrl ? (
          <img
            src={resolveImageUrl(npc.imageUrl)}
            alt={npc.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            style={{ objectPosition: npc.imagePosition ?? 'top' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white-300/20">
            <MaskIcon size={52} />
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 -bottom-3 h-20 bg-linear-to-t from-black-300 to-transparent pointer-events-none" />

      {factionImg && (
        <img
          src={factionImg}
          alt={npc.faction}
          className="absolute -top-2 -left-3 w-24 h-24 object-contain pointer-events-none z-10"
        />
      )}

      {isDead && (
        <div className="absolute inset-0 bg-black-500/70 flex items-end justify-center pb-3 pointer-events-none">
          <img
            src={deadWatermark}
            alt="morto"
            className="absolute -top-4 right-1 w-40 h-40 object-contain pointer-events-none rotate-45"
          />
        </div>
      )}
    </div>
  )
}

export default NpcCardImage
