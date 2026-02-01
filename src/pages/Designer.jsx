import { useState } from 'react'
import DesignerViewSwitcher, { VIEW_TYPE, EAR_LAYOUT } from '../components/DesignerViewSwitcher'
import DesignerCanvas from '../components/DesignerCanvas'
import AddPiercingModal from '../components/AddPiercingModal'
import { useProfilesStore } from '../store/useProfilesStore'
import { PIERCING_STATUS } from '../constants'
import { getPiercingTypeName } from '../constants/piercingTypes'
import { Plus } from 'lucide-react'

const SIZE_OPTIONS = { small: 2, medium: 5, large: 9 }

function getSizeOption(size) {
  const n = size ?? 5
  if (n <= 3) return 'small'
  if (n <= 7) return 'medium'
  return 'large'
}

const FILTER_ALL = 'all'
const FILTER_OWNED = 'owned'
const FILTER_WISHLIST = 'wishlist'

const filterLabels = {
  [FILTER_ALL]: 'All',
  [FILTER_OWNED]: 'Owned',
  [FILTER_WISHLIST]: 'Wishlisted'
}

export default function Designer() {
  const { piercings, addPiercing, updatePiercing, cycleStatus } = useProfilesStore()
  const [viewType, setViewType] = useState(VIEW_TYPE.EARS)
  const [earLayout, setEarLayout] = useState(EAR_LAYOUT.LEFT)
  const [selectedId, setSelectedId] = useState(null)
  const [filter, setFilter] = useState(FILTER_ALL)
  const [addModalOpen, setAddModalOpen] = useState(false)

  const filtered =
    filter === FILTER_ALL
      ? piercings
      : piercings.filter((p) => p.status === filter)
  const selected = selectedId ? piercings.find((p) => p.id === selectedId) : null

  const handleAddPiercing = (payload) => {
    const ear = earLayout === EAR_LAYOUT.RIGHT ? 'right' : 'left'
    addPiercing({ ...payload, ear, status: 'wishlist' })
    setAddModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-bg pb-24">
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <DesignerViewSwitcher
          viewType={viewType}
          earLayout={earLayout}
          onViewTypeChange={setViewType}
          onEarLayoutChange={setEarLayout}
        />

        <section className="flex justify-center">
          <DesignerCanvas
            viewType={viewType}
            earLayout={earLayout}
            piercings={piercings}
            selectedId={selectedId}
            onSelectPiercing={setSelectedId}
            onUpdatePiercing={updatePiercing}
          />
        </section>

        <section className="rounded-xl border border-purple/30 bg-purple-light/50 p-4">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-bg-dark/80">
            Selected piercing
          </h3>
          {selected ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-bg-dark">
                    {selected.label || getPiercingTypeName(selected.type ?? 'custom')}
                  </p>
                  <p className="text-sm capitalize text-bg-dark/70">
                    {selected.status} · {(selected.style ?? 'stud')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => cycleStatus(selected.id)}
                  className="rounded-lg border border-purple/50 bg-white px-3 py-1.5 text-sm font-medium text-bg-dark hover:bg-purple/20"
                >
                  Cycle status
                </button>
              </div>

              {!selected.fixed && (
                <div className="space-y-3 border-t border-purple/20 pt-3">
                  <p className="text-xs text-bg-dark/60">Drag on canvas to move</p>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-bg-dark/70">Size</label>
                    <div className="flex gap-2">
                      {(['small', 'medium', 'large']).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => updatePiercing(selected.id, { size: SIZE_OPTIONS[opt] })}
                          className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium capitalize transition ${
                            getSizeOption(selected.size) === opt
                              ? 'border-purple bg-purple text-bg-dark'
                              : 'border-purple/40 bg-white text-bg-dark/80 hover:bg-purple/20'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                  {selected.style === 'hoop' && (
                    <div>
                      <label className="mb-1 block text-xs font-medium text-bg-dark/70">Rotation</label>
                      <input
                        type="range"
                        min={0}
                        max={360}
                        value={selected.rotation ?? 0}
                        onChange={(e) =>
                          updatePiercing(selected.id, { rotation: Number(e.target.value) })
                        }
                        className="w-full accent-purple"
                      />
                    </div>
                  )}
                </div>
              )}
              {selected.fixed && (
                <p className="text-xs text-bg-dark/50">Fixed placement — cannot move</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-bg-dark/60">
              {filtered.length ? 'Select a piercing from the canvas or list' : 'No piercings. Add one below.'}
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
                    {p.label || getPiercingTypeName(p.type ?? 'custom')}
                  </button>
                </li>
              ))}
              {filtered.length > 12 && (
                <li className="flex items-center text-xs text-bg-dark/50">+{filtered.length - 12} more</li>
              )}
            </ul>
          )}
        </section>

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
            disabled={earLayout === EAR_LAYOUT.SPLIT}
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-bg-dark px-4 py-2.5 text-sm font-medium text-white transition hover:bg-bg-dark/90 disabled:opacity-50 disabled:pointer-events-none"
            aria-label="Add piercing"
          >
            <Plus className="h-5 w-5" strokeWidth={2} />
            Add
          </button>
        </section>

        {addModalOpen && (
          <AddPiercingModal onAdd={handleAddPiercing} onClose={() => setAddModalOpen(false)} />
        )}
      </div>
    </div>
  )
}
