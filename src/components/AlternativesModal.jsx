// AlternativesModal.jsx — See Alternatives: Comparison Mode
// Uses ReactDOM.createPortal to escape any parent transform/stacking context
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Star, AlertCircle, Eye, CheckCircle, XCircle, GitCompare } from 'lucide-react'
import ConfidenceBadge from './ConfidenceBadge'

// Soft pastel gradient palette — matches the site's light theme
const ALTS_CONFIG = [
  {
    label:      'AI Recommended',
    emoji:      '⭐',
    // Card: soft blue gradient matching dell-lightblue family
    cardBg:     'bg-gradient-to-br from-white via-blue-50/60 to-dell-lightblue/80',
    border:     'border border-dell-blue/25',
    shadow:     'shadow-blue-100/60',
    // Label pill
    pillBg:     'bg-gradient-to-r from-dell-blue/90 to-blue-500/80',
    pillText:   'text-white',
    // Accent line at top
    accentBar:  'bg-gradient-to-r from-dell-blue to-blue-400',
    // Score bar
    barBg:      'bg-gradient-to-r from-dell-blue/70 to-blue-400/60',
    barTrack:   'bg-blue-100',
    // Icon background
    iconBg:     'bg-dell-lightblue border border-dell-blue/20',
    iconColor:  'text-dell-blue',
    Icon:       Star,
    // Section tint
    bodyTint:   'bg-gradient-to-b from-transparent to-blue-50/30',
  },
  {
    label:      'Alternative A',
    emoji:      '🔍',
    // Card: warm amber/peach — secondary accent
    cardBg:     'bg-gradient-to-br from-white via-amber-50/50 to-orange-50/40',
    border:     'border border-amber-200/60',
    shadow:     'shadow-amber-100/60',
    pillBg:     'bg-gradient-to-r from-amber-500/85 to-orange-400/80',
    pillText:   'text-white',
    accentBar:  'bg-gradient-to-r from-amber-400 to-orange-300',
    barBg:      'bg-gradient-to-r from-amber-400/70 to-orange-300/60',
    barTrack:   'bg-amber-100',
    iconBg:     'bg-amber-50 border border-amber-200',
    iconColor:  'text-amber-600',
    Icon:       AlertCircle,
    bodyTint:   'bg-gradient-to-b from-transparent to-amber-50/20',
  },
  {
    label:      'Alternative B',
    emoji:      '👁️',
    // Card: soft purple/violet — tertiary accent
    cardBg:     'bg-gradient-to-br from-white via-purple-50/50 to-violet-50/40',
    border:     'border border-purple-200/60',
    shadow:     'shadow-purple-100/60',
    pillBg:     'bg-gradient-to-r from-purple-500/85 to-violet-400/80',
    pillText:   'text-white',
    accentBar:  'bg-gradient-to-r from-purple-400 to-violet-300',
    barBg:      'bg-gradient-to-r from-purple-400/70 to-violet-300/60',
    barTrack:   'bg-purple-100',
    iconBg:     'bg-purple-50 border border-purple-200',
    iconColor:  'text-purple-600',
    Icon:       Eye,
    bodyTint:   'bg-gradient-to-b from-transparent to-purple-50/20',
  },
]

