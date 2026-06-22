// ActionButtons.jsx — Mandatory Transparency Element #5
// All 5 Human-in-the-Loop controls. Present on EVERY recommendation.
// Fix 4: aria-labels added for WCAG 2.1 AA compliance.
export default function ActionButtons({ alertId, status, isExecuting, onApprove, onOverride, onAskWhy, onAlternatives, onEscalate }) {
  const isActed = status === 'APPROVED' || status === 'OVERRIDDEN' || status === 'ESCALATED'

  return (
    <div className="flex flex-wrap gap-2 items-center" role="group" aria-label="Human-in-the-loop decision controls">
      {/* 1. APPROVE — Primary action */}
      <button
        id={`btn-approve-${alertId}`}
        onClick={onApprove}
        disabled={isActed || isExecuting}
        aria-label="Approve this AI recommendation"
        className={`btn-primary flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${status === 'APPROVED' ? 'bg-confidence-high border-confidence-high' : ''} ${isExecuting ? 'cursor-wait opacity-85' : ''}`}
      >
        {isExecuting ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" aria-hidden="true" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span aria-hidden="true">✅</span>
            <span>{status === 'APPROVED' ? 'Approved' : 'Approve'}</span>
          </>
        )}
      </button>

      {/* 2. OVERRIDE — Secondary action */}
      <button
        id={`btn-override-${alertId}`}
        onClick={onOverride}
        disabled={isActed || isExecuting}
        aria-label="Override this AI recommendation with your own decision"
        className="btn-secondary flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span aria-hidden="true">↩</span>
        Override
      </button>

      {/* 3. ASK WHY — Explanation button with border */}
      <button
        id={`btn-askwhy-${alertId}`}
        onClick={onAskWhy}
        disabled={isExecuting}
        aria-label="Ask why the AI made this recommendation"
        className="btn-outline flex items-center gap-1.5 text-dell-blue border-dell-blue/30 hover:bg-dell-lightblue disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span aria-hidden="true">❓</span>
        Ask Why
      </button>

      {/* 4. SEE ALTERNATIVES — Comparison mode */}
      <button
        id={`btn-alternatives-${alertId}`}
        onClick={onAlternatives}
        disabled={isExecuting}
        aria-label="View alternative AI recommendations for comparison"
        className="btn-outline flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span aria-hidden="true">⇄</span>
        See Alternatives
      </button>

      {/* 5. ESCALATE — Danger outline */}
      <button
        id={`btn-escalate-${alertId}`}
        onClick={onEscalate}
        disabled={isActed || isExecuting}
        aria-label="Escalate this issue to the security team"
        className={`btn-danger flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${status === 'ESCALATED' ? 'bg-purple-50 text-purple-700 border-purple-300' : ''}`}
      >
        <span aria-hidden="true">⬆</span>
        {status === 'ESCALATED' ? 'Escalated' : 'Escalate'}
      </button>
    </div>
  )
}
