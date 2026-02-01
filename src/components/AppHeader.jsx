import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/logo.svg'
import { BASE_PATH } from '../constants'

const ROUTE_TITLES = {
  '/': null,
  '/designer': 'Designer',
  '/wishlist': 'Wishlist'
}

function getPageTitle(pathname) {
  if (ROUTE_TITLES[pathname] !== undefined) return ROUTE_TITLES[pathname]
  if (pathname.startsWith(BASE_PATH +'/designer')) return 'Designer'
  if (pathname.startsWith(BASE_PATH + '/wishlist')) return 'Wishlist'
  return null
}

export default function AppHeader() {
  const { pathname } = useLocation()
  const title = getPageTitle(pathname)

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between gap-4 bg-bg/95 px-4 py-3 backdrop-blur">
      <div className="flex min-w-0 flex-1 items-end gap-2">
        <Link to={ BASE_PATH + "/"} className="shrink-0" aria-label="Piersync home">
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