export default function AlternativesModal({ alert, onClose }) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!alert) return null

  const alternatives = [
    {
      action:     alert.recommendedAction,
      confidence: alert.confidenceLevel,
      score:      alert.confidenceScore,
      pro:        'Best match to fleet patterns. Lowest disruption risk.',
      con:        'Requires maintenance window scheduling.',
    },
    {
      action:     'Quarantine device from network and investigate before patching',
      confidence: 'MEDIUM',
      score:      68,
      pro:        'Eliminates risk during investigation period.',
      con:        'User loses network access for potentially 24–48 hrs.',
    },
    {
      action:     'Monitor for 48 hours — set automated alert if new threat signals emerge',
      confidence: 'LOW',
      score:      42,
      pro:        'Zero immediate disruption to user.',
      con:        'Leaves device exposed during observation window.',
    },
  ]

  const modal = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ margin: 0, background: 'rgba(0,58,112,0.35)', backdropFilter: 'blur(6px)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Alternative AI recommendations"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl flex flex-col rounded-2xl bg-white shadow-2xl shadow-dell-navy/10"
        style={{ maxHeight: '90vh', animation: 'slideIn 0.25s ease-out both' }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header — gradient band matching site header style ── */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 rounded-t-2xl bg-gradient-to-r from-white to-dell-lightblue/60 border-b border-dell-blue/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-dell-blue to-blue-600 flex items-center justify-center shadow-md shadow-blue-200 flex-shrink-0">
              <GitCompare className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-dell-navy">Alternative Recommendations</h2>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{alert.deviceName} · {alert.alertType}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex-shrink-0 ml-3 p-2 rounded-xl hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50/50 to-white/90">

          {/* Intro banner */}
          <div className="px-6 pt-5 pb-3">
            <div className="flex items-start gap-3 bg-gradient-to-r from-dell-lightblue to-blue-50/80 border border-dell-blue/15 rounded-xl px-4 py-3">
              <span className="text-dell-blue text-lg flex-shrink-0 mt-0.5">💡</span>
              <p className="text-sm text-dell-navy leading-relaxed">
                GuardianAI evaluated <strong className="text-dell-blue">{alternatives.length} approaches</strong>.
                The recommended option scored highest — but your device context and team policy may point to a different choice.
              </p>
            </div>
          </div>

          {/* Cards */}
          <div className="px-6 pb-4 space-y-4">
            {alternatives.map((alt, i) => {
              const cfg = ALTS_CONFIG[i]
              const Icon = cfg.Icon
              return (
                <div
                  key={i}
                  className={`rounded-2xl overflow-hidden shadow-sm ${cfg.shadow} ${cfg.cardBg} ${cfg.border}`}
                >
                  {/* Top accent line */}
                  <div className={`h-1 w-full ${cfg.accentBar}`} />

                  {/* Card header row */}
                  <div className="flex items-center justify-between px-5 pt-3.5 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.iconBg}`}>
                        <Icon className={`w-4 h-4 ${cfg.iconColor}`} />
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${cfg.pillBg} ${cfg.pillText}`}>
                        {cfg.emoji} {cfg.label}
                      </span>
                    </div>
                    <ConfidenceBadge level={alt.confidence} score={alt.score} />
                  </div>

                  {/* Divider */}
                  <div className="mx-5 border-t border-black/5" />

                  {/* Card body */}
                  <div className={`px-5 py-4 space-y-3.5 ${cfg.bodyTint}`}>

                    {/* Action text */}
                    <p className="font-semibold text-sm text-dell-navy leading-snug">
                      {alt.action}
                    </p>

                    {/* Score bar */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1.5">
                        <span className="font-semibold text-gray-500">Confidence Score</span>
                        <span className="font-black text-dell-navy">{alt.score}%</span>
                      </div>
                      <div className={`h-2 rounded-full overflow-hidden ${cfg.barTrack}`}>
                        <div
                          className={`h-full rounded-full ${cfg.barBg}`}
                          style={{ width: `${alt.score}%`, transition: 'width 0.9s ease-out' }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-300 mt-1 px-0.5">
                        <span>Low</span><span>Medium</span><span>High</span>
                      </div>
                    </div>

                    {/* Pro / Con */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="flex items-start gap-2 bg-white/80 rounded-xl px-3 py-2.5 border border-emerald-100/80">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Pro</p>
                          <p className="text-xs text-gray-600 leading-relaxed">{alt.pro}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 bg-white/80 rounded-xl px-3 py-2.5 border border-rose-100/80">
                        <XCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-1">Con</p>
                          <p className="text-xs text-gray-600 leading-relaxed">{alt.con}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Tip */}
          <div className="px-6 pb-4">
            <p className="text-xs text-gray-400 text-center bg-white/60 border border-gray-100 rounded-xl px-4 py-2.5">
              The <strong className="text-dell-navy">⭐ AI Recommended</strong> option is highlighted in blue. All approaches are valid — your context is the deciding factor.
            </p>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex-shrink-0 px-6 py-4 bg-gradient-to-r from-white to-dell-lightblue/30 border-t border-dell-blue/10 rounded-b-2xl">
          <button onClick={onClose} className="btn-primary w-full py-2.5 text-sm">
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
