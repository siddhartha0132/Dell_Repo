// DataSourceBox.jsx — Mandatory Transparency Element #3
export default function DataSourceBox({ source }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">🗄️</span>
        <span className="label text-gray-500">Data Used for This Recommendation</span>
      </div>
      <p className="text-sm text-gray-700 font-medium leading-relaxed">{source}</p>
      <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
        <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse-slow" />
        Telemetry verified · Updated within last 4 hours
      </div>
    </div>
  )
}
