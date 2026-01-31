import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Designer from './pages/Designer'
import WishlistPage from './pages/WishlistPage'
import AppHeader from './components/AppHeader'
import BottomNav from './components/BottomNav'

function App() {
  return (
    <div className="min-h-screen bg-bg">
      <AppHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/designer" element={<Designer />} />
        <Route path="/wishlist" element={<WishlistPage />} />
      </Routes>
      <BottomNav />
    </div>
  )
}

export default App
