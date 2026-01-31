import { useState } from 'react'
import DesignerViewSwitcher, { VIEW_TYPE, EAR_LAYOUT } from '../components/DesignerViewSwitcher'
import DesignerCanvas from '../components/DesignerCanvas'
import { useProfilesStore } from '../store/useProfilesStore'
import { PIERCING_STATUS } from '../constants'
import { Plus } from 'lucide-react'

const FILTER_ALL = 'all'
const FILTER_OWNED = 'owned'
const FILTER_WISHLIST = 'wishlist'

const filterLabels = {
  [FILTER_ALL]: 'All',
  [FILTER_OWNED]: 'Owned',
  [FILTER_WISHLIST]: 'Wishlisted'
}

export default function Designer() {
  const { piercings, cycleStatus } = useProfilesStore()
  const [viewType, setViewType] = useState(VIEW_TYPE.EARS)
  const [earLayout, setEarLayout] = useState(EAR_LAYOUT.LEFT)
  const [selectedId, setSelectedId] = useState(null)
  const [filter, setFilter] = useState(FILTER_ALL)

  const filtered =
    filter === FILTER_ALL
      ? piercings
      : piercings.filter((p) => p.status === filter)
  const selected = selectedId ? piercings.find((p) => p.id === selectedId) : null

  return (
    <div className="min-h-screen bg-bg pb-24">
      <div className="flex flex-col gap-6 p-4 md:p-6">
        {/* View switcher */}
        <DesignerViewSwitcher
          viewType={viewType}
          earLayout={earLayout}
          onViewTypeChange={setViewType}
          onEarLayoutChange={setEarLayout}
        />

        {/* Designer area */}
        <section className="flex justify-center">
          <DesignerCanvas viewType={viewType} earLayout={earLayout} />
        </section>

        {/* Selected piercing info */}
        <section className="rounded-xl border border-purple/30 bg-purple-light/50 p-4">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-bg-dark/80">
            Selected piercing
          </h3>
          {selected ? (
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-bg-dark">
                  {selected.label || `Piercing at ${Math.round(selected.x)}, ${Math.round(selected.y)}`}
                </p>
                <p className="text-sm capitalize text-bg-dark/70">{selected.status}</p>
              </div>
              <button
                type="button"
                onClick={() => cycleStatus(selected.id)}
                className="rounded-lg border border-purple/50 bg-white px-3 py-1.5 text-sm font-medium text-bg-dark hover:bg-purple/20"
              >
                Cycle status
              </button>
            </div>
          ) : (
            <p className="text-sm text-bg-dark/60">
              {filtered.length ? 'Select a piercing from the list below' : 'No piercings to select'}
            </p>
          )}
          {filtered.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {filtered.slice(0, 12).map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(selectedId === p.id ? null : p.id)}
                    className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                      selectedId === p.id
                        ? 'border-purple bg-purple text-bg-dark'
                        : 'border-purple/40 bg-white text-bg-dark/80 hover:bg-purple/20'
                    }`}
                  >
                    {p.label || `${Math.round(p.x)},${Math.round(p.y)}`}
                  </button>
                </li>
              ))}
              {filtered.length > 12 && (
                <li className="flex items-center text-xs text-bg-dark/50">+{filtered.length - 12} more</li>
              )}
            </ul>
          )}
        </section>

        {/* Filters + Add */}
        <section className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex rounded-lg border border-purple/40 bg-purple-light/50 p-1">
            {[FILTER_ALL, FILTER_OWNED, FILTER_WISHLIST].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  filter === f ? 'bg-purple text-bg-dark' : 'text-bg-dark/70 hover:bg-purple/30'
                }`}
              >
                {filterLabels[f]}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-bg-dark px-4 py-2.5 text-sm font-medium text-white transition hover:bg-bg-dark/90"
            aria-label="Add piercing"
          >
            <Plus className="h-5 w-5" strokeWidth={2} />
            Add
          </button>
        </section>

        {/* Filtered count (optional) */}
        <p className="text-xs text-bg-dark/50">
          Showing {filtered.length} of {piercings.length} piercings
        </p>
      </div>
    </div>
  )
}
