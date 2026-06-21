import { History, ChevronDown, ChevronUp } from 'lucide-react'
import { useState, useEffect } from 'react'
export default function EvidenceTimeline({ events = [] }) {
  const [open, setOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(0)
  useEffect(() => {
  if (!open) {
    setVisibleCount(0)
    return
  }

  let delay = 500

  events.forEach((_, index) => {
    setTimeout(() => {
      setVisibleCount(index + 1)
    }, delay)

    delay += 1400
  })
}, [open])
  return (
    <div className="card">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-dell-blue" />
          <div className="text-left">
            <p className="font-bold text-dell-navy">
              Evidence Timeline
            </p>
            <p className="text-xs text-gray-500">
              See how GuardianAI reached this recommendation
            </p>
          </div>
        </div>

        {open ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {open && (
        <div className="mt-6 space-y-4 animate-fade-in">
          {events.slice(0, visibleCount).map((event, index) => (
              <div
                key={index}
                className="flex gap-4 animate-fade-in"
                style={{
                  animationDelay: `${index * 250}ms`
                }}
              >
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-dell-blue" />

                {index !== events.length - 1 && (
                  <div
                    className="
                      w-0.5 bg-gray-200 mt-1
                      animate-grow-line
                    "
                  />
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-dell-blue">
                  {event.time}
                </p>

                <p className="text-sm text-gray-700 mt-1">
                  {event.event}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}