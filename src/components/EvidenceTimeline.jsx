import { History, ChevronDown, ChevronUp } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function EvidenceTimeline({ events = [] }) {
  const [open, setOpen]               = useState(false)
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    if (!open) { setVisibleCount(0); return }
    let delay = 500
    events.forEach((_, index) => {
      setTimeout(() => setVisibleCount(index + 1), delay)
      delay += 1400
    })
  }, [open])

  // Blue-family dot colors to match dell theme
  const dotColors = [
    'bg-dell-blue',
    'bg-blue-400',
    'bg-sky-500',
    'bg-cyan-500',
    'bg-blue-600',
    'bg-sky-400',
    'bg-cyan-400',
  ]

  return (
    <div className="bg-gradient-to-br from-white to-blue-50/30 border border-blue-100 rounded-2xl p-6">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between group">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-dell-lightblue border border-dell-blue/20 flex items-center justify-center">
            <History className="w-3.5 h-3.5 text-dell-blue" />
          </div>
          <div className="text-left">
            <p className="font-bold text-dell-navy text-sm">Evidence Timeline</p>
            <p className="text-xs text-gray-400">How GuardianAI reached this recommendation</p>
          </div>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-gray-400" />
          : <ChevronDown className="w-4 h-4 text-gray-400" />
        }
      </button>

      {open && (
        <div className="mt-5 space-y-0 animate-fade-in">
          {events.slice(0, visibleCount).map((event, index) => (
            <div key={index} className="flex gap-4 animate-fade-in" style={{ animationDelay: `${index * 250}ms` }}>
              <div className="flex flex-col items-center">
                <div className={`w-3.5 h-3.5 rounded-full ${dotColors[index % dotColors.length]} shadow-sm ring-2 ring-white ring-offset-1`} />
                {index !== events.length - 1 && (
                  <div className="w-0.5 bg-gradient-to-b from-dell-blue/30 to-blue-100 mt-1 animate-grow-line" />
                )}
              </div>
              <div className="pb-5">
                <p className="text-xs font-bold text-dell-blue">{event.time}</p>
                <p className="text-sm text-gray-700 mt-0.5">{event.event}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
