import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Designer from './pages/Designer'
import WishlistPage from './pages/WishlistPage'
import AppHeader from './components/AppHeader'
import BottomNav from './components/BottomNav'

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <AppHeader />
      <main className="flex-1 min-h-0 pt-14 pb-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/designer" element={<Designer />} />
          <Route path="/wishlist" element={<WishlistPage />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}

export default App
