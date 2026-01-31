export default function PiercingSummary({ total, planned }) {
  return (
    <section className="space-y-2">
      <div className="rounded-2xl bg-purple-light px-5 py-4 text-bg-dark shadow-sm">
        <span className="text-3xl font-bold tabular-nums">{total ?? 0}</span>
        <span className="ml-2 text-base font-medium text-bg-dark/90">piercings</span>
      </div>
      {planned != null && planned > 0 && (
        <div className="inline-flex rounded-full bg-bg-dark px-3 py-1.5 text-xs font-medium text-white">
          {planned} planned
        </div>
      )}
    </section>
  )
}
