import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Designer from './pages/Designer'
import WishlistPage from './pages/WishlistPage'
import AppHeader from './components/AppHeader'
import BottomNav from './components/BottomNav'
import { BASE_PATH } from './constants'

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <AppHeader />
      <main className="flex-1 min-h-0 pt-14 pb-20">
        <Routes>
          <Route path={ BASE_PATH + "/"} element={<Home />} />
          <Route path={ BASE_PATH + "/designer"} element={<Designer />} />
          <Route path={BASE_PATH + "/wishlist"} element={<WishlistPage />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}

export default App
