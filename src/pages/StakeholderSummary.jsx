// StakeholderSummary.jsx — Tertiary Persona: Non-Technical Stakeholder View
import { useMemo } from 'react'
import { FileText, TrendingUp, CheckCircle, AlertTriangle, ArrowUpRight, Shield, Clock } from 'lucide-react'

const categoryMeta = {
  Security:    { icon: '🛡️', color: 'bg-red-50 text-red-700 border-red-200',        dot: 'bg-red-400' },
  Hardware:    { icon: '💾', color: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-400' },
  Performance: { icon: '📊', color: 'bg-blue-50 text-blue-700 border-blue-200',      dot: 'bg-blue-400' },
  Compliance:  { icon: '📋', color: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-400' },
}

export default function StakeholderSummary({ alerts }) {
  const stats = useMemo(() => {
    const approved  = alerts.filter(a => a.status === 'APPROVED').length
    const overridden= alerts.filter(a => a.status === 'OVERRIDDEN').length
    const escalated = alerts.filter(a => a.escalated).length
    const pending   = alerts.filter(a => a.status === 'PENDING').length
    return { approved, overridden, escalated, pending, total: alerts.length }
  }, [alerts])

  const outcomeLabel = (alert) => {
    if (alert.status === 'APPROVED')  return { text: 'Resolved — action approved by IT', icon: '✅', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' }
    if (alert.status === 'OVERRIDDEN')return { text: 'Overridden — IT chose a different action', icon: '↩', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' }
    if (alert.escalated)               return { text: 'Escalated to security team', icon: '⬆', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' }
    return { text: 'Awaiting IT review', icon: '⏳', color: 'text-gray-500', bg: 'bg-gray-50 border-gray-100' }
  }

  const categoryBreakdown = useMemo(() => {
    const cats = ['Security', 'Hardware', 'Performance', 'Compliance']
    return cats.map(cat => ({ cat, count: alerts.filter(a => a.category === cat).length }))
  }, [alerts])

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 animate-fade-in">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-black text-dell-navy flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md shadow-emerald-200">
            <FileText className="w-5 h-5 text-white" />
          </div>
          Executive Summary
        </h1>
        <p className="text-sm text-gray-500 mt-1 ml-11">Plain-language overview for managers and compliance officers.</p>
      </div>

      {/* ── Digest banner ── */}
      <div className="bg-gradient-to-r from-dell-lightblue to-blue-50 border border-dell-blue/20 rounded-2xl px-6 py-5">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-5 h-5 text-dell-blue" />
          <p className="font-bold text-dell-navy">Fleet Health Digest</p>
        </div>
        <p className="text-sm text-dell-navy leading-relaxed">
          This week, GuardianAI flagged{' '}
          <span className="font-bold text-dell-blue">{stats.total} issues</span> across your fleet.
          Your IT team{' '}
          <span className="font-semibold text-emerald-700">approved {stats.approved}</span>,{' '}
          <span className="font-semibold text-amber-700">overrode {stats.overridden}</span>
          {stats.escalated > 0 && <>, and <span className="font-semibold text-blue-700">escalated {stats.escalated}</span> to security</>}.{' '}
          <span className="font-semibold text-gray-600">{stats.pending} items</span> are still awaiting review.
        </p>
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Flagged', value: stats.total,     icon: TrendingUp,  clr: 'stat-card-blue',   iconClr: 'bg-blue-100 text-blue-600' },
          { label: 'Approved',      value: stats.approved,  icon: CheckCircle, clr: 'stat-card-green',  iconClr: 'bg-emerald-100 text-emerald-600' },
          { label: 'Overridden',    value: stats.overridden,icon: AlertTriangle,clr: 'stat-card-orange', iconClr: 'bg-amber-100 text-amber-600' },
          { label: 'Pending',       value: stats.pending,   icon: Clock,       clr: 'stat-card-purple', iconClr: 'bg-purple-100 text-purple-600' },
        ].map(s => (
          <div key={s.label} className={`${s.clr} rounded-2xl border p-5 flex items-center gap-3`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.iconClr}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-dell-navy">{s.value}</p>
              <p className="label mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Two-col: Category breakdown + Resolution chart ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        {/* ── Issues by Category (gradient bars) ── */}
        <div className="bg-gradient-to-br from-white to-purple-50/50 border border-purple-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <p className="label text-purple-600">Issues by Category</p>
          </div>
          <div className="space-y-4">
            {categoryBreakdown.map(({ cat, count }) => {
              const meta = categoryMeta[cat] || { icon: '📌', color: 'bg-gray-50 text-gray-600 border-gray-200', barFrom: 'from-gray-400', barTo: 'to-gray-500' }
              const pct  = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
              const barGradients = {
                Security:    { from: 'from-rose-300',    to: 'to-red-300' },
                Hardware:    { from: 'from-violet-300',  to: 'to-purple-300' },
                Performance: { from: 'from-blue-300',    to: 'to-sky-300' },
                Compliance:  { from: 'from-amber-300',   to: 'to-orange-300' },
              }
              const bar = barGradients[cat] || { from: 'from-gray-400', to: 'to-gray-500', glow: '' }
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${meta.color}`}>
                        {meta.icon} {cat}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-dell-navy">{count}</span>
                      <span className="text-[10px] text-gray-400 font-semibold w-8 text-right">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${bar.from} ${bar.to} rounded-full shadow-sm transition-all duration-1000 ease-out`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Resolution Rate (multi-ring donut) ── */}
        <div className="bg-gradient-to-br from-white to-emerald-50/50 border border-emerald-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="label text-emerald-600">Resolution Overview</p>
          </div>

          {/* Multi-arc chart */}
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* Track */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="14" />
                {/* Approved arc — emerald */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="url(#grad-approved)" strokeWidth="14"
                  strokeDasharray={`${stats.total > 0 ? ((stats.approved / stats.total) * 239).toFixed(1) : 0} 239`}
                  strokeLinecap="round" />
                {/* Overridden arc — amber, offset */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="url(#grad-overridden)" strokeWidth="14"
                  strokeDasharray={`${stats.total > 0 ? ((stats.overridden / stats.total) * 239).toFixed(1) : 0} 239`}
                  strokeDashoffset={`-${stats.total > 0 ? ((stats.approved / stats.total) * 239).toFixed(1) : 0}`}
                  strokeLinecap="round" />
                {/* Pending arc — purple, offset */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="url(#grad-pending)" strokeWidth="14"
                  strokeDasharray={`${stats.total > 0 ? ((stats.pending / stats.total) * 239).toFixed(1) : 0} 239`}
                  strokeDashoffset={`-${stats.total > 0 ? (((stats.approved + stats.overridden) / stats.total) * 239).toFixed(1) : 0}`}
                  strokeLinecap="round" />
                <defs>
                  <linearGradient id="grad-approved" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6ee7b7" />
                    <stop offset="100%" stopColor="#a7f3d0" />
                  </linearGradient>
                  <linearGradient id="grad-overridden" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fcd34d" />
                    <stop offset="100%" stopColor="#fde68a" />
                  </linearGradient>
                  <linearGradient id="grad-pending" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#c4b5fd" />
                    <stop offset="100%" stopColor="#ddd6fe" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-dell-navy">
                  {stats.total > 0 ? Math.round(((stats.approved + stats.overridden) / stats.total) * 100) : 0}
                  <span className="text-lg">%</span>
                </span>
                <span className="text-[10px] text-gray-400 font-semibold leading-tight text-center">Acted On</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { label: 'Approved',  val: stats.approved,  dot: 'bg-emerald-500', bg: 'bg-emerald-50 border-emerald-100', text: 'text-emerald-700' },
              { label: 'Overridden',val: stats.overridden,dot: 'bg-amber-500',   bg: 'bg-amber-50 border-amber-100',    text: 'text-amber-700' },
              { label: 'Pending',   val: stats.pending,   dot: 'bg-purple-500',  bg: 'bg-purple-50 border-purple-100',  text: 'text-purple-700' },
            ].map(x => (
              <div key={x.label} className={`rounded-xl p-2.5 text-center border ${x.bg}`}>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className={`w-2 h-2 rounded-full ${x.dot}`} />
                </div>
                <p className={`text-lg font-black ${x.text}`}>{x.val}</p>
                <p className="text-[10px] text-gray-400 font-medium">{x.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Plain-language list ── */}
      <div className="bg-gradient-to-br from-white to-blue-50/30 border border-blue-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <p className="label text-blue-600">All Flagged Items — Plain Language</p>
        </div>
        <div className="space-y-2">
          {alerts.map(alert => {
            const outcome = outcomeLabel(alert)
            const meta    = categoryMeta[alert.category] || { icon: '📌', color: 'bg-gray-50 text-gray-600 border-gray-200' }
            return (
              <div key={alert.id} className={`flex items-start gap-3 p-4 rounded-xl border ${outcome.bg}`}>
                <span className="text-lg mt-0.5 flex-shrink-0">{outcome.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-dell-navy">{alert.deviceName}</span>
                    <span className="text-xs text-gray-400">{alert.department}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${meta.color}`}>
                      {meta.icon} {alert.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{alert.alertType}</p>
                  <p className={`text-xs font-semibold mt-1 ${outcome.color}`}>{outcome.text}</p>
                  {alert.outcome && <p className="text-xs text-gray-400 mt-0.5">{alert.outcome}</p>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer note */}
      <div className="text-center text-xs text-gray-400 py-4 border-t border-gray-100">
        This summary is generated by GuardianAI for non-technical stakeholders.
        For full technical details, ask your IT administrator to share the Activity Log.
      </div>
    </div>
  )
}
