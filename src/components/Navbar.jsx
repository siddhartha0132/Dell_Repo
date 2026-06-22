// Navbar.jsx — Top navigation with Autonomy Mode badge
import { Link, useLocation } from 'react-router-dom'
import { Bell, Shield, Activity, Settings, LayoutDashboard, FileText } from 'lucide-react'

export default function Navbar({ autonomyMode, alertCount = 0 }) {
  const loc = useLocation()
  const autonomyLabels = {
    'always-ask':     { label: 'Always Ask Me',      color: 'bg-blue-100 text-blue-700 border border-blue-200' },
    'recommend-wait': { label: 'Recommend & Wait',   color: 'bg-blue-100 text-blue-700 border border-blue-200' },
    'act-low-risk':   { label: 'Act on Low-Risk',    color: 'bg-amber-100 text-amber-700 border border-amber-200' },
    'act-notify':     { label: 'Act and Notify',     color: 'bg-red-100 text-red-700 border border-red-200' },
  }
  const mode = autonomyLabels[autonomyMode] || autonomyLabels['always-ask']
  const navItems = [
    { to: '/dashboard', label: 'Dashboard',   icon: LayoutDashboard },
    { to: '/log',       label: 'Activity Log', icon: Activity },
    { to: '/settings',  label: 'Settings',    icon: Settings },
    { to: '/summary',   label: 'Summary',     icon: FileText },
  ]

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Logo + Nav */}
      <div className="flex items-center gap-8 h-14">
        <Link to="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight group">
          <div className="w-8 h-8 bg-gradient-to-br from-dell-blue to-blue-700 rounded-xl flex items-center justify-center shadow-md shadow-blue-200 group-hover:shadow-blue-300 transition-shadow">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-dell-navy">Guardian<span className="text-dell-blue">AI</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 h-full">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = loc.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'bg-dell-lightblue text-dell-blue'
                    : 'text-gray-500 hover:text-dell-navy hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-dell-blue ml-0.5" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Autonomy mode badge */}
        <Link
          to="/settings"
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${mode.color} hover:opacity-80 transition-opacity`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current inline-block animate-pulse" />
          {mode.label}
        </Link>

        {/* Notification bell */}
        <Link
          id="btn-notifications"
          to="/dashboard"
          className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <Bell className="w-5 h-5 text-gray-500" />
          {alertCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
              {alertCount > 9 ? '9+' : alertCount}
            </span>
          )}
        </Link>

        {/* Avatar */}
        <div className="flex items-center gap-2 pl-1 border-l border-gray-100 ml-1">
          <div className="w-8 h-8 bg-gradient-to-br from-dell-blue to-blue-700 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm">
            AC
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-dell-navy leading-none">Alex Chen</p>
            <p className="text-[10px] text-gray-400 leading-none mt-0.5">IT Admin</p>
          </div>
        </div>
      </div>
    </header>
  )
}
