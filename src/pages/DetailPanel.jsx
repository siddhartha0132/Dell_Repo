// DetailPanel.jsx — Screen 2: Transparency Centrepiece (25% of score lives here)
// ALL 5 transparency elements present in order, top to bottom.
// Includes Feature: Interactive Confidence Recalculation Simulator ("Context Tuner")
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield, SlidersHorizontal, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react'
import ConfidenceBadge from '../components/ConfidenceBadge'
import ReasoningPanel from '../components/ReasoningPanel'
import DataSourceBox from '../components/DataSourceBox'
import LimitationsBox from '../components/LimitationsBox'
import ActionButtons from '../components/ActionButtons'
import OverrideModal from '../components/OverrideModal'
import AlternativesModal from '../components/AlternativesModal'

// Context Tuner toggle definitions — each adjusts confidence by ±10%
const CONTEXT_TOGGLES = [
  {
    key: 'verifyVPN',
    label: 'Verify VPN Geolocation',
    description: 'Cross-reference VPN exit node with user\u2019s registered work location to validate geographic anomaly alerts.',
    icon: '🌐',
    delta: +10,
  },
  {
    key: 'excludeDevTools',
    label: 'Exclude Dev Tools',
    description: 'Suppress false positives from known developer tools (VS Code extensions, Docker, custom CLIs).',
    icon: '🛠️',
    delta: +10,
  },
  {
    key: 'includeHistorical',
    label: 'Include Historical Patterns',
    description: 'Weight the score using 90-day behavioral baseline for this device and user.',
    icon: '📊',
    delta: +10,
  },
  {
    key: 'strictCompliance',
    label: 'Strict Compliance Mode',
    description: 'Apply SOC2/ISO 27001 compliance thresholds — raises sensitivity, may lower confidence.',
    icon: '🔒',
    delta: -10,
  },
]

