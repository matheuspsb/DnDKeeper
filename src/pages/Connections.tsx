import { CULT_TREE } from '../constants/cult'
import { TreeView } from '../components/organisms/connections/TreeView'

function Connections() {
  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 px-8 pt-6 pb-4">
        <h2 className="text-white-100 text-3xl font-bold">Conexões</h2>
        <p className="text-white-300/40 text-sm mt-1">Hierarquias e relações entre facções</p>
      </div>

      <div className="flex-1 overflow-auto px-8 pb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-purple-400/60 mb-4">
          Culto do Dragão
        </p>
        <div className="overflow-x-auto">
          <TreeView tree={CULT_TREE} />
        </div>
      </div>
    </div>
  )
}

export default Connections
