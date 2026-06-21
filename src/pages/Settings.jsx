// Settings.jsx — Screen 5: Autonomy Dial (stretch goal)
import { useState } from 'react'
import { X, Settings as SettingsIcon } from 'lucide-react'
import { autonomyLevels } from '../data/alerts'

export default function Settings({ autonomyMode, setAutonomyMode, showToast }) {
  const [pending, setPending] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSelect = (level) => {
    if (level.id === autonomyMode) return
    setPending(level)
    setShowConfirm(true)
  }

  const handleConfirm = () => {
    setAutonomyMode(pending.id)
    setShowConfirm(false)
    showToast(`⚙️ Autonomy mode set to "${pending.label}". GuardianAI will now operate accordingly.`, 'info')
    setPending(null)
  }

  const current = autonomyLevels.find(l => l.id === autonomyMode) || autonomyLevels[0]

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-dell-navy flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-dell-blue" />
          AI Autonomy Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Control how much GuardianAI acts autonomously vs. asking for your approval on every decision.
        </p>
      </div>

      {/* Current mode banner */}
      <div className="bg-dell-lightblue border border-dell-blue/20 rounded-xl px-5 py-4 flex items-center gap-3">
        <span className="text-2xl">{current.icon}</span>
        <div>
          <p className="text-xs font-bold text-dell-blue uppercase tracking-wider">Current Mode</p>
          <p className="font-bold text-dell-navy">{current.label}</p>
          <p className="text-xs text-gray-600 mt-0.5">{current.description}</p>
        </div>
      </div>

      {/* Dial cards */}
      <div className="space-y-3">
        {autonomyLevels.map((level, i) => {
          const isActive = level.id === autonomyMode
          const riskColors = {
            blue: 'border-dell-blue/40 bg-dell-lightblue/40',
            amber: 'border-amber-300 bg-amber-50',
            red: 'border-confidence-low/30 bg-confidence-low-bg/40',
          }
          return (
            <button
              key={level.id}
              id={`autonomy-${level.id}`}
              onClick={() => handleSelect(level)}
              className={`w-full text-left rounded-xl border-2 p-5 transition-all duration-200 ${
                isActive
                  ? riskColors[level.color] + ' shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Step indicator */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  isActive ? 'bg-dell-blue text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <p className="font-bold text-dell-navy flex items-center gap-2">
                      <span className="text-lg">{level.icon}</span>
                      {level.label}
                    </p>
                    {isActive && (
                      <span className="badge bg-dell-blue text-white text-[11px]">
                        ✓ Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{level.description}</p>
                  <p className={`text-xs font-semibold mt-2 ${
                    level.color === 'blue' ? 'text-dell-blue'
                      : level.color === 'amber' ? 'text-amber-600'
                      : 'text-confidence-low'
                  }`}>
                    ● {level.risk}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* What each mode means table */}
      <div className="card">
        <p className="label mb-4">What each mode does</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-2 pr-4 text-left label text-gray-400">Action Type</th>
                {autonomyLevels.map(l => (
                  <th key={l.id} className={`pb-2 text-center font-semibold ${l.id === autonomyMode ? 'text-dell-blue' : 'text-gray-500'}`}>
                    {l.label.split(' ')[0]}…
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                ['Critical Security Patch', '🙋 Ask', '📋 Queue', '🙋 Ask', '⚡ Auto'],
                ['Low-risk Disk Cleanup', '🙋 Ask', '📋 Queue', '⚡ Auto', '⚡ Auto'],
                ['Hardware Alert (SSD)', '🙋 Ask', '📋 Queue', '🙋 Ask', '⚡ Auto'],
                ['Login Anomaly', '🙋 Ask', '📋 Queue', '🙋 Ask', '⬆ Escalate'],
              ].map(([action, ...cells]) => (
                <tr key={action}>
                  <td className="py-2 pr-4 font-medium text-gray-700">{action}</td>
                  {cells.map((c, i) => (
                    <td key={i} className={`py-2 text-center ${i === autonomyLevels.findIndex(l => l.id === autonomyMode) ? 'font-bold text-dell-blue' : 'text-gray-500'}`}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation modal */}
      {showConfirm && pending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-dell-navy">Change Autonomy Mode?</h2>
              <button onClick={() => setShowConfirm(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-gray-600">You are switching from <strong>{current.label}</strong> to:</p>
              <div className={`rounded-xl border-2 p-4 ${{
                blue: 'border-dell-blue/40 bg-dell-lightblue/40',
                amber: 'border-amber-300 bg-amber-50',
                red: 'border-confidence-low/30 bg-confidence-low-bg/40',
              }[pending.color]}`}>
                <p className="font-bold text-dell-navy">{pending.icon} {pending.label}</p>
                <p className="text-sm text-gray-600 mt-1">{pending.description}</p>
              </div>
              {pending.color === 'red' && (
                <div className="bg-confidence-low-bg border border-confidence-low/30 rounded-lg px-4 py-3 text-sm text-confidence-low font-medium">
                  ⚠️ This mode allows GuardianAI to act autonomously on all HIGH-confidence alerts. Review your Activity Log regularly.
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)} className="btn-secondary flex-1">Cancel</button>
                <button id="btn-confirm-autonomy" onClick={handleConfirm} className="btn-primary flex-1">
                  Confirm Change
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
