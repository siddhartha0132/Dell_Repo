// OverrideModal.jsx — Screen 4: Override Flow
import { useState } from 'react'
import { X } from 'lucide-react'

const OVERRIDE_REASONS = [
  'I have additional context the AI doesn\'t know about',
  'AI recommendation seems wrong for this situation',
  'Policy prevents this automated action',
  'Device is already being handled manually',
  'Other',
]

export default function OverrideModal({ alert, onConfirm, onClose }) {
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleConfirm = () => {
    if (!reason) return
    setSubmitted(true)
    setTimeout(() => {
      onConfirm({ reason, notes })
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true" aria-label="Override AI recommendation">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-dell-navy">Override AI Recommendation</h2>
            <p className="text-xs text-gray-500 mt-0.5">{alert?.deviceName} — {alert?.alertType}</p>
          </div>
          <button onClick={onClose} aria-label="Close override modal" className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-10 text-center animate-fade-in">
            <div className="w-14 h-14 bg-confidence-high-bg rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="font-bold text-dell-navy text-base mb-2">Override Logged</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your override has been logged. GuardianAI will use this feedback to improve future recommendations for similar devices.
            </p>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-4">
            {/* Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
              ↩ You are overriding GuardianAI's recommendation. Please tell us why so the system can learn.
            </div>

            {/* Reason dropdown */}
            <div>
              <label className="label block mb-1.5">Why are you overriding? *</label>
              <select
                id="override-reason-select"
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dell-blue focus:border-transparent"
              >
                <option value="">Select a reason…</option>
                {OVERRIDE_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="label block mb-1.5">Additional notes (optional)</label>
              <textarea
                id="override-notes"
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Add any context that will help GuardianAI improve…"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-dell-blue focus:border-transparent"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
              <button
                id="btn-confirm-override"
                onClick={handleConfirm}
                disabled={!reason}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
              >
                Confirm Override
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
