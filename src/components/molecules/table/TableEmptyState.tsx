/** Estado do painel da mesa quando ainda não há combate montado. */
function TableEmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
      <p className="text-2xl font-bold text-white-300">Combate não iniciado</p>
      <p className="text-sm text-white-300/50">Aguardando o mestre montar a ordem.</p>
    </div>
  )
}

export default TableEmptyState
