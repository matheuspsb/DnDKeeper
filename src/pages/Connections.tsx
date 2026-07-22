import { FACTION_TREES } from '../constants/connections.constants'
import { TreeView } from '../components/organisms/connections/TreeView'

function Connections() {
  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 px-8 pt-6 pb-3">
        <h2 className="text-white-100 text-3xl font-bold">Conexões</h2>
        <p className="text-white-300/40 text-sm mt-1">Hierarquias e relações entre facções</p>
      </div>

      <div className="flex-1 min-h-0">
        <TreeView trees={FACTION_TREES} />
      </div>
    </div>
  )
}

export default Connections
