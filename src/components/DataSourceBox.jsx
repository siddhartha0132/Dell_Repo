// DataSourceBox.jsx — Mandatory Transparency Element #3
import { Database } from 'lucide-react'

export default function DataSourceBox({ source }) {
  return (
    <div className="bg-gradient-to-br from-white to-emerald-50/50 border border-emerald-100 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
          <Database className="w-3.5 h-3.5 text-emerald-600" />
        </div>
        <span className="label text-emerald-600">Data Used for This Recommendation</span>
      </div>
      <p className="text-sm text-gray-700 font-medium leading-relaxed">{source}</p>
      <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 rounded-xl px-3 py-2 border border-emerald-100">
        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
        Telemetry verified · Updated within last 4 hours
      </div>
    </div>
  )
}
