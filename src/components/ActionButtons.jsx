// ActionButtons.jsx — Mandatory Transparency Element #5
// All 5 Human-in-the-Loop controls. Present on EVERY recommendation.
export default function ActionButtons({ alertId, status, isExecuting, onApprove, onOverride, onAskWhy, onAlternatives, onEscalate }) {
  const isActed = status === 'APPROVED' || status === 'OVERRIDDEN' || status === 'ESCALATED'

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* 1. APPROVE — Primary action */}
      <button
        id={`btn-approve-${alertId}`}
        onClick={onApprove}
        disabled={isActed || isExecuting}
        className={`btn-primary flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${status === 'APPROVED' ? 'bg-confidence-high border-confidence-high' : ''} ${isExecuting ? 'cursor-wait opacity-85' : ''}`}
      >
        {isExecuting ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>✅</span>
            <span>{status === 'APPROVED' ? 'Approved' : 'Approve'}</span>
          </>
        )}
      </button>

      {/* 2. OVERRIDE — Secondary action */}
      <button
        id={`btn-override-${alertId}`}
        onClick={onOverride}
        disabled={isActed || isExecuting}
        className="btn-secondary flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>↩</span>
        Override
      </button>

      {/* 3. ASK WHY — Explanation link */}
      <button
        id={`btn-askwhy-${alertId}`}
        onClick={onAskWhy}
        disabled={isExecuting}
        className="btn-link flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>❓</span>
        Ask Why
      </button>

      {/* 4. SEE ALTERNATIVES — Comparison mode */}
      <button
        id={`btn-alternatives-${alertId}`}
        onClick={onAlternatives}
        disabled={isExecuting}
        className="btn-outline flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>⇄</span>
        See Alternatives
      </button>

      {/* 5. ESCALATE — Danger outline */}
      <button
        id={`btn-escalate-${alertId}`}
        onClick={onEscalate}
        disabled={isActed || isExecuting}
        className={`btn-danger flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${status === 'ESCALATED' ? 'bg-purple-50 text-purple-700 border-purple-300' : ''}`}
      >
        <span>⬆</span>
        {status === 'ESCALATED' ? 'Escalated' : 'Escalate'}
      </button>
    </div>
  )
}
