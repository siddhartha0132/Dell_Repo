// LogReasoningModal.jsx — Clickable Activity Log Reasoning Drawer/Modal
// Shows the full Reasoning Panel, Data Source, and Limitations for ANY log entry.
import { X, Brain, Database, AlertTriangle } from 'lucide-react'
import ConfidenceBadge from './ConfidenceBadge'

export default function LogReasoningModal({ log, onClose }) {
  if (!log) return null

  const hasReasoning = log.reasoningSteps && log.reasoningSteps.length > 0
  const hasDataSource = !!log.dataSource
  const hasLimitations = !!log.limitations

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Log entry reasoning details"
      onClick={() => onClose()}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto animate-slide-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-dell-lightblue rounded-xl flex items-center justify-center flex-shrink-0">
              <Brain className="w-5 h-5 text-dell-blue" />
            </div>
            <div>
              <h2 className="text-base font-bold text-dell-navy">AI Decision Reasoning</h2>
              <p className="text-xs text-gray-500 mt-0.5">{log.id} — {log.device} — {new Date(log.timestamp).toLocaleString()}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Close reasoning modal">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Action Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="label mb-1">AI Action</p>
                <p className="text-sm font-semibold text-dell-navy">{log.aiAction}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span>Decision: <strong className="text-gray-600">{log.humanDecision}</strong></span>
                  <span>By: <strong className="text-gray-600">{log.decisionBy}</strong></span>
                </div>
              </div>
              <ConfidenceBadge level={log.confidence} score={0} />
            </div>
            <p className="text-xs text-gray-500 mt-3 bg-white rounded-lg px-3 py-2 border border-gray-100">
              <strong>Outcome:</strong> {log.outcome}
            </p>
          </div>

          {/* 1. Reasoning Steps */}
          {hasReasoning ? (
            <div className="card border-l-4 border-l-dell-blue">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-4 h-4 text-dell-blue" />
                <span className="label text-dell-navy">Reasoning Chain</span>
              </div>
              <ol className="space-y-2">
                {log.reasoningSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700 bg-gray-50 rounded-lg px-4 py-3 border border-gray-100 transition-all hover:bg-dell-lightblue/30">
                    <span className="mt-0.5 w-6 h-6 bg-dell-blue text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <div className="card bg-gray-50 border-l-4 border-l-gray-300">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-gray-400" />
                <span className="label text-gray-400">Reasoning Chain</span>
              </div>
              <p className="text-sm text-gray-400 italic">
                Detailed reasoning data is not available for this log entry.
                {log.alertId && ' Navigate to the alert detail page for full transparency information.'}
              </p>
            </div>
          )}

          {/* 2. Data Source */}
          {hasDataSource ? (
            <div className="card border-l-4 border-l-confidence-high">
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-4 h-4 text-confidence-high" />
                <span className="label text-confidence-high">Data Source</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{log.dataSource}</p>
            </div>
          ) : (
            <div className="card bg-gray-50 border-l-4 border-l-gray-300">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-gray-400" />
                <span className="label text-gray-400">Data Source</span>
              </div>
              <p className="text-sm text-gray-400 italic">
                Data source details are not available for this log entry.
                {log.alertId && ' Full data provenance is available on the alert detail page.'}
              </p>
            </div>
          )}

          {/* 3. Limitations */}
          {hasLimitations ? (
            <div className="card border-l-4 border-l-amber-400">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="label text-amber-700">Known Limitations</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{log.limitations}</p>
            </div>
          ) : (
            <div className="card bg-gray-50 border-l-4 border-l-gray-300">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-gray-400" />
                <span className="label text-gray-400">Known Limitations</span>
              </div>
              <p className="text-sm text-gray-400 italic">
                Limitation information is not available for this log entry.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex gap-3">
          {log.alertId && (
            <a
              href={`/detail/${log.alertId}`}
              className="btn-primary flex-1 text-center"
              onClick={e => { e.preventDefault(); onClose('navigate', log.alertId) }}
            >
              View Full Alert Detail →
            </a>
          )}
          <button onClick={() => onClose()} className={`btn-outline ${log.alertId ? '' : 'flex-1'}`}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
