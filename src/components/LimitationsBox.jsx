// LimitationsBox.jsx — Mandatory Transparency Element #4
import { AlertTriangle } from 'lucide-react'

export default function LimitationsBox({ limitations }) {
  return (
    <div className="bg-gradient-to-br from-white to-amber-50/60 border border-amber-200 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        </div>
        <span className="label text-amber-700">What the AI Does Not Know</span>
      </div>
      <p className="text-sm text-amber-900 leading-relaxed font-medium">{limitations}</p>
      <p className="mt-3 text-xs text-amber-600 italic bg-amber-50 rounded-xl px-3 py-2 border border-amber-100">
        GuardianAI surfaces its own limitations so you can make a fully informed decision.
      </p>
    </div>
  )
}
