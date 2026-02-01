import HomeHeader from '../components/HomeHeader'
import BodyPartSelector from '../components/BodyPartSelector'
import PiercingSummary from '../components/PiercingSummary'
import WishlistSection from '../components/WishlistSection'
import { useProfilesStore } from '../store/useProfilesStore'
import { PIERCING_STATUS } from '../constants'

export default function Home() {
  const { piercings, cycleStatus } = useProfilesStore()
  const plannedCount = piercings.filter((p) => p.status === PIERCING_STATUS.WISHLIST).length

  return (
    <div className="min-h-screen bg-bg pb-24">
      <HomeHeader />
      <main className="px-4 space-y-6">
        <BodyPartSelector />
        <PiercingSummary total={piercings.length} planned={plannedCount} />
        <WishlistSection piercings={piercings} onToggleStatus={cycleStatus} />
      </main>
    </div>
  )
}
