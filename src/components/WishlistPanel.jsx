import { PIERCING_STATUS } from '../constants'

const statusLabels = {
  [PIERCING_STATUS.OWNED]: 'Owned',
  [PIERCING_STATUS.PLANNED]: 'Planned',
  [PIERCING_STATUS.WISHLIST]: 'Wishlist'
}

const statusBadgeClass = {
  [PIERCING_STATUS.OWNED]: 'bg-purple text-bg-dark',
  [PIERCING_STATUS.PLANNED]: 'bg-pink text-bg-dark',
  [PIERCING_STATUS.WISHLIST]: 'bg-yellow text-bg-dark'
}

export default function WishlistPanel({
  piercings,
  selectedId,
  onSelect,
  onRemove,
  onCycleStatus,
  onLabelChange
}) {
  return (
    <aside className="w-72 shrink-0 rounded-xl bg-purple-light/90 p-4 shadow-lg ring-1 ring-purple/30 backdrop-blur">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-bg-dark">
        Piercings
      </h2>
      <p className="mb-3 text-xs text-bg-dark/70">
        Click ear to add · click dot to cycle status
      </p>
      <ul className="space-y-2">
        {piercings.length === 0 ? (
          <li className="rounded-lg border border-dashed border-purple/50 py-6 text-center text-sm text-bg-dark/70">
            No piercings yet
          </li>
        ) : (
          piercings.map((p) => (
            <li
              key={p.id}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition ${
                selectedId === p.id
                  ? 'border-purple bg-purple-light ring-1 ring-purple/50'
                  : 'border-purple/40 bg-purple-light/50 hover:bg-purple-light'
              }`}
            >
              <button
                type="button"
                onClick={() => onCycleStatus?.(p.id)}
                className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${statusBadgeClass[p.status] ?? statusBadgeClass[PIERCING_STATUS.WISHLIST]}`}
                title="Cycle status"
              >
                {statusLabels[p.status] ?? p.status}
              </button>
              <input
                type="text"
                value={p.label ?? ''}
                onChange={(e) => onLabelChange?.(p.id, e.target.value)}
                placeholder="Label"
                className="min-w-0 flex-1 rounded border-0 bg-transparent py-1 text-sm text-bg-dark placeholder-bg-dark/40 focus:ring-1 focus:ring-purple"
              />
              <button
                type="button"
                onClick={() => onSelect?.(p.id)}
                className="text-bg-dark/60 hover:text-bg-dark"
                title={selectedId === p.id ? 'Selected' : 'Focus'}
                aria-label="Focus piercing"
              >
                {selectedId === p.id ? '●' : '○'}
              </button>
              <button
                type="button"
                onClick={() => onRemove?.(p.id)}
                className="shrink-0 rounded p-1 text-bg-dark/60 hover:bg-purple/30 hover:text-bg-dark"
                aria-label="Remove piercing"
              >
                ×
              </button>
            </li>
          ))
        )}
      </ul>
    </aside>
  )
}
