// LandingPage.jsx — Dell-branded entry point
// Hero → Problem Statement → GuardianAI Intro → Navigate to all screens
import { useNavigate } from 'react-router-dom'
import { Shield, AlertTriangle, Eye, Users, ChevronRight, Monitor, Lock, Brain, BarChart3, ArrowRight, Zap, CheckCircle } from 'lucide-react'

const SCREENS = [
  { to: '/dashboard', label: 'AI Dashboard', desc: 'Real-time fleet alerts sorted by priority — approve or override in one click', icon: Monitor, color: 'from-blue-500 to-blue-700' },
  { to: '/dashboard', label: 'Detail Panel', desc: 'All 5 transparency elements: reasoning, confidence, data source, limitations, controls', icon: Eye, color: 'from-emerald-500 to-emerald-700', note: 'Click "View Details" on any alert' },
  { to: '/log', label: 'Activity Log', desc: 'Full audit trail — search, filter, export CSV — every AI action permanently recorded', icon: BarChart3, color: 'from-purple-500 to-purple-700' },
  { to: '/settings', label: 'Autonomy Dial', desc: 'Control AI autonomy from "Always Ask Me" to "Act & Notify" — 4 levels', icon: Zap, color: 'from-amber-500 to-amber-700' },
  { to: '/summary', label: 'Executive Summary', desc: 'Plain-language digest for non-technical stakeholders — zero jargon', icon: Users, color: 'from-rose-500 to-rose-700' },
]

