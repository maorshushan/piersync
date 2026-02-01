import { NavLink, useLocation } from 'react-router-dom'
import { Home, PencilRuler, List, Bolt } from 'lucide-react'
import { BASE_PATH } from '../constants'

const navItems = [
  { to: BASE_PATH + '/', icon: Home, label: 'Home' },
  { to: BASE_PATH + '/designer', icon: PencilRuler, label: 'Designer' },
  { to: BASE_PATH + '/wishlist', icon: List, label: 'Wishlist' },
  { to: BASE_PATH + '/settings', icon: Bolt, label: 'Settings' }
]

function isActivePath(pathname, to, end) {
  if (to === BASE_PATH + '/') return pathname === BASE_PATH + '/'
  return pathname.startsWith(to)
}

export default function BottomNav() {
  const { pathname } = useLocation()
  const activeIndex = navItems.findIndex(({ to }) =>
    to === BASE_PATH + '/' ? pathname === BASE_PATH + '/' : pathname.startsWith(to)
  )
  const safeIndex = activeIndex >= 0 ? activeIndex : 0

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 px-12 pb-8 pt-3 backdrop-blur"
      aria-label="Main navigation"
    >
      <div className="relative mx-auto flex max-w-lg items-end">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = isActivePath(pathname, to, to === BASE_PATH + '/')
          return (
            <NavLink
              key={to}
              to={to}
              end={to === BASE_PATH + '/'}
              className={`flex flex-1 flex-col items-center gap-1 rounded-lg py-1 transition ${
                isActive ? 'text-bg-dark' : 'text-neutral-500 hover:text-bg-dark'
              }`}
            >
              <span className="h-0.5 w-4 shrink-0 rounded-full bg-transparent" aria-hidden />
              <Icon className="h-6 w-6 shrink-0" strokeWidth={2} aria-hidden />
              <span className="sr-only">{label}</span>
            </NavLink>
          )
        })}
        <div
          className="pointer-events-none absolute left-0 top-0 flex justify-center transition-transform duration-200 ease-out"
          style={{
            width: `${100 / navItems.length}%`,
            transform: `translateX(${safeIndex * 100}%)`
          }}
          aria-hidden
        >
          <span className="h-0.5 w-4 rounded-full bg-bg-dark" />
        </div>
      </div>
    </nav>
  )
}
