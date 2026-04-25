function ConditionBadge({ label }: { label: string }) {
  return (
    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 shrink-0 leading-tight">
      {label}
    </span>
  )
}

export default ConditionBadge
