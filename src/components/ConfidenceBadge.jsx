// ConfidenceBadge.jsx — Mandatory Transparency Element #2
export default function ConfidenceBadge({ level, score, size = 'sm', pulse = false }) {
  const config = {
    HIGH: {
      label: '🟢 HIGH CONFIDENCE',
      classes: 'bg-confidence-high-bg text-confidence-high border-confidence-high/30',
      bar: 'bg-confidence-high',
      icon: '✓',
    },
    MEDIUM: {
      label: '🟡 REVIEW RECOMMENDED',
      classes: 'bg-confidence-medium-bg text-confidence-medium border-confidence-medium/30',
      bar: 'bg-confidence-medium',
      icon: '!',
    },
    LOW: {
      label: '🔴 LOW CONFIDENCE',
      classes: 'bg-confidence-low-bg text-confidence-low border-confidence-low/30',
      bar: 'bg-confidence-low',
      icon: '?',
    },
  }

  const c = config[level] || config.MEDIUM

  if (size === 'lg') {
    return (
      <div className={`inline-flex flex-col items-center gap-2 px-6 py-4 rounded-2xl border-2 ${c.classes} ${pulse && level === 'LOW' ? 'pulse-critical' : ''}`}>
        <span className="text-2xl font-bold tracking-wide">{c.label}</span>
        <div className="w-48 h-3 bg-black/10 rounded-full overflow-hidden">
          <div
            className={`h-full ${c.bar} rounded-full confidence-bar`}
            style={{ width: `${score}%` }}
          />
        </div>
        <span className="text-sm opacity-70 font-medium">Score: {score}/100 — {c.label.split(' ').slice(1).join(' ')}</span>
      </div>
    )
  }

  return (
    <span className={`badge border ${c.classes} ${pulse && level === 'LOW' ? 'pulse-critical' : ''}`}>
      <span className="font-bold">{c.icon}</span>
      {level === 'HIGH' ? 'HIGH CONFIDENCE' : level === 'MEDIUM' ? 'REVIEW RECOMMENDED' : 'LOW CONFIDENCE'}
    </span>
  )
}