const TRANSPARENCY = [
  { num: '01', title: 'Reasoning Steps', desc: 'Plain English, no ML jargon, 3–4 bullets', icon: '🧠' },
  { num: '02', title: 'Confidence Indicator', desc: 'Label + colour — never a raw percentage', icon: '🟢' },
  { num: '03', title: 'Data Source Attribution', desc: 'Exact device count + time window cited', icon: '🗄️' },
  { num: '04', title: 'Known Limitations', desc: 'Always shown — even at HIGH confidence', icon: '⚠️' },
  { num: '05', title: 'Human-in-the-Loop', desc: 'Approve · Override · Ask Why · Alternatives · Escalate', icon: '🙋' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">

      {/* ─── HERO — Dell branded ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dell-navy via-[#002952] to-[#001a33]">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-dell-blue/20 rounded-full blur-[160px]" />

        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
          {/* Dell badge */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-dell-blue rounded-xl flex items-center justify-center shadow-lg shadow-dell-blue/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-xl tracking-tight">Guardian<span className="text-dell-blue">AI</span></span>
              <span className="block text-white/40 text-[10px] uppercase tracking-[0.25em] font-semibold">Dell Hackathon 2024</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.1] max-w-3xl">
            AI that explains itself —{' '}
            <span className="bg-gradient-to-r from-dell-blue to-blue-400 bg-clip-text text-transparent">
              so you can trust it.
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed">
            Every AI recommendation is explained, calibrated, sourced, limited, and human-gated.
            No black boxes. No blind trust. Full transparency for IT fleet management.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              id="btn-enter-dashboard"
              onClick={() => navigate('/dashboard')}
              className="group flex items-center gap-2 bg-dell-blue hover:bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold text-base shadow-lg shadow-dell-blue/30 hover:shadow-xl hover:shadow-dell-blue/40 transition-all duration-200 active:scale-95"
            >
              Enter Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#problem"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white/80 hover:text-white px-6 py-3.5 rounded-xl font-semibold text-base backdrop-blur transition-all duration-200"
            >
              Read Problem Statement
            </a>
          </div>

          {/* Quick stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg">
            {[
              { val: '2,400', label: 'Devices Monitored' },
              { val: '5/5', label: 'Transparency Elements' },
              { val: '6', label: 'Linked Screens' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl md:text-3xl font-extrabold text-white">{s.val}</p>
                <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROBLEM STATEMENT ─── */}
      <section id="problem" className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          <p className="label text-dell-blue mb-3">The Problem</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-dell-navy leading-tight max-w-2xl">
            AI recommendations in IT dashboards are opaque
          </h2>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed max-w-2xl">
            Admins managing thousands of Dell devices receive AI-generated alerts daily — patch this, investigate that, escalate this.
            But the AI never explains <strong>why</strong>. So admins either <span className="text-confidence-low font-semibold">blindly trust</span> or <span className="text-confidence-medium font-semibold">completely ignore</span> the recommendations.
          </p>

          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {[
              { icon: AlertTriangle, color: 'text-confidence-low', bg: 'bg-confidence-low-bg', title: 'No Reasoning', desc: 'AI says "patch this device" but never explains why — what data? what risk? what happens if I don\'t?' },
              { icon: Lock, color: 'text-confidence-medium', bg: 'bg-confidence-medium-bg', title: 'No Confidence Signal', desc: 'Is the AI 95% sure or 40% sure? Admins have no way to gauge reliability of the recommendation.' },
              { icon: Users, color: 'text-dell-blue', bg: 'bg-dell-lightblue', title: 'No Human Control', desc: 'Binary accept/reject. No override workflow, no escalation path, no audit trail, no feedback loop.' },
            ].map(p => (
              <div key={p.title} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <div className={`w-10 h-10 ${p.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <p.icon className={`w-5 h-5 ${p.color}`} />
                </div>
                <h3 className="font-bold text-dell-navy text-base mb-1">{p.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OUR SOLUTION: GuardianAI ─── */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          <p className="label text-dell-blue mb-3">Our Solution</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-dell-navy leading-tight max-w-3xl">
            GuardianAI — a dashboard where every AI recommendation is{' '}
            <span className="text-dell-blue">explained, sourced, and human-gated</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl">
            Built for Alex Chen — IT Admin, 2,400 Dell devices, zero ML knowledge.
            Every screen answers: <em>"What did the AI decide, why, how sure is it, and what don't it know?"</em>
          </p>

          {/* 5 Transparency Elements */}
          <div className="mt-12">
            <p className="label text-gray-400 mb-5">The 5 Mandatory Transparency Elements</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {TRANSPARENCY.map(t => (
                <div key={t.num} className="bg-gray-50 rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-dell-blue/20 transition-all duration-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{t.icon}</span>
                    <span className="text-[10px] font-bold text-dell-blue bg-dell-lightblue px-2 py-0.5 rounded-full">{t.num}</span>
                  </div>
                  <h3 className="font-bold text-dell-navy text-sm mb-1">{t.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── ALL SCREENS ─── */}
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          <p className="label text-dell-blue mb-3">Explore the Prototype</p>
          <h2 className="text-3xl font-extrabold text-dell-navy mb-8">All Screens</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SCREENS.map(s => (
              <button
                key={s.label}
                id={`nav-${s.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => navigate(s.to)}
                className="group text-left bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-lg hover:border-dell-blue/30 transition-all duration-200 active:scale-[0.98]"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 shadow-sm`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-dell-navy text-base mb-1 flex items-center gap-1.5">
                  {s.label}
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-dell-blue group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                {s.note && (
                  <p className="text-xs text-dell-blue mt-2 font-medium">{s.note}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-dell-navy text-white/50 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-dell-blue" />
            <span className="text-sm font-semibold text-white/70">GuardianAI</span>
            <span className="text-xs">· Dell Hackathon 2024</span>
          </div>
          <p className="text-xs text-center">
            "AI that explains itself — so you can trust it." · Built with React + Tailwind CSS · No backend required
          </p>
          <div className="flex items-center gap-1">
            {['Reasoning', 'Confidence', 'Data', 'Limits', 'Controls'].map(e => (
              <span key={e} className="flex items-center gap-0.5 text-[10px] bg-white/10 px-2 py-0.5 rounded-full">
                <CheckCircle className="w-2.5 h-2.5 text-green-400" /> {e}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
