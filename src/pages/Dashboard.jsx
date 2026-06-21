// Dashboard.jsx — Screen 1: Main Dashboard
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, CheckCircle, Monitor, ChevronRight, Clock, Search, Zap } from 'lucide-react'
import ConfidenceBadge from '../components/ConfidenceBadge'
import OverrideModal from '../components/OverrideModal'
import Toast from '../components/Toast'
import { alerts as initialAlerts, activityLog } from '../data/alerts'
import { useEffect } from 'react'
const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
const confidenceOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 }

function sortAlerts(alerts) {
  return [...alerts].sort((a, b) => {
    if (a.status === 'PENDING' && b.status !== 'PENDING') return -1
    if (b.status === 'PENDING' && a.status !== 'PENDING') return 1
    const sc = confidenceOrder[a.confidenceLevel] - confidenceOrder[b.confidenceLevel]
    if (sc !== 0) return sc
    return severityOrder[a.severity] - severityOrder[b.severity]
  })
}

const categoryColors = {
  Security: 'bg-red-100 text-red-700',
  Hardware: 'bg-purple-100 text-purple-700',
  Compliance: 'bg-orange-100 text-orange-700',
  Performance: 'bg-blue-100 text-blue-700',
}

export default function Dashboard({ alerts, setAlerts, showToast, autonomyMode }) {
  const navigate = useNavigate()
  const [overrideTarget, setOverrideTarget] = useState(null)
  const [executingId, setExecutingId] = useState(null)
  const [seconds, setSeconds] = useState(0)
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [activeSeverity, setActiveSeverity] = useState('ALL')
  const [isSimulating, setIsSimulating] = useState(false)
  useEffect(() => {
  const interval = setInterval(() => {
    setSeconds(prev => prev + 1)
  }, 1000)

  return () => clearInterval(interval)
}, [])
  const sorted = sortAlerts(alerts)

  const filteredAlerts = useMemo(() => {
    return sorted.filter(alert => {
      const q = searchQuery.toLowerCase()
      const matchSearch = !q || alert.deviceName.toLowerCase().includes(q) || alert.alertType.toLowerCase().includes(q) || alert.id.toLowerCase().includes(q)
      const matchCategory = activeCategory === 'ALL' || alert.category === activeCategory
      const matchSeverity = activeSeverity === 'ALL' || alert.severity === activeSeverity
      return matchSearch && matchCategory && matchSeverity
    })
  }, [sorted, searchQuery, activeCategory, activeSeverity])

  const stats = {
    active: alerts.filter(a => a.status === 'PENDING').length,
    pending: alerts.filter(a => a.status === 'PENDING').length,
    total: 2400,
  }

  const handleAutonomySimulation = () => {
    // Find qualifying pending alerts
    const qualifying = alerts.filter(a => {
      if (a.status !== 'PENDING') return false
      if (autonomyMode === 'act-low-risk') {
        // Low-risk = performance category (disk cleanups / RAM leaks)
        return a.category === 'Performance'
      }
      if (autonomyMode === 'act-notify') {
        // Act and Notify = all high confidence alerts
        return a.confidenceLevel === 'HIGH'
      }
      return false
    })

    if (qualifying.length === 0) {
      if (autonomyMode === 'always-ask') {
        showToast('🙋 Always Ask Me mode: Autonomy is disabled. All actions require manual approval.', 'info')
      } else if (autonomyMode === 'recommend-wait') {
        showToast('📋 Recommend & Wait mode: Recommendations are queued for morning digest. No automated actions triggered.', 'info')
      } else {
        showToast('ℹ️ No pending recommendations qualify for automated execution under current settings.', 'info')
      }
      return
    }

    setIsSimulating(true)
    showToast(`🤖 Autonomy Simulation triggered. Executing ${qualifying.length} recommendation(s) autonomously...`, 'info')

    let p = Promise.resolve()
    qualifying.forEach((alert) => {
      p = p.then(() => {
        return new Promise(resolve => {
          setExecutingId(alert.id)
          setTimeout(() => {
            setAlerts(prev => prev.map(a => a.id === alert.id ? {
              ...a,
              status: 'APPROVED',
              decisionBy: 'GuardianAI (Autonomy Mode)',
              decisionTime: new Date().toISOString(),
              outcome: a.category === 'Performance' ? 'Success — disk space recovered / service restarted (AUTO)' : 'Success — critical patch applied autonomously (AUTO)'
            } : a))
            showToast(`⚡ Autonomously resolved and logged: ${alert.alertType} on ${alert.deviceName}`, 'success')
            setExecutingId(null)
            resolve()
          }, 1500)
        })
      })
    })

    p.then(() => {
      setIsSimulating(false)
    })
  }

  const handleApprove = (id) => {
    setExecutingId(id)
    setTimeout(() => {
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'APPROVED' } : a))
      showToast('✅ Action approved and logged to Activity Log.', 'success')
      setExecutingId(null)
    }, 1000)
  }

  const handleOverrideConfirm = ({ reason, notes }) => {
    setAlerts(prev => prev.map(a =>
      a.id === overrideTarget.id
        ? { ...a, status: 'OVERRIDDEN', overrideReason: reason, overrideNotes: notes }
        : a
    ))
    setOverrideTarget(null)
    showToast('↩ Override logged. GuardianAI will use your feedback to improve.', 'warning')
  }

  return (
    <div className="flex gap-6 max-w-7xl mx-auto p-6">
      {/* Main content */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Summary strip */}
        <div className="grid grid-cols-3 gap-4">
          <div id="stat-active-alerts" className="card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-confidence-low-bg flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-confidence-low" />
            </div>
            <div>
              <p className="label">Active Alerts</p>
              <p className="text-3xl font-bold text-dell-navy mt-0.5">{stats.active}</p>
            </div>
          </div>
          <div id="stat-pending-actions" className="card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="label">Pending AI Actions</p>
              <p className="text-3xl font-bold text-dell-navy mt-0.5">{stats.pending}</p>
            </div>
          </div>
          <div id="stat-devices" className="card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-dell-lightblue flex items-center justify-center flex-shrink-0">
              <Monitor className="w-6 h-6 text-dell-blue animate-pulse" />
            </div>
            <div>
              <p className="label">Devices Monitored</p>
              <p className="text-3xl font-bold text-dell-navy mt-0.5">{stats.total.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="card">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center flex-1 min-w-0">
              {/* Search */}
              <div className="relative flex-1 max-w-md min-w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="dashboard-search"
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search device, alert, or ID…"
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dell-blue focus:border-transparent"
                />
              </div>

              {/* Severity Filter */}
              <select
                id="filter-severity"
                value={activeSeverity}
                onChange={e => setActiveSeverity(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dell-blue"
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            {/* Simulation trigger */}
            <button
              onClick={handleAutonomySimulation}
              disabled={isSimulating || stats.pending === 0}
              className={`btn-outline flex items-center gap-1.5 py-2 text-xs font-semibold ${isSimulating ? 'opacity-50 cursor-wait' : ''}`}
            >
              <Zap className={`w-3.5 h-3.5 ${isSimulating ? 'animate-bounce text-amber-500' : 'text-dell-blue'}`} />
              {isSimulating ? 'Simulating Autonomy...' : 'Simulate Autonomy Run'}
            </button>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
            {['ALL', 'Security', 'Hardware', 'Compliance', 'Performance'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150 ${
                  activeCategory === cat
                    ? 'bg-dell-blue text-white border-dell-blue shadow-sm'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat === 'ALL' ? 'All Categories' : cat}
              </button>
            ))}
          </div>
        </div>
        <div
          className="
            mb-5
          ]
            inline-flex
            items-center
            gap-3
            px-4
            py-2

            rounded-full

            bg-green-50

            border
            border-green-200
          "
        >
          <span
            className="
              w-2.5
              h-2.5

              bg-green-500

              rounded-full

              animate-pulse
            "
          />

          <div>
            <p className="text-xs text-green-600">
              Monitoring 2,400 Devices • {alerts.length} Recommendations Generated
            </p>
          </div>
        </div>
        {/* Recommendation cards */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-dell-navy">AI Recommendations</h2>
            {filteredAlerts.length !== sorted.length && (
              <span className="text-xs text-gray-400">Showing {filteredAlerts.length} of {sorted.length} alerts</span>
            )}
          </div>
          <div className="space-y-3">
            {stats.pending === 0 && (
              <div className="card bg-green-50/20 border border-green-200/40 p-8 text-center flex flex-col items-center justify-center rounded-xl shadow-sm animate-fade-in mb-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-dell-navy text-lg mb-1">Your Fleet is Secure</h3>
                <p className="text-sm text-gray-500 max-w-md">
                  All automated AI recommendations have been successfully reviewed and resolved. No pending actions require attention at this time.
                </p>
              </div>
            )}
            {stats.pending > 0 && filteredAlerts.length === 0 && (
              <div className="card py-12 text-center text-gray-500 bg-gray-50/50">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm font-semibold">No recommendations match your search filters.</p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('ALL'); setActiveSeverity('ALL') }}
                  className="mt-3 text-xs text-dell-blue hover:underline font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            )}
            {filteredAlerts.map((alert, index) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                index={index}
                isExecuting={executingId === alert.id}
                isAnyExecuting={executingId !== null}
                onApprove={() => handleApprove(alert.id)}
                onOverride={() => setOverrideTarget(alert)}
                onViewDetails={() => navigate(`/detail/${alert.id}`)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar: Recent Activity */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="card sticky top-20">
          <h3 className="font-bold text-dell-navy text-sm mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-confidence-high" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {activityLog.slice(0, 5).map(log => (
              <button
                key={log.id}
                onClick={() => navigate('/log')}
                className="w-full text-left group"
              >
                <div className="flex items-start gap-2.5 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors -mx-3">
                  <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    log.humanDecision === 'APPROVED' || log.humanDecision === 'AUTO-APPROVED'
                      ? 'bg-confidence-high'
                      : log.humanDecision === 'OVERRIDDEN'
                      ? 'bg-confidence-medium'
                      : 'bg-dell-blue'
                  }`} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{log.device}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{log.aiAction}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        log.humanDecision === 'APPROVED' || log.humanDecision === 'AUTO-APPROVED'
                          ? 'bg-confidence-high-bg text-confidence-high'
                          : log.humanDecision === 'OVERRIDDEN'
                          ? 'bg-confidence-medium-bg text-confidence-medium'
                          : 'bg-dell-lightblue text-dell-blue'
                      }`}>
                        {log.humanDecision}
                      </span>
                      <span className="text-[10px] text-gray-400">{new Date(log.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <button
            id="btn-view-all-activity"
            onClick={() => navigate('/log')}
            className="mt-4 w-full text-center text-xs font-semibold text-dell-blue hover:underline"
          >
            View full audit trail →
          </button>
        </div>
      </aside>

      {/* Override modal */}
      {overrideTarget && (
        <OverrideModal
          alert={overrideTarget}
          onConfirm={handleOverrideConfirm}
          onClose={() => setOverrideTarget(null)}
        />
      )}
    </div>
  )
}

// AlertCard — individual recommendation card
function AlertCard({ alert, index,onApprove, onOverride, onViewDetails, isExecuting, isAnyExecuting }) {
  const isActed = alert.status !== 'PENDING'

  return (
    <div
      id={`alert-card-${alert.id}`}
      className={`
        card-hover
        border
        animate-card-reveal

        ${
          isActed
            ? 'opacity-60 bg-gray-50'
            : ''
        }

        ${
          alert.severity === 'CRITICAL' && !isActed
            ? `
                border-l-4
                border-l-confidence-low

                shadow-[0_0_20px_rgba(239,68,68,0.15)]
              `
            : ''
        }
      `}
      style={{
        animationDelay: `${index * 350}ms`
      }}
    >
      <div className="flex items-start gap-4">
        {/* Category icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-base ${
          categoryColors[alert.category] || 'bg-gray-100 text-gray-600'
        }`}>
          {alert.category === 'Security' ? '🛡️'
            : alert.category === 'Hardware' ? '💾'
            : alert.category === 'Performance' ? '📊'
            : '📋'}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-bold text-gray-400 font-mono">{alert.id}</span>
                <span className="font-bold text-dell-navy text-sm">{alert.deviceName}</span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${categoryColors[alert.category] || 'bg-gray-100 text-gray-600'}`}>
                  {alert.category}
                </span>
              </div>
              <p className="font-semibold text-gray-800 text-sm">{alert.alertType}</p>
            </div>
            <ConfidenceBadge level={alert.confidenceLevel} score={alert.confidenceScore} driver={alert.confidenceDriver}/>
          </div>

          {/* One-line reason — leads with the fact, not "The AI has determined..." */}
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            {alert.reasoningSteps[0]}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {!isActed ? (
              <>
                <button
                  id={`card-approve-${alert.id}`}
                  onClick={e => { e.stopPropagation(); onApprove() }}
                  disabled={isAnyExecuting}
                  className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5 disabled:opacity-85 disabled:cursor-wait"
                >
                  {isExecuting ? (
                    <>
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <span>✅</span> Approve
                    </>
                  )}
                </button>
                <button
                  id={`card-override-${alert.id}`}
                  onClick={e => { e.stopPropagation(); onOverride() }}
                  disabled={isAnyExecuting}
                  className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ↩ Override
                </button>
                <button
                  id={`card-details-${alert.id}`}
                  onClick={e => { e.stopPropagation(); onViewDetails() }}
                  disabled={isAnyExecuting}
                  className="btn-link text-xs flex items-center gap-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  View Details <ChevronRight className="w-3 h-3" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className={`badge text-[11px] ${
                  alert.status === 'APPROVED' ? 'badge-high'
                  : alert.status === 'OVERRIDDEN' ? 'badge-medium'
                  : 'bg-purple-100 text-purple-700 border border-purple-200'
                }`}>
                  {alert.status === 'APPROVED' ? '✅ Approved'
                   : alert.status === 'OVERRIDDEN' ? '↩ Overridden'
                   : '⬆ Escalated'}
                </span>
                <button
                  onClick={onViewDetails}
                  className="text-xs text-dell-blue hover:underline"
                >
                  View reasoning →
                </button>
              </div>
            )}
            <span className="ml-auto text-xs text-gray-400">{new Date(alert.timestamp).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
