import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/logo.svg'

const ROUTE_TITLES = {
  '/': null,
  '/designer': 'Designer',
  '/wishlist': 'Wishlist'
}

function getPageTitle(pathname) {
  if (ROUTE_TITLES[pathname] !== undefined) return ROUTE_TITLES[pathname]
  if (pathname.startsWith('/designer')) return 'Designer'
  if (pathname.startsWith('/wishlist')) return 'Wishlist'
  return null
}

export default function AppHeader() {
  const { pathname } = useLocation()
  const title = getPageTitle(pathname)

  return (
    <header className="flex items-center justify-between gap-4 px-4 py-3 backdrop-blur">
      <div className="flex min-w-0 flex-1 items-end gap-2">
        <Link to="/" className="shrink-0" aria-label="Piersync home">
          <img src={logo} alt="Piersync" className="h-8 w-auto" />
        </Link>
        {title && (
          <span className="text-lg text-bg-dark">
            {title}
          </span>
        )}
      </div>
    </header>
  )
}
