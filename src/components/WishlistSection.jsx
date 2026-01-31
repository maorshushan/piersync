import { Link } from 'react-router-dom'
import WishlistItem from './WishlistItem'
import { PIERCING_STATUS } from '../constants'

export default function WishlistSection({ piercings, onToggleStatus }) {
  const list = piercings.slice(0, 3)
  const hasMore = piercings.length > 3

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm tracking-wide text-bg-dark">
          wishlist
        </h2>
        {hasMore && (
          <Link
            to="/wishlist"
            className="text-xs font-medium text-bg-dark/60 hover:text-bg-dark"
          >
            see all
          </Link>
        )}
      </div>
      <ul className="space-y-2">
        {list.length === 0 ? (
          <li className="rounded-xl border border-dashed border-purple/50 py-8 text-center text-sm text-bg-dark/70">
            No piercings yet
          </li>
        ) : (
          list.map((p) => (
            <li key={p.id}>
              <WishlistItem
                name={p.label || `Piercing at ${Math.round(p.x)},${Math.round(p.y)}`}
                status={p.status}
                checked={p.status === PIERCING_STATUS.OWNED}
                onToggle={() => onToggleStatus?.(p.id)}
              />
            </li>
          ))
        )}
      </ul>
    </section>
  )
}
