// Navbar.jsx — Top navigation with Autonomy Mode badge
import { Link, useLocation } from 'react-router-dom'
import { Bell, User, Shield, Activity, Settings, LayoutDashboard, FileText } from 'lucide-react'

export default function Navbar({ autonomyMode, alertCount = 0 }) {
  const loc = useLocation()
  const autonomyLabels = {
    'always-ask': { label: 'Always Ask Me', color: 'bg-blue-100 text-blue-700' },
    'recommend-wait': { label: 'Recommend & Wait', color: 'bg-blue-100 text-blue-700' },
    'act-low-risk': { label: 'Act on Low-Risk', color: 'bg-amber-100 text-amber-700' },
    'act-notify': { label: 'Act and Notify', color: 'bg-red-100 text-red-700' },
  }
  const mode = autonomyLabels[autonomyMode] || autonomyLabels['always-ask']
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/log', label: 'Activity Log', icon: Activity },
    { to: '/settings', label: 'Settings', icon: Settings },
    { to: '/summary', label: 'Summary', icon: FileText },
  ]

  return (
    <header className="bg-dell-navy text-white px-6 py-0 flex items-center justify-between sticky top-0 z-40 shadow-lg">
      {/* Logo */}
      <div className="flex items-center gap-8 h-14">
        <Link to="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight">
          <div className="w-8 h-8 bg-dell-blue rounded-lg flex items-center justify-center shadow-inner">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-white">Guardian<span className="text-dell-blue">AI</span></span>
        </Link>
        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1 h-full">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150
                ${loc.pathname === to ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Autonomy mode badge */}
        <Link to="/settings" className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${mode.color} hover:opacity-80 transition-opacity`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current inline-block animate-pulse" />
          {mode.label}
        </Link>

        {/* Notification bell */}
        <button id="btn-notifications" className="relative p-2 rounded-lg hover:bg-white/10 transition-colors">
          <Bell className="w-5 h-5 text-white/80" />
          {alertCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
              {alertCount > 9 ? '9+' : alertCount}
            </span>
          )}
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2 pl-1">
          <div className="w-8 h-8 bg-dell-blue rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white/20">
            AC
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-white leading-none">Alex Chen</p>
            <p className="text-[10px] text-white/50 leading-none mt-0.5">IT Admin</p>
          </div>
        </div>
      </div>
    </header>
  )
}
