// Settings.jsx — Screen 5: Autonomy Dial
import { useState } from 'react'
import { X, Settings as SettingsIcon, Zap, Shield, CheckCircle } from 'lucide-react'
import { autonomyLevels } from '../data/alerts'

const riskStyle = {
  blue:  { card: 'border-blue-200 bg-gradient-to-br from-white to-blue-50/40',   active: 'border-dell-blue/50 bg-gradient-to-br from-blue-50/60 to-dell-lightblue/60',   dot: 'bg-dell-blue',   text: 'text-dell-blue',   badge: 'bg-dell-lightblue text-dell-blue border-dell-blue/20' },
  amber: { card: 'border-amber-100 bg-gradient-to-br from-white to-amber-50/40', active: 'border-amber-300 bg-gradient-to-br from-amber-50/60 to-orange-50/40',  dot: 'bg-amber-500', text: 'text-amber-600', badge: 'bg-amber-100 text-amber-700 border-amber-200' },
  red:   { card: 'border-red-100 bg-gradient-to-br from-white to-red-50/30',     active: 'border-red-300 bg-gradient-to-br from-red-50/60 to-pink-50/30',     dot: 'bg-red-500',   text: 'text-red-600',   badge: 'bg-red-100 text-red-700 border-red-200' },
}

export default function Settings({ autonomyMode, setAutonomyMode, showToast }) {
  const [pending, setPending]         = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSelect = (level) => {
    if (level.id === autonomyMode) return
    setPending(level); setShowConfirm(true)
  }
  const handleConfirm = () => {
    setAutonomyMode(pending.id); setShowConfirm(false)
    showToast(`⚙️ Autonomy mode set to "${pending.label}". GuardianAI will now operate accordingly.`, 'info')
    setPending(null)
  }

  const current = autonomyLevels.find(l => l.id === autonomyMode) || autonomyLevels[0]
  const currentStyle = riskStyle[current.color]

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 animate-fade-in">

      {/* ── Page header ── */}
      <div>
        <h1 className="text-2xl font-black text-dell-navy flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md shadow-orange-200">
            <SettingsIcon className="w-5 h-5 text-white" />
          </div>
          AI Autonomy Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1 ml-11">Control how much GuardianAI acts autonomously vs. asking for your approval.</p>
      </div>

      {/* ── Current mode banner ── */}
      <div className={`rounded-2xl border-2 p-5 flex items-center gap-4 ${currentStyle.active}`}>
        <div className="w-12 h-12 rounded-xl bg-white/70 flex items-center justify-center text-2xl shadow-sm flex-shrink-0">
          {current.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className={`text-[10px] font-bold uppercase tracking-widest ${currentStyle.text}`}>Currently Active</p>
            <span className={`badge border text-[10px] ${currentStyle.badge}`}>✓ Active</span>
          </div>
          <p className="font-bold text-dell-navy text-base">{current.label}</p>
          <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{current.description}</p>
        </div>
        <div className="flex-shrink-0 hidden sm:block">
          <div className="flex flex-col gap-1 items-end">
            <span className={`text-[11px] font-bold px-2 py-1 rounded-full border ${currentStyle.badge}`}>
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${currentStyle.dot} mr-1.5 animate-pulse`} />
              {current.risk}
            </span>
          </div>
        </div>
      </div>

      {/* ── Dial cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {autonomyLevels.map((level, i) => {
          const isActive = level.id === autonomyMode
          const style = riskStyle[level.color]
          return (
            <button
              key={level.id}
              id={`autonomy-${level.id}`}
              onClick={() => handleSelect(level)}
              className={`text-left rounded-2xl border-2 p-5 transition-all duration-200 hover:shadow-md ${
                isActive ? style.active + ' shadow-sm' : style.card + ' hover:border-gray-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${isActive ? 'bg-white/70 shadow-sm' : 'bg-gray-100/80'}`}>
                  {level.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="font-bold text-dell-navy flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isActive ? style.dot : 'bg-gray-300'}`} />
                      {level.label}
                    </p>
                    {isActive && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.badge}`}>✓ Active</span>}
                  </div>
                  <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{level.description}</p>
                  <p className={`text-[11px] font-semibold mt-2 ${style.text}`}>● {level.risk}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* ── What each mode does table ── */}
      <div className="card overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-dell-blue" />
          <p className="label text-dell-blue">Capability Matrix</p>
        </div>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs min-w-[480px]">
            <thead>
              <tr className="bg-gray-50 rounded-xl">
                <th className="px-4 py-3 text-left label text-gray-400 rounded-l-xl">Action Type</th>
                {autonomyLevels.map(l => (
                  <th key={l.id} className={`px-3 py-3 text-center font-bold text-[11px] ${l.id === autonomyMode ? 'text-dell-blue bg-dell-lightblue/60' : 'text-gray-400'}`}>
                    {l.icon} {l.label.split(' ')[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Critical Security Patch', '🙋 Ask', '📋 Queue', '🙋 Ask', '⚡ Auto'],
                ['Low-risk Disk Cleanup',   '🙋 Ask', '📋 Queue', '⚡ Auto', '⚡ Auto'],
                ['Hardware Alert (SSD)',    '🙋 Ask', '📋 Queue', '🙋 Ask', '⚡ Auto'],
                ['Login Anomaly',           '🙋 Ask', '📋 Queue', '🙋 Ask', '⬆ Escalate'],
              ].map(([action, ...cells], ri) => (
                <tr key={action} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}>
                  <td className="px-4 py-3 font-semibold text-gray-700">{action}</td>
                  {cells.map((c, ci) => (
                    <td key={ci} className={`px-3 py-3 text-center ${ci === autonomyLevels.findIndex(l => l.id === autonomyMode) ? 'font-black text-dell-blue bg-dell-lightblue/40' : 'text-gray-400'}`}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Confirmation modal ── */}
      {showConfirm && pending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-dell-navy">Change Autonomy Mode?</h2>
              <button onClick={() => setShowConfirm(false)} className="p-1.5 rounded-xl hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-gray-600">Switching from <strong>{current.label}</strong> to:</p>
              <div className={`rounded-2xl border-2 p-4 ${riskStyle[pending.color].active}`}>
                <p className="font-bold text-dell-navy">{pending.icon} {pending.label}</p>
                <p className="text-sm text-gray-600 mt-1">{pending.description}</p>
              </div>
              {pending.color === 'red' && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 font-medium">
                  ⚠️ This mode allows GuardianAI to act autonomously on all HIGH-confidence alerts. Review your Activity Log regularly.
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)} className="btn-secondary flex-1">Cancel</button>
                <button id="btn-confirm-autonomy" onClick={handleConfirm} className="btn-primary flex-1 flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> Confirm Change
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
