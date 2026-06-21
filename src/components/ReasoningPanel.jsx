// ReasoningPanel.jsx — Mandatory Transparency Element #1
export default function ReasoningPanel({ steps, title = 'Why the AI recommends this' }) {
  return (
    <div className="card">
      <h3 className="font-semibold text-dell-navy text-base mb-4 flex items-center gap-2">
        <span className="text-xl">🧠</span>
        {title}
      </h3>
      <ul className="space-y-3">
        {steps.map((step, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-sm text-gray-700 bg-gray-50 rounded-lg px-4 py-3 border border-gray-100 animate-fade-in"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span className="mt-0.5 flex-shrink-0 text-base">{step.split(' ')[0]}</span>
            <span className="leading-relaxed">{step.split(' ').slice(1).join(' ')}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
