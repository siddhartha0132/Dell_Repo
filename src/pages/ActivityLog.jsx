// ActivityLog.jsx — Screen 3: Audit Trail
// Feature: Clickable Activity Log Reasoning Drawer/Modal
// Feature: AI Failure Incident Card (LOG006 isIncident rows)
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Download, Filter, ChevronRight, Database, Info, AlertOctagon } from 'lucide-react'
import ConfidenceBadge from '../components/ConfidenceBadge'
import LogReasoningModal from '../components/LogReasoningModal'
import IncidentCardModal from '../components/IncidentCardModal'
import { activityLog as baseLog } from '../data/alerts'

function exportCSV(rows) {
  const headers = ['Timestamp', 'Device', 'Alert ID', 'AI Action', 'Confidence', 'Human Decision', 'Decision By', 'Outcome', 'Override Reason', 'Override Notes']
  const lines = [
    headers.join(','),
    ...rows.map(r => [
      new Date(r.timestamp).toLocaleString(),
      r.device,
      r.alertId || '—',
      `"${(r.aiAction || '').replace(/"/g, '""')}"`,
      r.confidence,
      r.humanDecision,
      r.decisionBy,
      `"${(r.outcome || '').replace(/"/g, '""')}"`,
      `"${(r.overrideReason || '—').replace(/"/g, '""')}"`,
      `"${(r.overrideNotes || '—').replace(/"/g, '""')}"`,
    ].join(','))
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `guardianai-audit-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const DECISION_LABELS = {
  APPROVED: { label: 'Approved', class: 'badge-high' },
  'AUTO-APPROVED': { label: 'Auto-Approved', class: 'bg-blue-100 text-blue-700 badge' },
  OVERRIDDEN: { label: 'Overridden', class: 'badge-medium' },
  ESCALATED: { label: 'Escalated', class: 'bg-purple-100 text-purple-700 badge' },
}

export default function ActivityLog({ alerts }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filterConf, setFilterConf] = useState('ALL')
  const [filterDec, setFilterDec] = useState('ALL')
  const [filterDate, setFilterDate] = useState('ALL')

  // Modal state for reasoning drawer and incident card
  const [selectedLog, setSelectedLog] = useState(null)
  const [showIncident, setShowIncident] = useState(null)

  // Merge base log with any new decisions from alerts state
  const allLog = useMemo(() => {
    const fromAlerts = alerts
      .filter(a => a.status !== 'PENDING')
      .map(a => ({
        id: `NEW-${a.id}`,
        timestamp: a.decisionTime || new Date().toISOString(),
        device: a.deviceName,
        alertId: a.id,
        aiAction: a.recommendedAction,
        confidence: a.confidenceLevel,
        humanDecision: a.status,
        overrideReason: a.overrideReason,
        overrideNotes: a.overrideNotes,
        decisionBy: a.decisionBy || 'Alex Chen',
        outcome: a.outcome || (a.status === 'APPROVED' ? 'Pending execution' : a.status === 'ESCALATED' ? 'Escalated to Security Team' : 'Overridden by admin'),
        category: a.category,
        // Carry over reasoning data from alert if available
        reasoningSteps: a.reasoningSteps,
        dataSource: a.dataSource,
        limitations: a.limitations,
      }))
    const existing = baseLog.filter(b => !fromAlerts.find(f => f.alertId === b.alertId))
    return [...fromAlerts, ...existing].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }, [alerts])

  const filtered = useMemo(() => {
    return allLog.filter(row => {
      const q = search.toLowerCase()
      const matchSearch = !q || row.device.toLowerCase().includes(q) || row.aiAction.toLowerCase().includes(q) || (row.alertId || '').toLowerCase().includes(q)
      const matchConf = filterConf === 'ALL' || row.confidence === filterConf
      const matchDec = filterDec === 'ALL' || row.humanDecision === filterDec
      const matchDate = filterDate === 'ALL' || (() => {
        const d = new Date(row.timestamp)
        const now = new Date()
        if (filterDate === 'TODAY') return d.toDateString() === now.toDateString()
        if (filterDate === '7D') return (now - d) < 7 * 86400000
        if (filterDate === '30D') return (now - d) < 30 * 86400000
        return true
      })()
      return matchSearch && matchConf && matchDec && matchDate
    })
  }, [allLog, search, filterConf, filterDec, filterDate])

  const handleRowClick = (row) => {
    if (row.isIncident) {
      // Show the incident post-mortem card
      setShowIncident(row)
    } else {
      // Show reasoning modal for ALL rows
      setSelectedLog(row)
    }
  }

  const handleModalClose = (action, alertId) => {
    setSelectedLog(null)
    if (action === 'navigate' && alertId) {
      navigate(`/detail/${alertId}`)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-dell-navy flex items-center gap-2">
            <Database className="w-5 h-5 text-dell-blue" />
            Activity Log & Audit Trail
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Every AI action and human decision, permanently recorded. Click any row for full reasoning.</p>
        </div>
        <button
          id="btn-export-csv"
          onClick={() => exportCSV(filtered)}
          className="btn-outline flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download as CSV
        </button>
      </div>

      {/* Search + Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="log-search"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search device, alert type, or ID…"
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dell-blue focus:border-transparent"
            />
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select id="filter-date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dell-blue">
              <option value="ALL">All Dates</option>
              <option value="TODAY">Today</option>
              <option value="7D">Last 7 Days</option>
              <option value="30D">Last 30 Days</option>
            </select>
            <select id="filter-confidence" value={filterConf} onChange={e => setFilterConf(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dell-blue">
              <option value="ALL">All Confidence</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
            <select id="filter-decision" value={filterDec} onChange={e => setFilterDec(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dell-blue">
              <option value="ALL">All Decisions</option>
              <option value="APPROVED">Approved</option>
              <option value="AUTO-APPROVED">Auto-Approved</option>
              <option value="OVERRIDDEN">Overridden</option>
              <option value="ESCALATED">Escalated</option>
            </select>
          </div>
        </div>
        {filtered.length !== allLog.length && (
          <p className="text-xs text-gray-400 mt-3">
            Showing {filtered.length} of {allLog.length} entries
          </p>
        )}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        /* Empty state */
        <div className="card text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Database className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="font-bold text-gray-700 text-base mb-2">No activity yet</h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            AI recommendations will appear here once approved or overridden. Try clearing your filters.
          </p>
          <button onClick={() => { setSearch(''); setFilterConf('ALL'); setFilterDec('ALL'); setFilterDate('ALL') }} className="btn-primary mt-6">
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm table-fixed">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left label w-[16%]">Timestamp</th>
                  <th className="px-4 py-3 text-left label w-[12%]">Device</th>
                  <th className="px-4 py-3 text-left label w-[33%]">AI Action</th>
                  <th className="px-4 py-3 text-left label w-[14%]">Confidence</th>
                  <th className="px-4 py-3 text-left label w-[12%]">Human Decision</th>
                  <th className="px-4 py-3 text-left label w-[11%]">Outcome</th>
                  <th className="px-4 py-3 text-left label w-[2%]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(row => {
                  const dec = DECISION_LABELS[row.humanDecision] || { label: row.humanDecision, class: 'badge bg-gray-100 text-gray-600' }
                  const isIncident = row.isIncident
                  const hasReasoning = row.reasoningSteps && row.reasoningSteps.length > 0
                  return (
                    <tr
                      key={row.id}
                      id={`log-row-${row.id}`}
                      onClick={() => handleRowClick(row)}
                      className={`transition-colors group cursor-pointer ${
                        isIncident
                          ? 'bg-red-50/40 hover:bg-red-50/70 border-l-2 border-l-confidence-low'
                          : 'hover:bg-dell-lightblue/30'
                      }`}
                      title={isIncident ? 'Click to view AI Incident Post-Mortem' : hasReasoning ? 'Click to view AI reasoning details' : 'Click for details'}
                    >
                      <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap text-xs">
                        {new Date(row.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-dell-navy whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {isIncident && (
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-confidence-low opacity-75" />
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-confidence-low" />
                            </span>
                          )}
                          {row.device}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-gray-700">
                        <div className="flex items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <p className={`truncate ${isIncident ? 'text-confidence-low font-semibold' : ''}`}>{row.aiAction}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{row.decisionBy}</p>
                          </div>
                          {hasReasoning && !isIncident && (
                            <Info className="w-3.5 h-3.5 text-dell-blue flex-shrink-0 mt-0.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                          )}
                          {isIncident && (
                            <AlertOctagon className="w-4 h-4 text-confidence-low flex-shrink-0 mt-0.5" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <ConfidenceBadge level={row.confidence} score={0} />
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={dec.class}>{dec.label}</span>
                        {row.overrideReason && (
                          <p className="text-xs text-gray-400 mt-0.5 truncate">{row.overrideReason}</p>
                        )}
                      </td>
                      <td className={`px-4 py-3.5 text-xs ${isIncident ? 'text-confidence-low font-semibold' : 'text-gray-600'}`}>
                        <p className="truncate">{row.outcome}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-dell-blue transition-colors" />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reasoning Modal — shown for any row click */}
      {selectedLog && (
        <LogReasoningModal log={selectedLog} onClose={handleModalClose} />
      )}

      {/* Incident Card Modal — shown for isIncident rows */}
      {showIncident && (
        <IncidentCardModal log={showIncident} onClose={() => setShowIncident(null)} />
      )}
    </div>
  )
}

