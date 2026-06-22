// Dashboard.jsx — Screen 1: Main Dashboard
import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, CheckCircle, Monitor, ChevronRight, Clock, Search, Zap, TrendingUp, Shield } from 'lucide-react'
import ConfidenceBadge from '../components/ConfidenceBadge'
import OverrideModal from '../components/OverrideModal'
import { activityLog } from '../data/alerts'

const severityOrder   = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
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
  Security:    { chip: 'bg-red-100 text-red-700 border-red-200',     icon: 'bg-red-50 text-red-600',    emoji: '🛡️' },
  Hardware:    { chip: 'bg-purple-100 text-purple-700 border-purple-200', icon: 'bg-purple-50 text-purple-600', emoji: '💾' },
  Compliance:  { chip: 'bg-orange-100 text-orange-700 border-orange-200', icon: 'bg-orange-50 text-orange-600', emoji: '📋' },
  Performance: { chip: 'bg-blue-100 text-blue-700 border-blue-200',   icon: 'bg-blue-50 text-blue-600',  emoji: '📊' },
}

const severityConfig = {
  CRITICAL: { label: 'Critical', dot: 'bg-red-500',    text: 'text-red-600',    bg: 'bg-red-50 border-red-200' },
  HIGH:     { label: 'High',     dot: 'bg-orange-500', text: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
  MEDIUM:   { label: 'Medium',   dot: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' },
  LOW:      { label: 'Low',      dot: 'bg-gray-400',   text: 'text-gray-500',   bg: 'bg-gray-50 border-gray-200' },
}

export default function Dashboard({ alerts, setAlerts, showToast, autonomyMode }) {
  const navigate = useNavigate()
  const [overrideTarget, setOverrideTarget] = useState(null)
  const [executingId, setExecutingId]       = useState(null)
  const [searchQuery, setSearchQuery]       = useState('')
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [activeSeverity, setActiveSeverity] = useState('ALL')
  const [isSimulating, setIsSimulating]     = useState(false)
  const [seconds, setSeconds]               = useState(0)

  useEffect(() => {
    const iv = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(iv)
  }, [])

  const sorted = sortAlerts(alerts)

  const filteredAlerts = useMemo(() => {
    return sorted.filter(alert => {
      const q = searchQuery.toLowerCase()
      const matchSearch   = !q || alert.deviceName.toLowerCase().includes(q) || alert.alertType.toLowerCase().includes(q) || alert.id.toLowerCase().includes(q)
      const matchCategory = activeCategory === 'ALL' || alert.category === activeCategory
      const matchSeverity = activeSeverity === 'ALL' || alert.severity === activeSeverity
      return matchSearch && matchCategory && matchSeverity
    })
  }, [sorted, searchQuery, activeCategory, activeSeverity])

  const stats = {
    active:   alerts.filter(a => a.status === 'PENDING').length,
    pending:  alerts.filter(a => a.status === 'PENDING').length,
    resolved: alerts.filter(a => a.status !== 'PENDING').length,
    total:    2400,
  }

  const handleAutonomySimulation = () => {
    const qualifying = alerts.filter(a => {
      if (a.status !== 'PENDING') return false
      if (autonomyMode === 'act-low-risk')  return a.category === 'Performance'
      if (autonomyMode === 'act-notify')    return a.confidenceLevel === 'HIGH'
      return false
    })
    if (qualifying.length === 0) {
      if (autonomyMode === 'always-ask')       showToast('🙋 Always Ask Me mode: All actions require manual approval.', 'info')
      else if (autonomyMode === 'recommend-wait') showToast('📋 Recommend & Wait mode: Recommendations queued. No automated actions.', 'info')
      else showToast('ℹ️ No pending recommendations qualify for automated execution.', 'info')
      return
    }
    setIsSimulating(true)
    showToast(`🤖 Autonomy Simulation: Executing ${qualifying.length} recommendation(s)…`, 'info')
    let p = Promise.resolve()
    qualifying.forEach(alert => {
      p = p.then(() => new Promise(resolve => {
        setExecutingId(alert.id)
        setTimeout(() => {
          setAlerts(prev => prev.map(a => a.id === alert.id ? {
            ...a, status: 'APPROVED',
            decisionBy:   'GuardianAI (Autonomy Mode)',
            decisionTime: new Date().toISOString(),
            outcome: a.category === 'Performance'
              ? 'Success — disk space recovered / service restarted (AUTO)'
              : 'Success — critical patch applied autonomously (AUTO)',
          } : a))
          showToast(`⚡ Autonomously resolved: ${alert.alertType} on ${alert.deviceName}`, 'success')
          setExecutingId(null)
          resolve()
        }, 1500)
      }))
    })
    p.then(() => setIsSimulating(false))
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
      a.id === overrideTarget.id ? { ...a, status: 'OVERRIDDEN', overrideReason: reason, overrideNotes: notes } : a
    ))
    setOverrideTarget(null)
    showToast('↩ Override logged. GuardianAI will use your feedback to improve.', 'warning')
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 animate-fade-in">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-dell-navy flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-dell-blue to-blue-700 flex items-center justify-center shadow-md shadow-blue-200">
              <Shield className="w-5 h-5 text-white" />
            </div>
            AI Recommendations
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-11">Transparent AI-driven fleet insights — review, approve, or override.</p>
        </div>
        {/* Live badge */}
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-full shadow-sm">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-emerald-700">Live · {seconds}s ago</span>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active alerts */}
        <div id="stat-active-alerts"
          className="stat-card-red rounded-2xl border p-5 flex items-center gap-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <p className="label text-red-400">Active Alerts</p>
            <p className="text-3xl font-black text-red-700 mt-0.5">{stats.active}</p>
          </div>
        </div>

        {/* Pending */}
        <div id="stat-pending-actions"
          className="stat-card-orange rounded-2xl border p-5 flex items-center gap-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="label text-amber-500">Pending Review</p>
            <p className="text-3xl font-black text-amber-700 mt-0.5">{stats.pending}</p>
          </div>
        </div>

        {/* Resolved */}
        <div className="stat-card-green rounded-2xl border p-5 flex items-center gap-4 hover:shadow-md transition-all duration-200 cursor-pointer group">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="label text-emerald-500">Resolved</p>
            <p className="text-3xl font-black text-emerald-700 mt-0.5">{stats.resolved}</p>
          </div>
        </div>

        {/* Devices */}
        <div id="stat-devices"
          className="stat-card-blue rounded-2xl border p-5 flex items-center gap-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <Monitor className="w-6 h-6 text-dell-blue" />
          </div>
          <div>
            <p className="label text-blue-400">Devices Monitored</p>
            <p className="text-3xl font-black text-dell-navy mt-0.5">{stats.total.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* ── Main content ── */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* Search & Filters */}
          <div className="card">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 min-w-52 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="dashboard-search"
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search device, alert, or ID…"
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-dell-blue/30 focus:border-dell-blue focus:bg-white transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Severity filter */}
                <select
                  id="filter-severity"
                  value={activeSeverity}
                  onChange={e => setActiveSeverity(e.target.value)}
                  className="border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dell-blue/30 focus:border-dell-blue"
                >
                  <option value="ALL">All Severities</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>

                {/* Autonomy simulation */}
                <button
                  onClick={handleAutonomySimulation}
                  disabled={isSimulating || stats.pending === 0}
                  className={`btn-outline flex items-center gap-1.5 text-xs font-semibold ${isSimulating ? 'opacity-50 cursor-wait' : ''}`}
                >
                  <Zap className={`w-3.5 h-3.5 ${isSimulating ? 'animate-bounce text-amber-500' : 'text-dell-blue'}`} />
                  {isSimulating ? 'Simulating…' : 'Simulate Autonomy'}
                </button>
              </div>
            </div>

            {/* Category chips */}
            <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
              {['ALL', 'Security', 'Hardware', 'Compliance', 'Performance'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
                    activeCategory === cat
                      ? 'bg-dell-blue text-white border-dell-blue shadow-sm shadow-blue-200'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                  }`}
                >
                  {cat === 'ALL' ? 'All Categories' : cat}
                </button>
              ))}
              {filteredAlerts.length !== sorted.length && (
                <span className="ml-auto text-xs text-gray-400 self-center">
                  Showing {filteredAlerts.length} of {sorted.length}
                </span>
              )}
            </div>
          </div>

          {/* Alert cards */}
          <div>
            <h2 className="text-base font-bold text-dell-navy mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-dell-blue" />
              AI Recommendations
              <span className="ml-auto text-xs font-normal text-gray-400">Sorted by priority</span>
            </h2>

            <div className="space-y-3">
              {stats.pending === 0 && (
                <div className="card bg-gradient-to-br from-white to-emerald-50/40 border-emerald-100 p-10 text-center animate-fade-in">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-dell-navy text-lg mb-1">Your Fleet is Secure</h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    All AI recommendations have been reviewed. No pending actions require attention.
                  </p>
                </div>
              )}

              {stats.pending > 0 && filteredAlerts.length === 0 && (
                <div className="card py-12 text-center text-gray-500 bg-gray-50/50">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm font-semibold">No recommendations match your filters.</p>
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

        {/* ── Sidebar ── sticky wrapper holds BOTH cards together */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-20 space-y-4">

            {/* Recent Activity */}
            <div className="card">
              <h3 className="font-bold text-dell-navy text-sm mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                Recent Activity
              </h3>
              <div className="space-y-1">
                {activityLog.slice(0, 5).map(log => (
                  <button key={log.id} onClick={() => navigate('/log')} className="w-full text-left group">
                    <div className="flex items-start gap-2.5 py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors -mx-3">
                      <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        log.humanDecision === 'APPROVED' || log.humanDecision === 'AUTO-APPROVED'
                          ? 'bg-emerald-500'
                          : log.humanDecision === 'OVERRIDDEN'
                          ? 'bg-amber-500'
                          : 'bg-dell-blue'
                      }`} />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{log.device}</p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{log.aiAction}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            log.humanDecision === 'APPROVED' || log.humanDecision === 'AUTO-APPROVED'
                              ? 'bg-emerald-100 text-emerald-700'
                              : log.humanDecision === 'OVERRIDDEN'
                              ? 'bg-amber-100 text-amber-700'
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
                className="mt-3 w-full text-center text-xs font-semibold text-dell-blue hover:underline py-1.5 rounded-xl hover:bg-dell-lightblue/50 transition-colors"
              >
                View full audit trail →
              </button>
            </div>

            {/* By Category */}
            <div className="bg-gradient-to-br from-white to-purple-50/40 border border-purple-100 rounded-2xl p-5">
              <h3 className="font-bold text-dell-navy text-sm mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                </div>
                By Category
              </h3>
              <div className="space-y-3">
                {['Security', 'Hardware', 'Performance', 'Compliance'].map(cat => {
                  const count = alerts.filter(a => a.category === cat).length
                  const total = alerts.length
                  const pct   = total > 0 ? Math.round((count / total) * 100) : 0
                  const cfg   = categoryColors[cat]
                  const barGradients = {
                    Security:    'from-rose-300 to-red-300',
                    Hardware:    'from-violet-300 to-purple-300',
                    Performance: 'from-blue-300 to-sky-300',
                    Compliance:  'from-amber-300 to-orange-300',
                  }
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-5 h-5 rounded-md text-[10px] flex items-center justify-center ${cfg.icon}`}>{cfg.emoji}</span>
                          <span className="text-xs font-semibold text-gray-700">{cat}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${cfg.chip}`}>{count}</span>
                          <span className="text-[10px] text-gray-400">{pct}%</span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${barGradients[cat]} rounded-full transition-all duration-700`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>{/* end sticky wrapper */}
        </aside>
      </div>

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

// ── AlertCard ── individual recommendation card
function AlertCard({ alert, index, onApprove, onOverride, onViewDetails, isExecuting, isAnyExecuting }) {
  const isActed = alert.status !== 'PENDING'
  const sev = severityConfig[alert.severity] || severityConfig.MEDIUM
  const cat = categoryColors[alert.category] || { chip: 'bg-gray-100 text-gray-600 border-gray-200', icon: 'bg-gray-100 text-gray-500', emoji: '📌' }

  return (
    <div
      id={`alert-card-${alert.id}`}
      className={`
        rounded-2xl border p-5 transition-all duration-200
        animate-card-reveal
        ${isActed
          ? 'opacity-60 bg-gray-50 border-gray-100'
          : alert.severity === 'CRITICAL'
            ? 'bg-gradient-to-br from-white to-red-50/30 border-red-100 hover:shadow-md hover:shadow-red-100/50 hover:border-red-200'
            : 'bg-white hover:shadow-md hover:border-dell-blue/20'
        }
      `}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start gap-4">
        {/* Category icon */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${cat.icon}`}>
          {cat.emoji}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Top row */}
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-bold text-gray-300 font-mono">{alert.id}</span>
                <span className="font-bold text-dell-navy text-sm">{alert.deviceName}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cat.chip}`}>
                  {alert.category}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sev.bg} ${sev.text}`}>
                  {sev.label}
                </span>
              </div>
              <p className="font-semibold text-gray-800 text-sm leading-snug">{alert.alertType}</p>
            </div>
            <ConfidenceBadge level={alert.confidenceLevel} score={alert.confidenceScore} driver={alert.confidenceDriver} />
          </div>

          {/* Reasoning snippet */}
          <p className="text-xs text-gray-500 mt-2 leading-relaxed bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
            {alert.reasoningSteps[0]}
          </p>

          {/* Department + time row */}
          <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400">
            <span>📍 {alert.department}</span>
            <span>🕐 {new Date(alert.timestamp).toLocaleString()}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {!isActed ? (
              <>
                <button
                  id={`card-approve-${alert.id}`}
                  onClick={e => { e.stopPropagation(); onApprove() }}
                  disabled={isAnyExecuting}
                  className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5 disabled:opacity-70 disabled:cursor-wait"
                >
                  {isExecuting ? (
                    <>
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing…
                    </>
                  ) : (<><span>✅</span> Approve</>)}
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
                  alert.status === 'APPROVED'   ? 'badge-high'
                  : alert.status === 'OVERRIDDEN' ? 'badge-medium'
                  : 'bg-purple-100 text-purple-700 border border-purple-200'
                }`}>
                  {alert.status === 'APPROVED' ? '✅ Approved' : alert.status === 'OVERRIDDEN' ? '↩ Overridden' : '⬆ Escalated'}
                </span>
                <button onClick={onViewDetails} className="text-xs text-dell-blue hover:underline">
                  View reasoning →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
