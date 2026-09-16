import CloseButton from '../../atoms/CloseButton'

interface CharacterModalHeaderProps {
  isEditing: boolean
  onClose: () => void
}

function CharacterModalHeader({ isEditing, onClose }: CharacterModalHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-black-200">
      <h2 className="text-white-100 font-bold text-lg">
        {isEditing ? 'Editar Personagem' : 'Novo Personagem'}
      </h2>
      <CloseButton onClick={onClose} className="p-1" />
    </div>
  )
}

export default CharacterModalHeader
