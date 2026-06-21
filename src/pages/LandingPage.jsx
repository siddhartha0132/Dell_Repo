import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { Shield, AlertTriangle, Lock, Users, ArrowRight, Monitor, Eye, BarChart3, Zap, ChevronRight, CheckCircle } from 'lucide-react'

/* ── Particle canvas ── */
function ParticleCanvas() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf
    const particles = []
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)

    // buildings
    const buildings = Array.from({ length: 18 }, (_, i) => ({
      x: (i / 18) * 1.2 - 0.1,
      w: 0.025 + Math.random() * 0.04,
      h: 0.12 + Math.random() * 0.35,
      windows: Array.from({ length: 20 }, () => ({ x: Math.random(), y: Math.random(), on: Math.random() > 0.4 }))
    }))

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random(), y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0003,
        vy: -0.0002 - Math.random() * 0.0004,
        size: 1 + Math.random() * 2,
        alpha: 0.4 + Math.random() * 0.6,
        color: Math.random() > 0.6 ? '#facc15' : '#60a5fa'
      })
    }

    const draw = () => {
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)

      // grid lines
      ctx.strokeStyle = 'rgba(96,165,250,0.06)'
      ctx.lineWidth = 1
      for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
      for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

      // buildings
      buildings.forEach(b => {
        const bx = b.x * W, bw = b.w * W, bh = b.h * H, by = H - bh
        ctx.strokeStyle = 'rgba(96,165,250,0.25)'
        ctx.lineWidth = 1
        ctx.strokeRect(bx, by, bw, bh)
        b.windows.forEach(win => {
          if (win.on) {
            ctx.fillStyle = Math.random() > 0.998 ? (win.on = false, 'transparent') : 'rgba(250,204,21,0.7)'
            ctx.fillRect(bx + win.x * bw * 0.8 + bw * 0.1, by + win.y * bh * 0.8 + bh * 0.05, 3, 3)
          }
        })
      })

      // particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.y < -0.01) { p.y = 1; p.x = Math.random() }
        if (p.x < 0 || p.x > 1) p.vx *= -1
        ctx.beginPath()
        ctx.arc(p.x * W, p.y * H, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
        ctx.globalAlpha = 1
      })

      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}

