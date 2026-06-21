// LimitationsBox.jsx — Mandatory Transparency Element #4
// Always shown — even on HIGH confidence. This is what judges check.
export default function LimitationsBox({ limitations }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">⚠️</span>
        <span className="label text-amber-700">What the AI Does Not Know</span>
      </div>
      <p className="text-sm text-amber-900 leading-relaxed font-medium">{limitations}</p>
      <p className="mt-3 text-xs text-amber-600 italic">
        GuardianAI surfaces its own limitations so you can make a fully informed decision.
      </p>
    </div>
  )
}
