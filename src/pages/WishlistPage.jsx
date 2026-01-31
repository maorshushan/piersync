import { useProfilesStore } from '../store/useProfilesStore'
import WishlistItem from '../components/WishlistItem'
import { PIERCING_STATUS } from '../constants'

export default function WishlistPage() {
  const { piercings, cycleStatus } = useProfilesStore()

  return (
    <div className="min-h-screen bg-bg pb-24">
      <main className="px-4 py-6">
        <ul className="space-y-2">
          {piercings.length === 0 ? (
            <li className="rounded-xl border border-dashed border-purple/50 py-12 text-center text-sm text-bg-dark/70">
              No piercings yet. Add some from Design.
            </li>
          ) : (
            piercings.map((p) => (
              <li key={p.id}>
                <WishlistItem
                  name={p.label || `Piercing at ${Math.round(p.x)},${Math.round(p.y)}`}
                  status={p.status}
                  checked={p.status === PIERCING_STATUS.OWNED}
                  onToggle={() => cycleStatus(p.id)}
                />
              </li>
            ))
          )}
        </ul>
      </main>
    </div>
  )
}
