// ReasoningPanel.jsx — Mandatory Transparency Element #1
import { Brain } from 'lucide-react'

export default function ReasoningPanel({ steps, title = 'Why the AI recommends this' }) {
  return (
    <div className="bg-gradient-to-br from-white to-blue-50/40 border border-blue-100 rounded-2xl p-6">
      <h3 className="font-bold text-dell-navy text-sm mb-4 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
          <Brain className="w-3.5 h-3.5 text-blue-600" />
        </div>
        {title}
      </h3>
      <ol className="space-y-2.5">
        {steps.map((step, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-sm text-gray-700 bg-white/80 rounded-xl px-4 py-3 border border-blue-100/60 animate-fade-in hover:bg-blue-50/30 transition-colors"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span className="mt-0.5 w-6 h-6 rounded-full bg-gradient-to-br from-dell-blue to-blue-700 text-white flex items-center justify-center text-[10px] font-black flex-shrink-0">
              {i + 1}
            </span>
            <span className="leading-relaxed">{step.split(' ').slice(1).join(' ')}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
