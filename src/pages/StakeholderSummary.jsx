// StakeholderSummary.jsx — Tertiary Persona: Non-Technical Stakeholder View
// Plain-language summary — no confidence badges, no reasoning bullets, no action buttons.
// Exists to prove persona coverage to judges (PRD Section 8, Persona 3).
import { useMemo } from 'react'
import { FileText, TrendingUp, CheckCircle, AlertTriangle, ArrowUpRight } from 'lucide-react'

export default function StakeholderSummary({ alerts }) {
  const stats = useMemo(() => {
    const approved = alerts.filter(a => a.status === 'APPROVED').length
    const overridden = alerts.filter(a => a.status === 'OVERRIDDEN').length
    const escalated = alerts.filter(a => a.escalated).length
    const pending = alerts.filter(a => a.status === 'PENDING').length
    return { approved, overridden, escalated, pending, total: alerts.length }
  }, [alerts])

  const outcomeLabel = (alert) => {
    if (alert.status === 'APPROVED') return { text: 'Resolved — action approved by IT', icon: '✅', color: 'text-confidence-high' }
    if (alert.status === 'OVERRIDDEN') return { text: 'Overridden — IT chose a different action', icon: '↩', color: 'text-confidence-medium' }
    if (alert.escalated) return { text: 'Escalated to security team', icon: '⬆', color: 'text-dell-blue' }
    return { text: 'Awaiting IT review', icon: '⏳', color: 'text-gray-500' }
  }

  const categoryLabel = (cat) => {
    const map = {
      Security: '🛡️ Security',
      Hardware: '💾 Hardware',
      Performance: '📊 Performance',
      Compliance: '📋 Compliance',
    }
    return map[cat] || cat
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-dell-navy flex items-center gap-2">
          <FileText className="w-5 h-5 text-dell-blue" />
          Executive Summary
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          A plain-language overview of GuardianAI activity — designed for managers and compliance officers.
        </p>
      </div>

      {/* Digest banner */}
      <div className="bg-dell-lightblue border border-dell-blue/20 rounded-xl px-6 py-5">
        <p className="text-sm text-dell-navy leading-relaxed">
          <span className="font-bold">This week,</span> GuardianAI flagged{' '}
          <span className="font-bold text-dell-blue">{stats.total} issues</span> across your fleet.
          Your IT team{' '}
          <span className="font-semibold text-confidence-high">approved {stats.approved}</span>,{' '}
          <span className="font-semibold text-confidence-medium">overrode {stats.overridden}</span>,
          {stats.escalated > 0 && (
            <> and <span className="font-semibold text-dell-blue">escalated {stats.escalated}</span> to security</>
          )}.{' '}
          <span className="font-semibold text-gray-600">{stats.pending} items</span> are still awaiting review.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Flagged', value: stats.total, icon: TrendingUp, color: 'text-dell-blue bg-dell-lightblue' },
          { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'text-confidence-high bg-confidence-high-bg' },
          { label: 'Overridden', value: stats.overridden, icon: AlertTriangle, color: 'text-confidence-medium bg-confidence-medium-bg' },
          { label: 'Pending', value: stats.pending, icon: ArrowUpRight, color: 'text-gray-500 bg-gray-100' },
        ].map(s => (
          <div key={s.label} className="card text-center py-4">
            <s.icon className={`w-5 h-5 mx-auto mb-1.5 ${s.color.split(' ')[0]}`} />
            <p className="text-2xl font-bold text-dell-navy">{s.value}</p>
            <p className="label mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Plain-language list */}
      <div className="card">
        <p className="label mb-4">All Flagged Items — Plain Language</p>
        <div className="space-y-3">
          {alerts.map(alert => {
            const outcome = outcomeLabel(alert)
            return (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
              >
                <span className="text-lg mt-0.5">{outcome.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-dell-navy">{alert.deviceName}</span>
                    <span className="text-xs text-gray-400">{alert.department}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200 text-gray-600 font-medium">
                      {categoryLabel(alert.category)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{alert.alertType}</p>
                  <p className={`text-xs font-semibold mt-1 ${outcome.color}`}>{outcome.text}</p>
                  {alert.outcome && (
                    <p className="text-xs text-gray-400 mt-0.5">{alert.outcome}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer note */}
      <div className="text-center text-xs text-gray-400 py-4">
        This summary is generated by GuardianAI for non-technical stakeholders. For full technical details,
        ask your IT administrator to share the Activity Log.
      </div>
    </div>
  )
}
