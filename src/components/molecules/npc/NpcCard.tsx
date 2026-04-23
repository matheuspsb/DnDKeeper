import type { Npc } from '../../../types/npc.types'
import NpcCardImage from './NpcCardImage'
import NpcCardActions from './NpcCardActions'
import NpcCardBody from './NpcCardBody'

interface NpcCardProps {
  npc: Npc
  onEdit: () => void
  onDelete: () => void
}

function NpcCard({ npc, onEdit, onDelete }: NpcCardProps) {
  const isDead = npc.status === 'morto'

  return (
    <div
      className={`group bg-black-300 border rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black-500/60
        ${isDead ? 'border-red-400/60' : 'border-black-100 hover:border-black-200'}`}
    >
      <div className="relative">
        <NpcCardImage npc={npc} />
        <NpcCardActions onEdit={onEdit} onDelete={onDelete} />
      </div>
      <NpcCardBody npc={npc} />
    </div>
  )
}

export default NpcCard
