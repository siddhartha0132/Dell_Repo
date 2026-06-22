// DetailPanel.jsx — Screen 2: Transparency Centrepiece
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield, SlidersHorizontal, ChevronDown, ChevronUp, RotateCcw, Info, AlertTriangle, Database, Cpu } from 'lucide-react'
import ConfidenceBadge from '../components/ConfidenceBadge'
import ReasoningPanel from '../components/ReasoningPanel'
import DataSourceBox from '../components/DataSourceBox'
import LimitationsBox from '../components/LimitationsBox'
import ActionButtons from '../components/ActionButtons'
import OverrideModal from '../components/OverrideModal'
import AlternativesModal from '../components/AlternativesModal'
import { activityLog } from '../data/alerts'
import EvidenceTimeline from '../components/EvidenceTimeline'

const CONTEXT_TOGGLES = [
  { key: 'verifyVPN',         label: 'Verify VPN Geolocation',     description: "Cross-reference VPN exit node with user's registered location.", icon: '🌐', delta: +10 },
  { key: 'excludeDevTools',   label: 'Exclude Dev Tools',           description: 'Suppress false positives from known developer tools.', icon: '🛠️', delta: +10 },
  { key: 'includeHistorical', label: 'Include Historical Patterns', description: 'Weight using 90-day behavioral baseline for this device.', icon: '📊', delta: +10 },
  { key: 'strictCompliance',  label: 'Strict Compliance Mode',      description: 'Apply SOC2/ISO 27001 thresholds — may lower confidence.', icon: '🔒', delta: -10 },
]

const categoryGradients = {
  Security:    'from-white to-red-50/40 border-red-100',
  Hardware:    'from-white to-purple-50/40 border-purple-100',
  Performance: 'from-white to-blue-50/40 border-blue-100',
  Compliance:  'from-white to-orange-50/40 border-orange-100',
}

const severityBadge = {
  CRITICAL: 'bg-red-100 text-red-700 border border-red-200',
  HIGH:     'bg-orange-100 text-orange-700 border border-orange-200',
  MEDIUM:   'bg-yellow-100 text-yellow-700 border border-yellow-200',
  LOW:      'bg-gray-100 text-gray-600 border border-gray-200',
}

