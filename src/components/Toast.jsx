// Toast.jsx — Notification feedback for user actions
import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'

export default function Toast({ message, type = 'success', onClose }) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      setExiting(true)
      setTimeout(onClose, 300)
    }, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  const config = {
    success: { icon: CheckCircle, bg: 'bg-confidence-high-bg border-confidence-high/30', text: 'text-confidence-high', iconColor: 'text-confidence-high' },
    error: { icon: XCircle, bg: 'bg-confidence-low-bg border-confidence-low/30', text: 'text-confidence-low', iconColor: 'text-confidence-low' },
    warning: { icon: AlertTriangle, bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800', iconColor: 'text-amber-600' },
    info: { icon: Info, bg: 'bg-dell-lightblue border-dell-blue/20', text: 'text-dell-navy', iconColor: 'text-dell-blue' },
  }
  const c = config[type]
  const Icon = c.icon

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-start gap-3 px-5 py-4 rounded-xl border shadow-xl max-w-sm ${c.bg} ${exiting ? 'toast-exit' : 'toast-enter'}`}>
      <Icon className={`w-5 h-5 ${c.iconColor} flex-shrink-0 mt-0.5`} />
      <p className={`text-sm font-medium ${c.text} leading-relaxed`}>{message}</p>
    </div>
  )
}
