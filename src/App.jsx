// App.jsx — Root: Router + global state
import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Toast from './components/Toast'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import DetailPanel from './pages/DetailPanel'
import ActivityLog from './pages/ActivityLog'
import Settings from './pages/Settings'
import StakeholderSummary from './pages/StakeholderSummary'
import { alerts as initialAlerts } from './data/alerts'

function ScrollToHashElement() {
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => {
        const id = hash.replace('#', '')
        const element = document.getElementById(id)
        if (element) {
          const offset = id === 'transparency' ? 80 : 72
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
          const offsetPosition = elementPosition - offset
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }, 100)
      return () => clearTimeout(t)
    }
  }, [hash])

  return null
}

export default function App() {
  const [alerts, setAlerts] = useState(initialAlerts)
  const [autonomyMode, setAutonomyMode] = useState('always-ask')
  const [toast, setToast] = useState(null)
  const location = useLocation()

  const showToast = (message, type = 'success') => {
    setToast({ message, type, key: Date.now() })
  }

  const pendingCount = alerts.filter(a => a.status === 'PENDING').length

  // Hide navbar on landing page — it has its own hero header
  const showNavbar = location.pathname !== '/'

  return (
    <div className="min-h-screen font-sans">
      <ScrollToHashElement />
      {showNavbar && <Navbar autonomyMode={autonomyMode} alertCount={pendingCount} />}

      <main className={showNavbar ? 'pb-16' : ''}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={<Dashboard alerts={alerts} setAlerts={setAlerts} showToast={showToast} autonomyMode={autonomyMode} />}
          />
          <Route
            path="/detail/:id"
            element={<DetailPanel alerts={alerts} setAlerts={setAlerts} showToast={showToast} />}
          />
          <Route
            path="/log"
            element={<ActivityLog alerts={alerts} />}
          />
          <Route
            path="/settings"
            element={<Settings autonomyMode={autonomyMode} setAutonomyMode={setAutonomyMode} showToast={showToast} />}
          />
          <Route
            path="/summary"
            element={<StakeholderSummary alerts={alerts} />}
          />
        </Routes>
      </main>

      {toast && (
        <Toast
          key={toast.key}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
