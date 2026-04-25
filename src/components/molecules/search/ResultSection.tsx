function ResultSection({
  title,
  count,
  children,
}: {
  title: string
  count: number
  children: React.ReactNode
}) {
  return (
    <section>
      <div className="flex items-center gap-2 px-4 mb-1">
        <span className="text-white-300/50 text-xs font-semibold uppercase tracking-wider">
          {title}
        </span>
        <span className="text-white-300/30 text-xs">{count}</span>
      </div>
      <div className="flex flex-col">{children}</div>
    </section>
  )
}

export default ResultSection
