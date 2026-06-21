// App.jsx — Root: Router + global state
import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar'
import Toast from './components/Toast'
import Dashboard from './pages/Dashboard'
import DetailPanel from './pages/DetailPanel'
import ActivityLog from './pages/ActivityLog'
import Settings from './pages/Settings'
import StakeholderSummary from './pages/StakeholderSummary'
import { alerts as initialAlerts } from './data/alerts'

export default function App() {
  const [alerts, setAlerts] = useState(initialAlerts)
  const [autonomyMode, setAutonomyMode] = useState('always-ask')
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type, key: Date.now() })
  }

  const pendingCount = alerts.filter(a => a.status === 'PENDING').length

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar autonomyMode={autonomyMode} alertCount={pendingCount} />

      <main className="pb-16">
        <Routes>
          <Route
            path="/"
            element={<Dashboard alerts={alerts} setAlerts={setAlerts} showToast={showToast} />}
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
