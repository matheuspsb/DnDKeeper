interface StatCardProps {
  label: string
  value: string
  sub?: string
}

function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="flex flex-col gap-1 bg-black-400 border border-black-100 rounded-xl px-4 py-3">
      <span className="text-white-300/60 text-[10px] font-medium uppercase tracking-wider">{label}</span>
      <span className="text-white-100 text-xl font-bold tabular-nums">{value}</span>
      {sub && <span className="text-white-300/40 text-[10px]">{sub}</span>}
    </div>
  )
}

export default StatCard
