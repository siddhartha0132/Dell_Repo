// Dashboard.jsx — Screen 1: Main Dashboard
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, CheckCircle, Monitor, ChevronRight, Clock } from 'lucide-react'
import ConfidenceBadge from '../components/ConfidenceBadge'
import OverrideModal from '../components/OverrideModal'
import Toast from '../components/Toast'
import { alerts as initialAlerts, activityLog } from '../data/alerts'

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

export default function Dashboard({ alerts, setAlerts, showToast }) {
  const navigate = useNavigate()
  const [overrideTarget, setOverrideTarget] = useState(null)
  const sorted = sortAlerts(alerts)

  const stats = {
    active: alerts.filter(a => a.status === 'PENDING').length,
    pending: alerts.filter(a => a.status === 'PENDING').length,
    total: 2400,
  }

  const handleApprove = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'APPROVED' } : a))
    showToast('✅ Action approved and logged to Activity Log.', 'success')
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
              <Monitor className="w-6 h-6 text-dell-blue" />
            </div>
            <div>
              <p className="label">Devices Monitored</p>
              <p className="text-3xl font-bold text-dell-navy mt-0.5">{stats.total.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Recommendation cards */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-dell-navy">AI Recommendations</h2>
            <span className="text-xs text-gray-400">Sorted by priority — critical first</span>
          </div>
          <div className="space-y-3">
            {sorted.map(alert => (
              <AlertCard
                key={alert.id}
                alert={alert}
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
function AlertCard({ alert, onApprove, onOverride, onViewDetails }) {
  const isActed = alert.status !== 'PENDING'

  return (
    <div
      id={`alert-card-${alert.id}`}
      className={`card-hover border ${
        isActed ? 'opacity-60 bg-gray-50' : ''
      } ${alert.severity === 'CRITICAL' && !isActed ? 'border-l-4 border-l-confidence-low' : ''}`}
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
            <ConfidenceBadge level={alert.confidenceLevel} score={alert.confidenceScore} />
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
                  className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1"
                >
                  ✅ Approve
                </button>
                <button
                  id={`card-override-${alert.id}`}
                  onClick={e => { e.stopPropagation(); onOverride() }}
                  className="btn-secondary text-xs px-3 py-1.5"
                >
                  ↩ Override
                </button>
                <button
                  id={`card-details-${alert.id}`}
                  onClick={e => { e.stopPropagation(); onViewDetails() }}
                  className="btn-link text-xs flex items-center gap-0.5"
                >
                  View Details <ChevronRight className="w-3 h-3" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className={`badge text-[11px] ${
                  alert.status === 'APPROVED' ? 'badge-high' : 'badge-medium'
                }`}>
                  {alert.status === 'APPROVED' ? '✅ Approved' : '↩ Overridden'}
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
