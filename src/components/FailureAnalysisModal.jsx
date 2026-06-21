import { X, AlertTriangle } from 'lucide-react'

export default function FailureAnalysisModal({
  incident,
  device,
  onClose
}) {
  return (
    <div className="
      fixed inset-0
      bg-black/30
      backdrop-blur-md
      flex items-center justify-center
      z-50
    ">
      <div className="
        w-full
        max-w-2xl
        rounded-3xl

        bg-white/70
        backdrop-blur-xl

        border border-white/40

        shadow-2xl

        overflow-hidden
      ">
        <div className="
          flex items-center justify-between
          px-6 py-4
          border-b border-white/30
        ">
          <div>
            <h2 className="font-bold text-xl text-dell-navy">
              AI Failure Analysis
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {device}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">

          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <h3 className="font-bold text-red-700 mb-2">
              Root Cause
            </h3>

            <p className="text-sm text-red-800">
              {incident.rootCause}
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h3 className="font-bold text-amber-700 mb-2">
              Telemetry Gap
            </h3>

            <p className="text-sm text-amber-800">
              {incident.telemetryGap}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-bold text-blue-700 mb-2">
              Resolution
            </h3>

            <p className="text-sm text-blue-800">
              {incident.impactMitigation}
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h3 className="font-bold text-green-700 mb-2">
              What GuardianAI Learned
            </h3>

            <p className="text-sm text-green-800">
              {incident.preventiveAction}
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}