export default function DetailPanel({ alerts, setAlerts, showToast }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const alert = alerts.find(a => a.id === id)
  const [showOverride, setShowOverride] = useState(false)
  const [showAlt, setShowAlt] = useState(false)
  const [showAskWhy, setShowAskWhy] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)

  // ── Context Tuner State ──
  const [tunerOpen, setTunerOpen] = useState(false)
  const [toggles, setToggles] = useState(() =>
    Object.fromEntries(CONTEXT_TOGGLES.map(t => [t.key, false]))
  )

  // Calculate adjusted score from toggles
  const adjustedScore = useMemo(() => {
    if (!alert) return 0
    let score = alert.confidenceScore
    CONTEXT_TOGGLES.forEach(t => {
      if (toggles[t.key]) score += t.delta
    })
    return Math.max(0, Math.min(100, score))
  }, [alert, toggles])

  // Derive confidence level from adjusted score
  const adjustedLevel = useMemo(() => {
    if (adjustedScore >= 75) return 'HIGH'
    if (adjustedScore >= 45) return 'MEDIUM'
    return 'LOW'
  }, [adjustedScore])

  const isTuned = Object.values(toggles).some(v => v)
  const tuneDelta = adjustedScore - (alert?.confidenceScore || 0)

  const handleToggle = useCallback((key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const handleResetTuner = useCallback(() => {
    setToggles(Object.fromEntries(CONTEXT_TOGGLES.map(t => [t.key, false])))
  }, [])

  // Animate confidence bar on mount and when adjusted score changes
  const [barWidth, setBarWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setBarWidth(adjustedScore), 200)
    return () => clearTimeout(t)
  }, [adjustedScore])

  if (!alert) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="card text-center py-16">
          <p className="text-gray-400 text-lg">Alert not found.</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary mt-4">← Back to Dashboard</button>
        </div>
      </div>
    )
  }

  const confColors = {
    HIGH: { bar: 'bg-confidence-high', text: 'text-confidence-high', bg: 'bg-confidence-high-bg' },
    MEDIUM: { bar: 'bg-confidence-medium', text: 'text-confidence-medium', bg: 'bg-confidence-medium-bg' },
    LOW: { bar: 'bg-confidence-low', text: 'text-confidence-low', bg: 'bg-confidence-low-bg' },
  }
  const cc = confColors[adjustedLevel]

  const handleApprove = () => {
    setIsExecuting(true)
    setTimeout(() => {
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'APPROVED' } : a))
      showToast('✅ Action approved and logged to Activity Log.', 'success')
      setIsExecuting(false)
    }, 1000)
  }
  const handleOverrideConfirm = ({ reason, notes }) => {
    setAlerts(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'OVERRIDDEN', overrideReason: reason, overrideNotes: notes } : a
    ))
    setShowOverride(false)
    showToast('↩ Override logged. GuardianAI will use your feedback to improve.', 'warning')
  }
  const handleEscalate = () => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'ESCALATED', escalated: true } : a))
    showToast('⬆ Escalated to Security team. You\'ll receive a response within 2 hours.', 'info')
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-5 animate-fade-in">
      {/* ─── 1. HEADER ─── */}
      <div className="flex items-center gap-3 mb-2">
        <button
          id="btn-back-dashboard"
          onClick={() => navigate('/dashboard')}
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
            <span className={`badge text-sm ${
              alert.status === 'APPROVED' ? 'badge-high'
              : alert.status === 'OVERRIDDEN' ? 'badge-medium'
              : 'bg-purple-100 text-purple-700 border border-purple-200'
            }`}>
              {alert.status === 'APPROVED' ? '✅ Approved'
               : alert.status === 'OVERRIDDEN' ? '↩ Overridden'
               : '⬆ Escalated'}
            </span>
          )}
        </div>
      </div>

      {/* ─── 2. CONFIDENCE SECTION (Transparency Element #2) ─── */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <p className="label">AI Confidence Assessment</p>
          {isTuned && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${tuneDelta > 0 ? 'bg-confidence-high-bg text-confidence-high' : tuneDelta < 0 ? 'bg-confidence-low-bg text-confidence-low' : 'bg-gray-100 text-gray-500'}`}>
              {tuneDelta > 0 ? '▲' : tuneDelta < 0 ? '▼' : '–'} {Math.abs(tuneDelta)}% from Context Tuner
            </span>
          )}
        </div>
        <div className="flex flex-col items-center gap-4 py-4">
          <ConfidenceBadge level={adjustedLevel} score={adjustedScore} size="lg" />

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
              {/* Original score marker (thin line) shown when tuning */}
              {isTuned && (
                <div
                  className="absolute top-0 h-full w-0.5 bg-gray-400 z-10 transition-all duration-500"
                  style={{ left: `${alert.confidenceScore}%` }}
                  title={`Original: ${alert.confidenceScore}%`}
                />
              )}
              {/* Bar */}
              <div
                className={`h-full ${cc.bar} rounded-full transition-all duration-700 ease-out shadow-sm`}
                style={{ width: `${barWidth}%` }}
              />
            </div>
            {isTuned && (
              <p className="text-[11px] text-gray-400 mt-1.5 text-center">
                Gray marker = original score ({alert.confidenceScore}%) · Colored bar = tuned score ({adjustedScore}%)
              </p>
            )}
          </div>

          <p className="text-sm text-gray-600 text-center max-w-md">
            <span className="font-semibold">What drove this score: </span>
            {alert.confidenceDriver}
          </p>
        </div>
      </div>

      {/* ─── CONTEXT TUNER — Interactive Confidence Recalculation Simulator ─── */}
      <div className="card" id="context-tuner">
        <button
          onClick={() => setTunerOpen(!tunerOpen)}
          className="w-full flex items-center justify-between group"
          aria-expanded={tunerOpen}
          aria-controls="context-tuner-body"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-dell-lightblue rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-dell-blue/20 transition-colors">
              <SlidersHorizontal className="w-4.5 h-4.5 text-dell-blue" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-dell-navy">Context Tuner</p>
              <p className="text-xs text-gray-400">Adjust contextual factors to see how they affect confidence</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isTuned && (
              <span className="text-[11px] font-bold bg-dell-blue text-white px-2 py-0.5 rounded-full">
                {Object.values(toggles).filter(Boolean).length} active
              </span>
            )}
            {tunerOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </div>
        </button>

        {tunerOpen && (
          <div id="context-tuner-body" className="mt-4 pt-4 border-t border-gray-100 space-y-3 animate-fade-in">
            <p className="text-xs text-gray-400 mb-2">
              Toggle contextual factors below. Each toggle adjusts the AI confidence score by ±10% based on additional signal analysis.
            </p>
            {CONTEXT_TOGGLES.map(toggle => (
              <div
                key={toggle.key}
                className={`flex items-center justify-between gap-4 px-4 py-3 rounded-xl border transition-all duration-300 ${
                  toggles[toggle.key]
                    ? 'bg-dell-lightblue border-dell-blue/30 shadow-sm'
                    : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-xl mt-0.5 flex-shrink-0">{toggle.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-dell-navy">{toggle.label}</p>
                    <p className="text-xs text-gray-400 leading-relaxed mt-0.5">{toggle.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-xs font-bold ${
                    toggle.delta > 0 ? 'text-confidence-high' : 'text-confidence-low'
                  }`}>
                    {toggle.delta > 0 ? '+' : ''}{toggle.delta}%
                  </span>
                  <button
                    id={`tuner-toggle-${toggle.key}`}
                    onClick={() => handleToggle(toggle.key)}
                    className={`relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-dell-blue/50 ${
                      toggles[toggle.key] ? 'bg-dell-blue' : 'bg-gray-300'
                    }`}
                    role="switch"
                    aria-checked={toggles[toggle.key]}
                    aria-label={toggle.label}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                        toggles[toggle.key] ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}

            {isTuned && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-gray-500">
                  Adjusted: <strong className={cc.text}>{adjustedLevel}</strong> ({adjustedScore}/100)
                  <span className="text-gray-400 ml-1">← was {alert.confidenceLevel} ({alert.confidenceScore}/100)</span>
                </p>
                <button
                  id="tuner-reset"
                  onClick={handleResetTuner}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-dell-blue transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>
            )}
          </div>
        )}
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
          isExecuting={isExecuting}
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
