import XIcon from '../../atoms/icons/XIcon'

interface NpcModalHeaderProps {
  isEditing: boolean
  onClose: () => void
}

function NpcModalHeader({ isEditing, onClose }: NpcModalHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-black-200">
      <h2 className="text-white-100 font-bold text-lg">{isEditing ? 'Editar NPC' : 'Novo NPC'}</h2>
      <button
        type="button"
        onClick={onClose}
        className="text-white-300 hover:text-white-100 transition-colors p-1 cursor-pointer"
      >
        <XIcon size={20} />
      </button>
    </div>
  )
}

export default NpcModalHeader
