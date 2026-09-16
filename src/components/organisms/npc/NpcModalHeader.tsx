import CloseButton from '../../atoms/CloseButton'

interface NpcModalHeaderProps {
  isEditing: boolean
  onClose: () => void
}

function NpcModalHeader({ isEditing, onClose }: NpcModalHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-black-200">
      <h2 className="text-white-100 font-bold text-lg">{isEditing ? 'Editar NPC' : 'Novo NPC'}</h2>
      <CloseButton onClick={onClose} className="p-1" />
    </div>
  )
}

export default NpcModalHeader
