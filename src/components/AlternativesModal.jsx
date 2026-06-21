// AlternativesModal.jsx — See Alternatives: Comparison Mode (Innovation feature)
import { X } from 'lucide-react'
import ConfidenceBadge from './ConfidenceBadge'

export default function AlternativesModal({ alert, onClose }) {
  if (!alert) return null

  const alternatives = [
    {
      action: alert.recommendedAction,
      confidence: alert.confidenceLevel,
      score: alert.confidenceScore,
      label: '⭐ Recommended',
      pro: 'Best match to fleet patterns. Lowest disruption risk.',
      con: 'Requires maintenance window scheduling.',
    },
    {
      action: 'Quarantine device from network and investigate before patching',
      confidence: 'MEDIUM',
      score: 68,
      label: 'Alternative A',
      pro: 'Eliminates risk during investigation period.',
      con: 'User loses network access for potentially 24–48 hrs.',
    },
    {
      action: 'Monitor for 48 hours — set automated alert if new threat signals emerge',
      confidence: 'LOW',
      score: 42,
      label: 'Alternative B',
      pro: 'Zero immediate disruption to user.',
      con: 'Leaves device exposed during observation window.',
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true" aria-label="Alternative AI recommendations">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto animate-slide-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <div>
            <h2 className="text-base font-bold text-dell-navy">⇄ Alternative Recommendations</h2>
            <p className="text-xs text-gray-500 mt-0.5">{alert.deviceName} — {alert.alertType}</p>
          </div>
          <button onClick={onClose} aria-label="Close alternatives modal" className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-500">GuardianAI evaluated {alternatives.length} possible approaches. Here's the comparison:</p>

          {alternatives.map((alt, i) => (
            <div
              key={i}
              className={`rounded-xl border-2 p-5 ${i === 0 ? 'border-dell-blue/40 bg-dell-lightblue/30' : 'border-gray-200 bg-white'}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold ${i === 0 ? 'text-dell-blue' : 'text-gray-400'}`}>{alt.label}</span>
                <ConfidenceBadge level={alt.confidence} score={alt.score} />
              </div>
              <p className="font-semibold text-sm text-dell-navy mb-3">{alt.action}</p>
              <div className="flex gap-4 text-xs">
                <div className="flex items-start gap-1.5 text-confidence-high">
                  <span>✓</span><span className="text-gray-700">{alt.pro}</span>
                </div>
                <div className="flex items-start gap-1.5 text-confidence-low">
                  <span>✗</span><span className="text-gray-700">{alt.con}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 pb-5">
          <button onClick={onClose} className="btn-primary w-full">
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  )
}