/* ── Terminal Mockup ── */
function Terminal() {
  const lines = [
    { t: 0,   c: 'text-yellow-400', text: '$ guardian-ai analyze --fleet 2400' },
    { t: 400, c: 'text-gray-400',   text: '  ✓ Connecting to device telemetry...' },
    { t: 800, c: 'text-gray-400',   text: '  ✓ Loading ML risk models...' },
    { t: 1200,c: 'text-blue-400',   text: '  → ALT001 · CRITICAL · 847 devices affected' },
    { t: 1600,c: 'text-gray-400',   text: '    Reasoning: CVE-2024-1234 (CVSS 9.8)' },
    { t: 2000,c: 'text-green-400',  text: '    Confidence: HIGH (94%)' },
    { t: 2400,c: 'text-gray-400',   text: '    Source: NIST NVD · Last 14 days' },
    { t: 2800,c: 'text-amber-400',  text: '    ⚠ Limitation: 12% devices unreachable' },
    { t: 3200,c: 'text-purple-400', text: '  → Human action required. Awaiting...' },
    { t: 3600,c: 'text-yellow-400', text: '$ _' },
  ]
  const [visible, setVisible] = useState(0)
  useEffect(() => {
    lines.forEach((l, i) => setTimeout(() => setVisible(i + 1), l.t + 600))
  }, [])
  return (
    <div className="relative bg-[#0a0a0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10">
      {/* title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
        <span className="w-3 h-3 rounded-full bg-red-500/80" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <span className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-3 text-xs text-white/30 font-mono">guardian-ai · live analysis</span>
      </div>
      <div className="px-5 py-4 font-mono text-sm space-y-1.5 min-h-[220px]">
        {lines.slice(0, visible).map((l, i) => (
          <p key={i} className={`${l.c} leading-relaxed`}>{l.text}</p>
        ))}
      </div>
    </div>
  )
}

const SCREENS = [
  { to: '/dashboard', label: 'AI Dashboard', desc: 'Real-time fleet alerts — approve or override in one click', icon: Monitor },
  { to: '/dashboard', label: 'Detail Panel', desc: 'All 5 transparency elements — click "View Details"', icon: Eye, note: 'Click "View Details" on any alert' },
  { to: '/log', label: 'Activity Log', desc: 'Full audit trail — search, filter, export CSV', icon: BarChart3 },
  { to: '/settings', label: 'Autonomy Dial', desc: 'Control AI autonomy across 4 levels', icon: Zap },
  { to: '/summary', label: 'Executive Summary', desc: 'Plain-language digest for stakeholders', icon: Users },
]

const PROBLEMS = [
  { icon: AlertTriangle, color: '#f87171', label: 'No Reasoning', desc: 'AI says "patch this" but never explains why — what data? what risk?' },
  { icon: Lock,          color: '#fbbf24', label: 'No Confidence', desc: 'Is it 95% sure or 40%? Admins have zero way to gauge reliability.' },
  { icon: Users,         color: '#60a5fa', label: 'No Human Control', desc: 'Binary accept/reject. No override, no escalation, no audit trail.' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-[#040408] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── FLOATING PILL NAVBAR ── */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 pointer-events-none">
        <nav className={`pointer-events-auto flex items-center gap-1 px-3 py-2 rounded-full border transition-all duration-300 ${scrolled ? 'bg-black/80 border-white/15 backdrop-blur-xl shadow-2xl' : 'bg-black/40 border-white/10 backdrop-blur-md'}`}>
          {/* Logo */}
          <div className="flex items-center gap-2 px-3 mr-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight">Guardian<span className="text-blue-400">AI</span></span>
          </div>

          {[['Problem', 'problem'], ['Solution', 'solution'], ['Screens', 'screens']].map(([label, id]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="px-3 py-1.5 text-xs font-medium text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-all duration-150"
            >
              {label}
            </button>
          ))}

          <a
            href="https://github.com/siddhartha0132/Dell_Repo"
            target="_blank" rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs font-medium text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-all duration-150"
          >
            GitHub
          </a>

          <button
            onClick={() => navigate('/dashboard')}
            className="ml-1 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 shadow-lg shadow-blue-600/30"
          >
            Launch App <ArrowRight className="w-3 h-3" />
          </button>
        </nav>
      </div>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background canvas */}
        <ParticleCanvas />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#040408]/60 via-transparent to-[#040408]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040408]/40 via-transparent to-[#040408]/40" />
        {/* Blue glow centre */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-20 flex flex-col lg:flex-row items-center gap-16">
          {/* Left text */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-xs text-white/60 font-medium tracking-wide">Dell Hackathon 2026 · GuardianAI</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6">
              AI that{' '}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">explains</span>
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded" />
              </span>
              {' '}itself —
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">so you can trust it.</span>
            </h1>

            <p className="text-lg text-white/50 max-w-xl leading-relaxed mb-10">
              Every AI recommendation for your Dell fleet is explained, sourced, calibrated, and human-gated. No black boxes. No blind trust.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <button
                id="btn-enter-dashboard"
                onClick={() => navigate('/dashboard')}
                className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-500/40 transition-all duration-200 active:scale-95"
              >
                Enter Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => scrollTo('problem')}
                className="flex items-center gap-2 bg-white/8 hover:bg-white/12 border border-white/10 text-white/70 hover:text-white px-7 py-3.5 rounded-xl font-semibold text-sm backdrop-blur transition-all duration-200"
              >
                Problem Statement
              </button>
            </div>

            {/* Stats row */}
            <div className="flex gap-8 mt-14 justify-center lg:justify-start">
              {[['2,400', 'Devices'], ['5/5', 'Transparency'], ['100%', 'Explainable']].map(([val, label]) => (
                <div key={label}>
                  <p className="text-2xl font-black text-white">{val}</p>
                  <p className="text-[11px] text-white/30 uppercase tracking-widest mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right terminal */}
          <div className="flex-1 w-full max-w-lg">
            <Terminal />
            {/* Step flow below terminal */}
            <div className="flex items-center gap-3 mt-5 px-2">
              {['Analyse', 'Explain', 'Act'].map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[10px] font-bold text-white/60">{i + 1}</span>
                    <span className="text-sm font-semibold text-white/70">{step}</span>
                  </div>
                  {i < 2 && <ChevronRight className="w-3.5 h-3.5 text-white/20" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM STATEMENT ── */}
      <section id="problem" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#040408] via-[#06060e] to-[#040408]" />
        {/* grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-red-600/6 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-400 mb-4">The Problem</p>
          <h2 className="text-4xl md:text-5xl font-black leading-tight mb-4 max-w-2xl">
            IT AI dashboards are{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">opaque black boxes</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mb-14 leading-relaxed">
            Admins managing thousands of Dell devices receive AI-generated alerts daily — but the AI never explains <strong className="text-white">why</strong>. So admins either blindly trust or completely ignore the recommendations.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {PROBLEMS.map(({ icon: Icon, color, label, desc }) => (
              <div key={label} className="group relative bg-white/3 hover:bg-white/6 border border-white/8 hover:border-white/15 rounded-2xl p-7 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <h3 className="font-bold text-white text-base mb-2">{label}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION ── */}
      <section id="solution" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[#06060e]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/8 rounded-full blur-[120px]" />
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400 mb-4">Our Solution</p>
          <h2 className="text-4xl md:text-5xl font-black leading-tight mb-4 max-w-3xl">
            GuardianAI — transparency{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">built in, not bolted on</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mb-14 leading-relaxed">
            Every screen answers: <em className="text-white/70">"What did the AI decide, why, how sure, and what doesn't it know?"</em>
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { num: '01', icon: '🧠', title: 'Reasoning Steps', desc: 'Plain English, no ML jargon' },
              { num: '02', icon: '🟢', title: 'Confidence Signal', desc: 'Label + colour, never a raw %' },
              { num: '03', icon: '🗄️', title: 'Data Sources', desc: 'Exact device count + time window' },
              { num: '04', icon: '⚠️', title: 'Known Limits', desc: 'Always shown — even at HIGH' },
              { num: '05', icon: '🙋', title: 'Human Controls', desc: 'Approve · Override · Escalate' },
            ].map(t => (
              <div key={t.num} className="bg-white/3 hover:bg-white/6 border border-white/8 hover:border-blue-500/30 rounded-2xl p-5 transition-all duration-200 group">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{t.icon}</span>
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2 py-0.5 rounded-full">{t.num}</span>
                </div>
                <h3 className="font-bold text-white text-sm mb-1">{t.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCREENS ── */}
      <section id="screens" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#06060e] to-[#040408]" />
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-4">Explore the Prototype</p>
          <h2 className="text-4xl font-black mb-10">All Screens</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SCREENS.map(s => (
              <button
                key={s.label}
                id={`nav-${s.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => navigate(s.to)}
                className="group text-left bg-white/3 hover:bg-white/6 border border-white/8 hover:border-white/20 rounded-2xl p-6 transition-all duration-200 active:scale-[0.98]"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center mb-4">
                  <s.icon className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-bold text-white text-base mb-1 flex items-center gap-1.5">
                  {s.label}
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-sm text-white/40 leading-relaxed">{s.desc}</p>
                {s.note && <p className="text-xs text-blue-400 mt-2">{s.note}</p>}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/8 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-bold text-white/70">GuardianAI</span>
            <span className="text-xs text-white/30">· Dell Hackathon 2026</span>
          </div>
          <p className="text-xs text-white/25 text-center">"AI that explains itself — so you can trust it." · React + Tailwind · No backend</p>
          <div className="flex items-center gap-1 flex-wrap">
            {['Reasoning', 'Confidence', 'Data', 'Limits', 'Controls'].map(e => (
              <span key={e} className="flex items-center gap-0.5 text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-white/40">
                <CheckCircle className="w-2.5 h-2.5 text-green-400" /> {e}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
