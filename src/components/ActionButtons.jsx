// ActionButtons.jsx — Mandatory Transparency Element #5
// All 5 Human-in-the-Loop controls. Present on EVERY recommendation.
export default function ActionButtons({ alertId, status, onApprove, onOverride, onAskWhy, onAlternatives, onEscalate }) {
  const isActed = status === 'APPROVED' || status === 'OVERRIDDEN'

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* 1. APPROVE — Primary action */}
      <button
        id={`btn-approve-${alertId}`}
        onClick={onApprove}
        disabled={isActed}
        className={`btn-primary flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${status === 'APPROVED' ? 'bg-confidence-high border-confidence-high' : ''}`}
      >
        <span>✅</span>
        {status === 'APPROVED' ? 'Approved' : 'Approve'}
      </button>

      {/* 2. OVERRIDE — Secondary action */}
      <button
        id={`btn-override-${alertId}`}
        onClick={onOverride}
        disabled={isActed}
        className="btn-secondary flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>↩</span>
        Override
      </button>

      {/* 3. ASK WHY — Explanation link */}
      <button
        id={`btn-askwhy-${alertId}`}
        onClick={onAskWhy}
        className="btn-link flex items-center gap-1"
      >
        <span>❓</span>
        Ask Why
      </button>

      {/* 4. SEE ALTERNATIVES — Comparison mode */}
      <button
        id={`btn-alternatives-${alertId}`}
        onClick={onAlternatives}
        className="btn-outline flex items-center gap-1.5"
      >
        <span>⇄</span>
        See Alternatives
      </button>

      {/* 5. ESCALATE — Danger outline */}
      <button
        id={`btn-escalate-${alertId}`}
        onClick={onEscalate}
        className="btn-danger flex items-center gap-1.5"
      >
        <span>⬆</span>
        Escalate
      </button>
    </div>
  )
}
