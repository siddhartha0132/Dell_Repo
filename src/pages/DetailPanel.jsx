// DetailPanel.jsx — Screen 2: Transparency Centrepiece (25% of score lives here)
// ALL 5 transparency elements present in order, top to bottom.
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield } from 'lucide-react'
import ConfidenceBadge from '../components/ConfidenceBadge'
import ReasoningPanel from '../components/ReasoningPanel'
import DataSourceBox from '../components/DataSourceBox'
import LimitationsBox from '../components/LimitationsBox'
import ActionButtons from '../components/ActionButtons'
import OverrideModal from '../components/OverrideModal'
import AlternativesModal from '../components/AlternativesModal'

export default function DetailPanel({ alerts, setAlerts, showToast }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const alert = alerts.find(a => a.id === id)
  const [barWidth, setBarWidth] = useState(0)
  const [showOverride, setShowOverride] = useState(false)
  const [showAlt, setShowAlt] = useState(false)
  const [showAskWhy, setShowAskWhy] = useState(false)

  // Animate confidence bar on mount
  useEffect(() => {
    const t = setTimeout(() => setBarWidth(alert?.confidenceScore || 0), 200)
    return () => clearTimeout(t)
  }, [alert])

  if (!alert) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="card text-center py-16">
          <p className="text-gray-400 text-lg">Alert not found.</p>
          <button onClick={() => navigate('/')} className="btn-primary mt-4">← Back to Dashboard</button>
        </div>
      </div>
    )
  }

  const confColors = {
    HIGH: { bar: 'bg-confidence-high', text: 'text-confidence-high', bg: 'bg-confidence-high-bg' },
    MEDIUM: { bar: 'bg-confidence-medium', text: 'text-confidence-medium', bg: 'bg-confidence-medium-bg' },
    LOW: { bar: 'bg-confidence-low', text: 'text-confidence-low', bg: 'bg-confidence-low-bg' },
  }
  const cc = confColors[alert.confidenceLevel]

  const handleApprove = () => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'APPROVED' } : a))
    showToast('✅ Action approved and logged to Activity Log.', 'success')
  }
  const handleOverrideConfirm = ({ reason, notes }) => {
    setAlerts(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'OVERRIDDEN', overrideReason: reason, overrideNotes: notes } : a
    ))
    setShowOverride(false)
    showToast('↩ Override logged. GuardianAI will use your feedback to improve.', 'warning')
  }
  const handleEscalate = () => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, escalated: true } : a))
    showToast('⬆ Escalated to Security team. You\'ll receive a response within 2 hours.', 'info')
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-5 animate-fade-in">
      {/* ─── 1. HEADER ─── */}
      <div className="flex items-center gap-3 mb-2">
        <button
          id="btn-back-dashboard"
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-dell-blue transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>

      <div className="card">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="label text-gray-400">{alert.id}</span>
              <span className="text-sm font-semibold text-dell-blue">{alert.deviceName}</span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-400">{alert.deviceModel}</span>
            </div>
            <h1 className="text-xl font-bold text-dell-navy">{alert.alertType}</h1>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
              <span>🕐 {new Date(alert.timestamp).toLocaleString()}</span>
              <span>📍 {alert.department}</span>
              <span className={`font-semibold ${
                alert.severity === 'CRITICAL' ? 'text-confidence-low'
                  : alert.severity === 'HIGH' ? 'text-amber-600'
                  : 'text-gray-500'
              }`}>
                {alert.severity} SEVERITY
              </span>
            </div>
          </div>
          {alert.status !== 'PENDING' && (
            <span className={`badge text-sm ${alert.status === 'APPROVED' ? 'badge-high' : 'badge-medium'}`}>
              {alert.status === 'APPROVED' ? '✅ Approved' : '↩ Overridden'}
            </span>
          )}
        </div>
      </div>

      {/* ─── 2. CONFIDENCE SECTION (Transparency Element #2) ─── */}
      <div className="card">
        <p className="label mb-4">AI Confidence Assessment</p>
        <div className="flex flex-col items-center gap-4 py-4">
          <ConfidenceBadge level={alert.confidenceLevel} score={alert.confidenceScore} size="lg" />

          {/* Animated confidence meter */}
          <div className="w-full max-w-md">
            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
              <span>LOW</span>
              <span>MEDIUM</span>
              <span>HIGH</span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-200 relative">
              {/* Zone markers */}
              <div className="absolute left-0 top-0 h-full w-1/3 bg-confidence-low/10 border-r border-confidence-low/20" />
              <div className="absolute left-1/3 top-0 h-full w-1/3 bg-confidence-medium/10 border-r border-confidence-medium/20" />
              <div className="absolute left-2/3 top-0 h-full w-1/3 bg-confidence-high/10" />
              {/* Bar */}
              <div
                className={`h-full ${cc.bar} rounded-full transition-all duration-1000 ease-out shadow-sm`}
                style={{ width: `${barWidth}%` }}
              />
              {/* Score label */}
              <span
                className="absolute top-0 h-full flex items-center text-[10px] font-bold text-white px-1 transition-all duration-1000"
                style={{ left: `${Math.max(barWidth - 8, 0)}%` }}
              >
                {barWidth}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-600 text-center max-w-md">
            <span className="font-semibold">What drove this score: </span>
            {alert.confidenceDriver}
          </p>
        </div>
      </div>

      {/* ─── 3. REASONING SECTION (Transparency Element #1) ─── */}
      <ReasoningPanel steps={alert.reasoningSteps} />

      {/* ─── 4. DATA SOURCE BOX (Transparency Element #3) ─── */}
      <DataSourceBox source={alert.dataSource} />

      {/* ─── 5. LIMITATIONS BOX (Transparency Element #4) ─── */}
      <LimitationsBox limitations={alert.limitations} />

      {/* Recommended action */}
      <div className="card border-l-4 border-l-dell-blue">
        <p className="label mb-2">Recommended Action</p>
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-dell-blue flex-shrink-0" />
          <p className="font-semibold text-dell-navy">{alert.recommendedAction}</p>
        </div>
      </div>

      {/* ─── 6. HUMAN-IN-THE-LOOP CONTROLS (Transparency Element #5) ─── */}
      <div className="card">
        <p className="label mb-3">Your Decision</p>
        {alert.status === 'OVERRIDDEN' && alert.overrideReason && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
            <strong>Override reason:</strong> {alert.overrideReason}
            {alert.overrideNotes && <p className="mt-1 text-amber-700">{alert.overrideNotes}</p>}
          </div>
        )}
        <ActionButtons
          alertId={alert.id}
          status={alert.status}
          onApprove={handleApprove}
          onOverride={() => setShowOverride(true)}
          onAskWhy={() => setShowAskWhy(!showAskWhy)}
          onAlternatives={() => setShowAlt(true)}
          onEscalate={handleEscalate}
        />
        {showAskWhy && (
          <div className="mt-4 bg-dell-lightblue border border-dell-blue/20 rounded-xl px-5 py-4 animate-fade-in">
            <p className="text-sm font-bold text-dell-navy mb-2">❓ Why this recommendation?</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              GuardianAI analysed telemetry from <strong>{alert.dataSource}</strong>.
              The top factor was: <strong>{alert.reasoningSteps[0].replace(/^[^\s]+ /, '')}</strong>.
              Confidence was set to <strong>{alert.confidenceLevel}</strong> based on: {alert.confidenceDriver}
            </p>
          </div>
        )}
      </div>

      {showOverride && (
        <OverrideModal alert={alert} onConfirm={handleOverrideConfirm} onClose={() => setShowOverride(false)} />
      )}
      {showAlt && (
        <AlternativesModal alert={alert} onClose={() => setShowAlt(false)} />
      )}
    </div>
  )
}