export default function DetailPanel({ alerts, setAlerts, showToast }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const alert = alerts.find(a => a.id === id)

  const [showOverride, setShowOverride] = useState(false)
  const [showAlt, setShowAlt]           = useState(false)
  const [showAskWhy, setShowAskWhy]     = useState(false)
  const [isExecuting, setIsExecuting]   = useState(false)
  const [thinking, setThinking]         = useState(false)
  const [tunerOpen, setTunerOpen]       = useState(false)
  const [toggles, setToggles] = useState(() =>
    alert ? (alert.tunerState || Object.fromEntries(CONTEXT_TOGGLES.map(t => [t.key, false]))) : {}
  )

  const adjustedScore = useMemo(() => {
    if (!alert) return 0
    let score = alert.originalConfidenceScore || alert.confidenceScore
    CONTEXT_TOGGLES.forEach(t => { if (toggles[t.key]) score += t.delta })
    return Math.max(0, Math.min(100, score))
  }, [alert, toggles])

  const adjustedLevel = useMemo(() => {
    if (adjustedScore >= 75) return 'HIGH'
    if (adjustedScore >= 45) return 'MEDIUM'
    return 'LOW'
  }, [adjustedScore])

  const trustStats = useMemo(() => {
    if (!alert) return null
    const relatedLogs = activityLog.filter(log => log.category === alert.category)
    const total     = relatedLogs.length
    const approved  = relatedLogs.filter(log => log.humanDecision === 'APPROVED' || log.humanDecision === 'AUTO-APPROVED').length
    const overridden= relatedLogs.filter(log => log.humanDecision === 'OVERRIDDEN').length
    const escalated = relatedLogs.filter(log => log.humanDecision === 'ESCALATED').length
    return { total, approved, overridden, escalated }
  }, [alert])

  const isTuned   = Object.values(toggles).some(v => v)
  const tuneDelta = adjustedScore - (alert ? (alert.originalConfidenceScore || alert.confidenceScore) : 0)

  const handleToggle = useCallback((key) => {
    setToggles(prev => {
      const next = { ...prev, [key]: !prev[key] }
      setAlerts(all => all.map(a => {
        if (a.id !== id) return a
        const orig = a.originalConfidenceScore || a.confidenceScore
        let score  = orig
        CONTEXT_TOGGLES.forEach(t => { if (next[t.key]) score += t.delta })
        score = Math.max(0, Math.min(100, score))
        const level = score >= 75 ? 'HIGH' : score < 45 ? 'LOW' : 'MEDIUM'
        return { ...a, originalConfidenceScore: orig, originalConfidenceLevel: a.originalConfidenceLevel || a.confidenceLevel, confidenceScore: score, confidenceLevel: level, tunerState: next }
      }))
      return next
    })
  }, [id, setAlerts])

  const handleResetTuner = useCallback(() => {
    const next = Object.fromEntries(CONTEXT_TOGGLES.map(t => [t.key, false]))
    setToggles(next)
    setAlerts(all => all.map(a => a.id === id ? { ...a, confidenceScore: a.originalConfidenceScore || a.confidenceScore, confidenceLevel: a.originalConfidenceLevel || a.confidenceLevel, tunerState: next } : a))
  }, [id, setAlerts])

  const [barWidth, setBarWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setBarWidth(adjustedScore), 200)
    return () => clearTimeout(t)
  }, [adjustedScore])

  if (!alert) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="card text-center py-16">
          <p className="text-gray-400 text-lg">Alert not found.</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary mt-4">← Back to Dashboard</button>
        </div>
      </div>
    )
  }

  const confColors = {
    HIGH:   { bar: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
    MEDIUM: { bar: 'bg-amber-500',   text: 'text-amber-700',   bg: 'bg-amber-50' },
    LOW:    { bar: 'bg-red-500',     text: 'text-red-700',     bg: 'bg-red-50' },
  }
  const cc = confColors[adjustedLevel]
  const catGrad = categoryGradients[alert.category] || 'from-white to-gray-50 border-gray-100'

  const trustScore = (alert.confidenceLevel === 'HIGH' ? 9.2 : alert.confidenceLevel === 'MEDIUM' ? 7.6 : 5.1).toFixed(1)

  const handleApprove = () => {
    setIsExecuting(true)
    setTimeout(() => {
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'APPROVED' } : a))
      showToast('✅ Action approved and logged to Activity Log.', 'success')
      setIsExecuting(false)
    }, 1000)
  }
  const handleOverrideConfirm = ({ reason, notes }) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'OVERRIDDEN', overrideReason: reason, overrideNotes: notes } : a))
    setShowOverride(false)
    showToast('↩ Override logged. GuardianAI will use your feedback to improve.', 'warning')
  }
  const handleEscalate = () => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'ESCALATED', escalated: true } : a))
    showToast("⬆ Escalated to Security team. You'll receive a response within 2 hours.", 'info')
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-5 animate-fade-in">

      {/* ── Back ── */}
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-dell-blue transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Dashboard
      </button>

      {/* ── HEADER CARD ── */}
      <div className={`bg-gradient-to-br ${catGrad} rounded-2xl border p-6 shadow-sm`}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="label text-gray-400">{alert.id}</span>
              <span className="text-xs font-bold text-dell-blue bg-dell-lightblue px-2 py-0.5 rounded-full">{alert.deviceName}</span>
              <span className="text-xs text-gray-400">{alert.deviceModel}</span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-400">{alert.department}</span>
            </div>
            <h1 className="text-xl font-black text-dell-navy leading-snug">{alert.alertType}</h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className={`badge ${severityBadge[alert.severity]}`}>
                {alert.severity}
              </span>
              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                🕐 {new Date(alert.timestamp).toLocaleString()}
              </span>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                <Shield className="w-3 h-3 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-700">Trust Score: {trustScore}/10</span>
              </div>
            </div>
          </div>

          {alert.status !== 'PENDING' && (
            <span className={`badge text-sm ${
              alert.status === 'APPROVED'   ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              : alert.status === 'OVERRIDDEN' ? 'bg-amber-100 text-amber-700 border border-amber-200'
              : 'bg-purple-100 text-purple-700 border border-purple-200'
            }`}>
              {alert.status === 'APPROVED' ? '✅ Approved' : alert.status === 'OVERRIDDEN' ? '↩ Overridden' : '⬆ Escalated'}
            </span>
          )}
        </div>
      </div>

      {/* ── TWO-COLUMN SECTION: Confidence + Trust Ledger ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Confidence card */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <p className="label">AI Confidence Assessment</p>
            {isTuned && (
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${tuneDelta > 0 ? 'bg-emerald-100 text-emerald-700' : tuneDelta < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
                {tuneDelta > 0 ? '▲' : '▼'} {Math.abs(tuneDelta)} pts
              </span>
            )}
          </div>
          <div className="flex flex-col items-center gap-4">
            <ConfidenceBadge level={adjustedLevel} score={adjustedScore} driver={alert.confidenceDriver} size="lg" />
            <div className="w-full">
              <div className="flex justify-between text-[10px] text-gray-400 mb-1.5">
                <span>LOW</span><span>MEDIUM</span><span>HIGH</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200 relative">
                <div className="absolute left-0 top-0 h-full w-1/3 bg-red-400/10 border-r border-red-200/30" />
                <div className="absolute left-1/3 top-0 h-full w-1/3 bg-amber-400/10 border-r border-amber-200/30" />
                <div className="absolute left-2/3 top-0 h-full w-1/3 bg-emerald-400/10" />
                {isTuned && <div className="absolute top-0 h-full w-0.5 bg-gray-400 z-10 transition-all duration-500" style={{ left: `${alert.originalConfidenceScore || alert.confidenceScore}%` }} />}
                <div className={`h-full ${cc.bar} rounded-full transition-all duration-700 ease-out relative overflow-hidden`} style={{ width: `${barWidth}%` }}>
                  <div className="confidence-shine" />
                </div>
              </div>
            </div>
            {alert.counterfactual && (
              <div className="w-full bg-amber-50 border border-amber-100 rounded-xl p-3">
                <p className="text-xs font-semibold text-amber-800 mb-1">What would change this:</p>
                <p className="text-xs text-amber-700">{alert.counterfactual}</p>
              </div>
            )}
          </div>
        </div>

        {/* Trust Ledger + Impact side by side */}
        <div className="space-y-4">
          {trustStats && trustStats.total > 0 && (
            <div className="card-blue">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-dell-blue" />
                <p className="label text-dell-blue">Trust Ledger — {alert.category}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Approved',   val: trustStats.approved,   color: 'text-emerald-700 bg-emerald-50' },
                  { label: 'Overridden', val: trustStats.overridden, color: 'text-amber-700 bg-amber-50' },
                  { label: 'Escalated',  val: trustStats.escalated,  color: 'text-dell-blue bg-dell-lightblue' },
                ].map(s => (
                  <div key={s.label} className={`rounded-xl px-3 py-2.5 text-center ${s.color}`}>
                    <p className="text-xl font-black">{s.val}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wide opacity-70 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-dell-blue/60 mt-2">{trustStats.total} total decisions for this category</p>
            </div>
          )}

          {/* Impact + Device info */}
          <div className="card-blue">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-4 h-4 text-blue-500" />
              <p className="label text-blue-500">Device & Impact</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-1.5 border-b border-blue-100/60">
                <span className="text-gray-500 text-xs">Model</span>
                <span className="font-semibold text-dell-navy text-xs">{alert.deviceModel}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-blue-100/60">
                <span className="text-gray-500 text-xs">Department</span>
                <span className="font-semibold text-dell-navy text-xs">{alert.department}</span>
              </div>
              <div className="flex items-start gap-2 py-1.5">
                <span className="text-gray-500 text-xs flex-shrink-0">Est. Impact</span>
                <span className="font-semibold text-dell-navy text-xs text-right ml-auto">{alert.estimatedImpact}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTEXT TUNER ── */}
      <div className="card" id="context-tuner">
        <button onClick={() => setTunerOpen(!tunerOpen)} className="w-full flex items-center justify-between group" aria-expanded={tunerOpen}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-all">
              <SlidersHorizontal className="w-5 h-5 text-dell-blue" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-dell-navy">Context Tuner</p>
              <p className="text-xs text-gray-400">Adjust factors to see how they shift confidence</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isTuned && <span className="text-[11px] font-bold bg-dell-blue text-white px-2 py-0.5 rounded-full">{Object.values(toggles).filter(Boolean).length} active</span>}
            {tunerOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </div>
        </button>

        {tunerOpen && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-2.5 animate-fade-in">
            <p className="text-xs text-gray-400 mb-3">Each toggle shifts confidence by ±10 points based on additional signal analysis.</p>
            {CONTEXT_TOGGLES.map(toggle => (
              <div key={toggle.key} className={`flex items-center justify-between gap-4 px-4 py-3 rounded-xl border transition-all duration-200 ${toggles[toggle.key] ? 'bg-gradient-to-r from-blue-50 to-dell-lightblue border-dell-blue/30 shadow-sm' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}`}>
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-xl mt-0.5 flex-shrink-0">{toggle.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-dell-navy">{toggle.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{toggle.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-xs font-bold ${toggle.delta > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {toggle.delta > 0 ? '+' : ''}{toggle.delta} pts
                  </span>
                  <button
                    id={`tuner-toggle-${toggle.key}`}
                    onClick={() => handleToggle(toggle.key)}
                    className={`relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-dell-blue/50 ${toggles[toggle.key] ? 'bg-dell-blue' : 'bg-gray-300'}`}
                    role="switch" aria-checked={toggles[toggle.key]} aria-label={toggle.label}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${toggles[toggle.key] ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            ))}
            {isTuned && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-gray-500">
                  Adjusted: <strong className={cc.text}>{adjustedLevel}</strong>
                  <span className="text-gray-400 ml-1">← was {alert.originalConfidenceLevel || alert.confidenceLevel}</span>
                </p>
                <button id="tuner-reset" onClick={handleResetTuner} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-dell-blue transition-colors">
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Evidence Timeline ── */}
      <EvidenceTimeline events={alert.timelineEvents || []} />

      {/* ── TWO-COLUMN: Reasoning + Data Source ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ReasoningPanel steps={alert.reasoningSteps} />
        <div className="space-y-4">
          <DataSourceBox source={alert.dataSource} />
          <LimitationsBox limitations={alert.limitations} />
        </div>
      </div>

      {/* ── Recommended Action ── */}
      <div className="card-blue border-l-4 border-l-dell-blue">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-dell-blue" />
          <p className="label text-dell-blue">Recommended Action</p>
        </div>
        <p className="font-bold text-dell-navy">{alert.recommendedAction}</p>
      </div>

      {/* ── Human Decision ── */}
      <div className="card">
        <p className="label mb-3">Your Decision</p>
        {alert.status === 'OVERRIDDEN' && alert.overrideReason && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
            <strong>Override reason:</strong> {alert.overrideReason}
            {alert.overrideNotes && <p className="mt-1 text-amber-700">{alert.overrideNotes}</p>}
          </div>
        )}
        <ActionButtons
          alertId={alert.id} status={alert.status} isExecuting={isExecuting}
          onApprove={handleApprove}
          onOverride={() => setShowOverride(true)}
          onAskWhy={() => {
            if (!showAskWhy) { setThinking(true); setTimeout(() => { setThinking(false); setShowAskWhy(true) }, 1000) }
            else setShowAskWhy(false)
          }}
          onAlternatives={() => setShowAlt(true)}
          onEscalate={handleEscalate}
        />
        {thinking && (
          <div className="mt-4 bg-gray-50 rounded-xl p-4 animate-pulse">🧠 GuardianAI reviewing evidence…</div>
        )}
        {showAskWhy && (
          <div className="mt-4 bg-gradient-to-r from-dell-lightblue to-blue-50 border border-dell-blue/20 rounded-xl px-5 py-4 animate-fade-in">
            <p className="text-sm font-bold text-dell-navy mb-2">❓ Why this recommendation?</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              GuardianAI analysed telemetry from <strong>{alert.dataSource}</strong>.
              The top factor was: <strong>{alert.reasoningSteps[0].replace(/^[^\s]+ /, '')}</strong>.
              Confidence was set to <strong>{alert.confidenceLevel}</strong> based on: {alert.confidenceDriver}
            </p>
          </div>
        )}
      </div>

      {showOverride && <OverrideModal alert={alert} onConfirm={handleOverrideConfirm} onClose={() => setShowOverride(false)} />}
      {showAlt      && <AlternativesModal alert={alert} onClose={() => setShowAlt(false)} />}
    </div>
  )
}
