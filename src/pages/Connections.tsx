import { useState } from 'react'
import { useNpcs } from '../hooks/useNpcs'
import { useNpcRelations } from '../hooks/useNpcRelations'
import type { NpcRelationFormOutput } from '../schemas/npcRelation.schema'
import NpcGraph from '../components/organisms/npc/NpcGraph'
import AddRelationModal from '../components/organisms/npc/AddRelationModal'
import Button from '../components/atoms/Button'
import PlusIcon from '../components/atoms/icons/PlusIcon'
import NetworkIcon from '../components/atoms/icons/NetworkIcon'

function ArvoreGenealogica() {
  const { npcs } = useNpcs()
  const { relations, addRelation, deleteRelation } = useNpcRelations()
  const [modalOpen, setModalOpen] = useState(false)

  function handleSaveRelation(data: NpcRelationFormOutput) {
    addRelation(data)
    setModalOpen(false)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 px-8 pt-8 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-white-100 text-3xl font-bold">Conexões</h2>
          <p className="text-white-300/60 text-sm mt-1">
            {relations.length === 0
              ? 'Nenhuma conexão'
              : `${relations.length / 2} conex${relations.length / 2 !== 1 ? 'ões' : 'ão'} entre NPCs`}
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setModalOpen(true)}
          disabled={npcs.length < 2}
          title={npcs.length < 2 ? 'Cadastre ao menos 2 NPCs para conectar' : undefined}
          className="flex items-center gap-2"
        >
          <PlusIcon size={16} />
          Nova Conexão
        </Button>
      </div>

      {npcs.length < 2 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
          <div className="text-white-300/20">
            <NetworkIcon size={56} />
          </div>
          <div>
            <p className="text-white-300 font-medium">Nenhum NPC para conectar</p>
            <p className="text-white-300/50 text-sm mt-1">
              Cadastre ao menos 2 NPCs na aba de NPCs para começar a criar conexões.
            </p>
          </div>
        </div>
      ) : (
        <NpcGraph npcs={npcs} relations={relations} onDeleteRelation={deleteRelation} />
      )}

      {modalOpen && (
        <AddRelationModal
          npcs={npcs}
          onSave={handleSaveRelation}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}

export default ArvoreGenealogica
