// ActionButtons.jsx — Mandatory Transparency Element #5
// All 5 Human-in-the-Loop controls. Present on EVERY recommendation.
// Fix 4: aria-labels added for WCAG 2.1 AA compliance.
export default function ActionButtons({ alertId, status, onApprove, onOverride, onAskWhy, onAlternatives, onEscalate }) {
  const isActed = status === 'APPROVED' || status === 'OVERRIDDEN'

  return (
    <div className="flex flex-wrap gap-2 items-center" role="group" aria-label="Human-in-the-loop decision controls">
      {/* 1. APPROVE — Primary action */}
      <button
        id={`btn-approve-${alertId}`}
        onClick={onApprove}
        disabled={isActed}
        aria-label="Approve this AI recommendation"
        className={`btn-primary flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${status === 'APPROVED' ? 'bg-confidence-high border-confidence-high' : ''}`}
      >
        <span aria-hidden="true">✅</span>
        {status === 'APPROVED' ? 'Approved' : 'Approve'}
      </button>

      {/* 2. OVERRIDE — Secondary action */}
      <button
        id={`btn-override-${alertId}`}
        onClick={onOverride}
        disabled={isActed}
        aria-label="Override this AI recommendation with your own decision"
        className="btn-secondary flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span aria-hidden="true">↩</span>
        Override
      </button>

      {/* 3. ASK WHY — Explanation link */}
      <button
        id={`btn-askwhy-${alertId}`}
        onClick={onAskWhy}
        aria-label="Ask why the AI made this recommendation"
        className="btn-link flex items-center gap-1"
      >
        <span aria-hidden="true">❓</span>
        Ask Why
      </button>

      {/* 4. SEE ALTERNATIVES — Comparison mode */}
      <button
        id={`btn-alternatives-${alertId}`}
        onClick={onAlternatives}
        aria-label="View alternative AI recommendations for comparison"
        className="btn-outline flex items-center gap-1.5"
      >
        <span aria-hidden="true">⇄</span>
        See Alternatives
      </button>

      {/* 5. ESCALATE — Danger outline */}
      <button
        id={`btn-escalate-${alertId}`}
        onClick={onEscalate}
        aria-label="Escalate this issue to the security team"
        className="btn-danger flex items-center gap-1.5"
      >
        <span aria-hidden="true">⬆</span>
        Escalate
      </button>
    </div>
  )
}
