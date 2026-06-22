// ActivityLog.jsx — Screen 3: Audit Trail
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Download, Filter, ChevronRight, Database, Info, AlertOctagon, CheckCircle, XCircle, ArrowUpRight, Shield } from 'lucide-react'
import ConfidenceBadge from '../components/ConfidenceBadge'
import LogReasoningModal from '../components/LogReasoningModal'
import IncidentCardModal from '../components/IncidentCardModal'
import { activityLog as baseLog } from '../data/alerts'
import FailureAnalysisModal from '../components/FailureAnalysisModal'

function exportCSV(rows) {
  const headers = ['Timestamp','Device','Alert ID','AI Action','Confidence','Human Decision','Decision By','Outcome','Override Reason','Override Notes']
  const lines = [
    headers.join(','),
    ...rows.map(r => [
      new Date(r.timestamp).toLocaleString(), r.device, r.alertId || '—',
      `"${(r.aiAction||'').replace(/"/g,'""')}"`, r.confidence, r.humanDecision, r.decisionBy,
      `"${(r.outcome||'').replace(/"/g,'""')}"`,
      `"${(r.overrideReason||'—').replace(/"/g,'""')}"`,
      `"${(r.overrideNotes||'—').replace(/"/g,'""')}"`,
    ].join(','))
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `guardianai-audit-${new Date().toISOString().slice(0,10)}.csv`; a.click()
  URL.revokeObjectURL(url)
}

const DECISION_LABELS = {
  APPROVED:       { label: 'Approved',      cls: 'bg-emerald-100 text-emerald-700 border border-emerald-200' },
  'AUTO-APPROVED':{ label: 'Auto-Approved', cls: 'bg-blue-100 text-blue-700 border border-blue-200' },
  OVERRIDDEN:     { label: 'Overridden',    cls: 'bg-amber-100 text-amber-700 border border-amber-200' },
  ESCALATED:      { label: 'Escalated',     cls: 'bg-purple-100 text-purple-700 border border-purple-200' },
}

const categoryChip = {
  Security:    'bg-red-50 text-red-600 border-red-200',
  Hardware:    'bg-purple-50 text-purple-600 border-purple-200',
  Performance: 'bg-blue-50 text-blue-600 border-blue-200',
  Compliance:  'bg-orange-50 text-orange-600 border-orange-200',
}

export default function ActivityLog({ alerts }) {
  const navigate = useNavigate()
  const [search, setSearch]         = useState('')
  const [filterConf, setFilterConf] = useState('ALL')
  const [filterDec, setFilterDec]   = useState('ALL')
  const [filterDate, setFilterDate] = useState('ALL')
  const [selectedLog, setSelectedLog]     = useState(null)
  const [showIncident, setShowIncident]   = useState(null)
  const [selectedIncident, setSelectedIncident] = useState(null)

  const allLog = useMemo(() => {
    const fromAlerts = alerts.filter(a => a.status !== 'PENDING').map(a => ({
      id: `NEW-${a.id}`, timestamp: a.decisionTime || new Date().toISOString(),
      device: a.deviceName, alertId: a.id, aiAction: a.recommendedAction,
      confidence: a.confidenceLevel, humanDecision: a.status,
      overrideReason: a.overrideReason, overrideNotes: a.overrideNotes,
      decisionBy: a.decisionBy || 'Alex Chen',
      outcome: a.outcome || (a.status === 'APPROVED' ? 'Pending execution' : a.status === 'ESCALATED' ? 'Escalated to Security Team' : 'Overridden by admin'),
      category: a.category, reasoningSteps: a.reasoningSteps, dataSource: a.dataSource, limitations: a.limitations,
    }))
    const existing = baseLog.filter(b => !fromAlerts.find(f => f.alertId === b.alertId))
    return [...fromAlerts, ...existing].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }, [alerts])

  const failedIncidents = baseLog.filter(log => log.isIncident)

  const filtered = useMemo(() => {
    return allLog.filter(row => {
      const q = search.toLowerCase()
      const matchSearch = !q || row.device.toLowerCase().includes(q) || row.aiAction.toLowerCase().includes(q) || (row.alertId||'').toLowerCase().includes(q)
      const matchConf   = filterConf === 'ALL' || row.confidence === filterConf
      const matchDec    = filterDec  === 'ALL' || row.humanDecision === filterDec
      const matchDate   = filterDate === 'ALL' || (() => {
        const d = new Date(row.timestamp), now = new Date()
        if (filterDate === 'TODAY') return d.toDateString() === now.toDateString()
        if (filterDate === '7D')    return (now - d) < 7  * 86400000
        if (filterDate === '30D')   return (now - d) < 30 * 86400000
        return true
      })()
      return matchSearch && matchConf && matchDec && matchDate
    })
  }, [allLog, search, filterConf, filterDec, filterDate])

  const handleRowClick = (row) => {
    if (row.isIncident) setShowIncident(row)
    else setSelectedLog(row)
  }
  const handleModalClose = (action, alertId) => {
    setSelectedLog(null)
    if (action === 'navigate' && alertId) navigate(`/detail/${alertId}`)
  }

  const approvedCount  = allLog.filter(x => x.humanDecision === 'APPROVED' || x.humanDecision === 'AUTO-APPROVED').length
  const overriddenCount= allLog.filter(x => x.humanDecision === 'OVERRIDDEN').length
  const escalatedCount = allLog.filter(x => x.humanDecision === 'ESCALATED').length

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-dell-navy flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-md shadow-purple-200">
              <Database className="w-5 h-5 text-white" />
            </div>
            Activity Log & Audit Trail
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-11">Every AI action and human decision — permanently recorded. Click any row for full reasoning.</p>
        </div>
        <button id="btn-export-csv" onClick={() => exportCSV(filtered)} className="btn-outline flex items-center gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Entries', val: allLog.length,     icon: Database,    clr: 'stat-card-blue',   iconClr: 'bg-blue-100 text-blue-600' },
          { label: 'Approved',      val: approvedCount,     icon: CheckCircle, clr: 'stat-card-green',  iconClr: 'bg-emerald-100 text-emerald-600' },
          { label: 'Overridden',    val: overriddenCount,   icon: XCircle,     clr: 'stat-card-orange', iconClr: 'bg-amber-100 text-amber-600' },
          { label: 'Escalated',     val: escalatedCount,    icon: ArrowUpRight, clr: 'stat-card-purple', iconClr: 'bg-purple-100 text-purple-600' },
        ].map(s => (
          <div key={s.label} className={`${s.clr} rounded-2xl border p-5 flex items-center gap-4`}>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${s.iconClr}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-dell-navy">{s.val}</p>
              <p className="label mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── AI Failure Incidents Banner ── */}
      {failedIncidents.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-red-700 flex items-center gap-2">
            <AlertOctagon className="w-4 h-4" /> AI Incident Post-Mortems
          </h2>
          {failedIncidents.map(log => (
            <div key={log.id} className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                  <AlertOctagon className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-bold text-red-800 text-sm">{log.device}</p>
                  <p className="text-xs text-red-600 mt-0.5">{log.outcome}</p>
                  <p className="text-[11px] text-red-400 mt-1">{new Date(log.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <button onClick={() => setSelectedIncident(log)} className="flex-shrink-0 px-4 py-2 rounded-xl bg-white border border-red-200 text-sm font-semibold text-red-700 hover:bg-red-50 transition-colors">
                📖 What AI Learned
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Search + Filters ── */}
      <div className="card">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-52">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input id="log-search" type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search device, alert type, or ID…"
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-dell-blue/30 focus:border-dell-blue focus:bg-white transition-colors" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-400" />
            {[
              { id: 'filter-date',       val: filterDate, set: setFilterDate, opts: [['ALL','All Dates'],['TODAY','Today'],['7D','Last 7 Days'],['30D','Last 30 Days']] },
              { id: 'filter-confidence', val: filterConf, set: setFilterConf, opts: [['ALL','All Confidence'],['HIGH','High'],['MEDIUM','Medium'],['LOW','Low']] },
              { id: 'filter-decision',   val: filterDec,  set: setFilterDec,  opts: [['ALL','All Decisions'],['APPROVED','Approved'],['AUTO-APPROVED','Auto-Approved'],['OVERRIDDEN','Overridden'],['ESCALATED','Escalated']] },
            ].map(f => (
              <select key={f.id} id={f.id} value={f.val} onChange={e => f.set(e.target.value)}
                className="border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dell-blue/30 focus:border-dell-blue">
                {f.opts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            ))}
          </div>
        </div>
        {filtered.length !== allLog.length && (
          <p className="text-xs text-gray-400 mt-3">Showing <strong>{filtered.length}</strong> of {allLog.length} entries</p>
        )}
      </div>

      {/* ── Table / Empty State ── */}
      {filtered.length === 0 ? (
        <div className="card text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Database className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="font-bold text-gray-700 text-base mb-2">No activity yet</h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">AI recommendations will appear here once approved or overridden.</p>
          <button onClick={() => { setSearch(''); setFilterConf('ALL'); setFilterDec('ALL'); setFilterDate('ALL') }} className="btn-primary mt-6">
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(row => {
            const dec = DECISION_LABELS[row.humanDecision] || { label: row.humanDecision, cls: 'bg-gray-100 text-gray-600 border border-gray-200' }
            const isIncident = row.isIncident
            const hasReasoning = row.reasoningSteps && row.reasoningSteps.length > 0
            const catCls = categoryChip[row.category] || 'bg-gray-50 text-gray-600 border-gray-200'

            return (
              <div
                key={row.id}
                id={`log-row-${row.id}`}
                onClick={() => handleRowClick(row)}
                className={`rounded-2xl border p-4 cursor-pointer transition-all duration-150 group ${
                  isIncident
                    ? 'bg-gradient-to-r from-red-50 to-pink-50/30 border-red-100 hover:border-red-200 hover:shadow-sm'
                    : 'bg-white border-gray-100 hover:border-dell-blue/20 hover:bg-dell-lightblue/20 hover:shadow-sm'
                }`}
                title={isIncident ? 'View AI Incident Post-Mortem' : hasReasoning ? 'View AI reasoning' : 'Details'}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isIncident ? 'bg-red-100' : 'bg-gray-100'}`}>
                    {isIncident
                      ? <AlertOctagon className="w-4 h-4 text-red-600" />
                      : hasReasoning
                        ? <Info className="w-4 h-4 text-dell-blue" />
                        : <Database className="w-4 h-4 text-gray-400" />
                    }
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        {isIncident && (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                          </span>
                        )}
                        <span className={`font-bold text-sm ${isIncident ? 'text-red-700' : 'text-dell-navy'}`}>{row.device}</span>
                        {row.category && (
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${catCls}`}>{row.category}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <ConfidenceBadge level={row.confidence} score={0} />
                        <span className={`badge text-[11px] ${dec.cls}`}>{dec.label}</span>
                      </div>
                    </div>

                    {/* Action text */}
                    <p className={`text-sm mt-1.5 leading-snug ${isIncident ? 'text-red-700 font-semibold' : 'text-gray-700'}`}>{row.aiAction}</p>

                    {/* Bottom meta */}
                    <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                      <div className="flex items-center gap-3 text-[11px] text-gray-400">
                        <span>🕐 {new Date(row.timestamp).toLocaleString()}</span>
                        <span>By: <strong className="text-gray-600">{row.decisionBy}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className={`truncate max-w-[200px] ${isIncident ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>{row.outcome}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-dell-blue transition-colors flex-shrink-0" />
                      </div>
                    </div>
                    {row.overrideReason && (
                      <p className="text-[11px] text-amber-600 mt-1 bg-amber-50 rounded-lg px-2 py-1">Override: {row.overrideReason}</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selectedLog    && <LogReasoningModal log={selectedLog} onClose={handleModalClose} />}
      {selectedIncident && <FailureAnalysisModal incident={selectedIncident.incident} device={selectedIncident.device} onClose={() => setSelectedIncident(null)} />}
      {showIncident   && <IncidentCardModal log={showIncident} onClose={() => setShowIncident(null)} />}
    </div>
  )
}
