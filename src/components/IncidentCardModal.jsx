// IncidentCardModal.jsx — AI Incident Post-Mortem Card
// Structured failure analysis when AI causes an unintended outcome.
import { X, AlertOctagon, Search, ShieldCheck, Lightbulb, Clock, Users, HardDrive } from 'lucide-react'

export default function IncidentCardModal({ log, onClose }) {
  if (!log || !log.incident) return null

  const inc = log.incident

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true" aria-label="AI Incident Post-Mortem" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto animate-slide-in" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-confidence-low-bg rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertOctagon className="w-5 h-5 text-confidence-low" />
            </div>
            <div>
              <h2 className="text-base font-bold text-dell-navy">AI Incident Post-Mortem</h2>
              <p className="text-xs text-gray-500 mt-0.5">{log.device} — {new Date(log.timestamp).toLocaleString()}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Close incident card">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Incident Summary Banner */}
          <div className="bg-confidence-low-bg border border-confidence-low/20 rounded-xl px-5 py-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="badge bg-confidence-low text-white text-[11px]">
                {inc.severity} SEVERITY INCIDENT
              </span>
              <span className="text-xs text-gray-500">
                Resolved in {inc.timeToResolve}
              </span>
            </div>
            <p className="text-sm font-semibold text-confidence-low">{log.aiAction}</p>
            <p className="text-sm text-gray-700 mt-1">{log.outcome}</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-lg px-4 py-3 text-center border border-gray-100">
              <Clock className="w-4 h-4 text-gray-400 mx-auto mb-1" />
              <p className="text-sm font-bold text-dell-navy">{inc.timeToResolve}</p>
              <p className="text-[10px] text-gray-400 uppercase font-semibold">Time to Resolve</p>
            </div>
            <div className="bg-gray-50 rounded-lg px-4 py-3 text-center border border-gray-100">
              <Users className="w-4 h-4 text-gray-400 mx-auto mb-1" />
              <p className="text-sm font-bold text-dell-navy">{inc.affectedUsers}</p>
              <p className="text-[10px] text-gray-400 uppercase font-semibold">Users Affected</p>
            </div>
            <div className="bg-gray-50 rounded-lg px-4 py-3 text-center border border-gray-100">
              <HardDrive className="w-4 h-4 text-gray-400 mx-auto mb-1" />
              <p className="text-sm font-bold text-dell-navy">{inc.dataLoss ? 'Yes' : 'None'}</p>
              <p className="text-[10px] text-gray-400 uppercase font-semibold">Data Loss</p>
            </div>
          </div>

          {/* 1. Root Cause */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-4 h-4 text-confidence-low" />
              <span className="label text-confidence-low">Root Cause Analysis</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{inc.rootCause}</p>
          </div>

          {/* 2. Telemetry Gap — Why the AI Failed */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertOctagon className="w-4 h-4 text-amber-600" />
              <span className="label text-amber-700">Telemetry Gap — Why AI Failed</span>
            </div>
            <p className="text-sm text-amber-900 leading-relaxed">{inc.telemetryGap}</p>
          </div>

          {/* 3. What the AI's reasoning was */}
          {log.reasoningSteps && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🧠</span>
                <span className="label text-gray-500">AI Reasoning at Time of Decision</span>
              </div>
              <ul className="space-y-2">
                {log.reasoningSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700 bg-gray-50 rounded-lg px-4 py-2.5 border border-gray-100">
                    <span className="mt-0.5 flex-shrink-0 text-base">{step.split(' ')[0]}</span>
                    <span className="leading-relaxed">{step.split(' ').slice(1).join(' ')}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 4. Impact Mitigation — How it was resolved */}
          <div className="bg-confidence-high-bg border border-confidence-high/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-confidence-high" />
              <span className="label text-confidence-high">Impact Mitigation</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{inc.impactMitigation}</p>
          </div>

          {/* 5. Preventive Action — How AI improved */}
          <div className="bg-dell-lightblue border border-dell-blue/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-dell-blue" />
              <span className="label text-dell-blue">Preventive Action Taken by GuardianAI</span>
            </div>
            <p className="text-sm text-dell-navy leading-relaxed font-medium">{inc.preventiveAction}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5">
          <button onClick={onClose} className="btn-primary w-full">
            Close Post-Mortem
          </button>
        </div>
      </div>
    </div>
  )
}
