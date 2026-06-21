// ConfidenceBadge.jsx — Mandatory Transparency Element #2
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'

export default function ConfidenceBadge({
  level,
  score,
  driver,
  size = 'sm',
  pulse = false
}) {
  const config = {
    HIGH: {
      label: 'HIGH CONFIDENCE',
      classes: 'bg-confidence-high-bg text-confidence-high border-confidence-high/30',
      bar: 'bg-confidence-high',
      icon: CheckCircle2,
    },
    MEDIUM: {
      label: 'REVIEW RECOMMENDED',
      classes: 'bg-confidence-medium-bg text-confidence-medium border-confidence-medium/30',
      bar: 'bg-confidence-medium',
      icon: AlertTriangle,
    },
    LOW: {
      label: 'LOW CONFIDENCE',
      classes: 'bg-confidence-low-bg text-confidence-low border-confidence-low/30',
      bar: 'bg-confidence-low',
      icon: XCircle,
    },
  }

  const c = config[level] || config.MEDIUM
  const Icon = c.icon

  if (size === 'lg') {
  return (
    <div className="relative inline-block group">

      {/* Large Badge */}
      <div
        className={`inline-flex flex-col items-center gap-2 px-6 py-4 rounded-2xl border-2 ${c.classes} ${
          pulse && level === 'LOW' ? 'pulse-critical' : ''
        }`}
      >
        <div className="flex items-center gap-2">
          <Icon className="w-6 h-6 flex-shrink-0" />
          <span className="text-xl font-bold tracking-wide">
            {c.label}
          </span>
        </div>

        <div className="w-48 h-3 bg-black/10 rounded-full overflow-hidden mt-1">
          <div
            className={`h-full ${c.bar} rounded-full confidence-bar`}
            style={{ width: `${score}%` }}
          />
        </div>

        <span className="text-sm opacity-70 font-semibold">
          {c.label}
        </span>
      </div>

      {/* Tooltip */}
      <div
        className="
          absolute
          left-1/2
          top-full
          -translate-x-1/2
          mt-3
          w-80
          rounded-xl
          bg-gray-900
          text-white
          px-4
          py-3
          text-xs
          shadow-2xl
          opacity-0
          invisible
          group-hover:opacity-100
          group-hover:visible
          transition-all
          duration-200
          z-50
        "
      >
        <div
          className="
            absolute
            -top-2
            left-1/2
            -translate-x-1/2
            w-4
            h-4
            bg-gray-900
            rotate-45
          "
        />

        <p className="font-semibold mb-1">
          Why this confidence level?
        </p>

        <p className="text-gray-200 leading-relaxed">
          {driver ||
            'Based on historical fleet telemetry, similar device outcomes, policy matches and risk analysis.'}
        </p>
      </div>

    </div>
  )
}
  return (
  <div className="relative inline-block group">
    <span
      className={`badge border ${c.classes} ${
        pulse && level === 'LOW' ? 'pulse-critical' : ''
      } gap-1.5 cursor-help`}
    >
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      <span>{c.label}</span>
    </span>

    {/* Tooltip */}
    <div
      className="
        absolute
        z-50

        left-1/2
        top-full

        -translate-x-1/2

        mt-2

        w-72

        rounded-xl

        bg-gray-900
        text-white

        px-4
        py-3

        text-xs

        shadow-2xl

        opacity-0
        invisible

        group-hover:opacity-100
        group-hover:visible

        transition-all
        duration-200
      "
    >
      <p className="font-semibold mb-1">
        Confidence Assessment
      </p>

      <p className="text-gray-200 leading-relaxed">
        {driver ||
          'Based on historical fleet telemetry, similar device outcomes, policy matches and risk analysis.'}
      </p>
    </div>
  </div>
)
}
