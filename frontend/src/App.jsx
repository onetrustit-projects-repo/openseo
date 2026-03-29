import { useState, useEffect } from 'react'
import { Search, AlertTriangle, CheckCircle, Link2, FileText, Settings, RefreshCw, Clock, XCircle } from 'lucide-react'

const API_BASE = '/api'

function App() {
  const [activeTab, setActiveTab] = useState('audit')

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div><span className="text-xl font-bold">OpenSEO</span><p className="text-xs text-slate-400">Technical Audit</p></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8 border-b border-slate-800 pb-4">
          {[
            { id: 'audit', label: 'Run Audit', icon: Search },
            { id: 'results', label: 'Results', icon: FileText },
            { id: 'issues', label: 'Issues', icon: AlertTriangle },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${activeTab === tab.id ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
              <tab.icon className="w-4 h-4" />{tab.label}
            </button>
          ))}
        </div>
        {activeTab === 'audit' && <AuditTab />}
        {activeTab === 'results' && <ResultsTab />}
        {activeTab === 'issues' && <IssuesTab />}
      </div>
    </div>
  )
}

function AuditTab() {
  const [url, setUrl] = useState('')
  const [maxPages, setMaxPages] = useState(100)
  const [running, setRunning] = useState(false)
  const [auditId, setAuditId] = useState(null)
  const [progress, setProgress] = useState(0)

  const startAudit = async () => {
    if (!url) return
    setRunning(true)
    try {
      const res = await fetch(`${API_BASE}/audit/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, maxPages })
      })
      const data = await res.json()
      if (data.success) {
        setAuditId(data.auditId)
        pollAudit(data.auditId)
      }
    } catch (err) { console.error(err) }
    setRunning(false)
  }

  const pollAudit = async (id) => {
    const poll = async () => {
      try {
        const res = await fetch(`${API_BASE}/audit/${id}`)
        const data = await res.json()
        if (data.success) {
          setProgress(data.audit.progress || 0)
          if (data.audit.status === 'completed' || data.audit.status === 'failed') {
            setRunning(false)
            return
          }
        }
      } catch (err) { console.error(err) }
      setTimeout(poll, 1000)
    }
    poll()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-slate-800 rounded-xl p-6">
        <h2 className="font-semibold mb-4">Start New Audit</h2>
        <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500" />
        <div className="flex items-center gap-4 mb-4">
          <label className="text-sm text-slate-400">Max pages:</label>
          <select value={maxPages} onChange={e => setMaxPages(parseInt(e.target.value))} className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm">
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={500}>500</option>
            <option value={1000}>1000</option>
          </select>
        </div>
        <button onClick={startAudit} disabled={running || !url} className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2">
          {running ? <><RefreshCw className="w-4 h-4 animate-spin" /> Running... {progress}%</> : <><Search className="w-4 h-4" /> Start Audit</>}
        </button>
      </div>

      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="font-semibold mb-4">What This Audit Checks</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Link2, label: 'Broken Links', desc: '404 errors and dead pages' },
            { icon: RefreshCw, label: 'Redirect Chains', desc: 'Multi-hop redirect issues' },
            { icon: FileText, label: 'Duplicate Content', desc: 'SimHash-based detection' },
            { icon: AlertTriangle, label: 'Schema Errors', desc: 'Invalid structured data' },
            { icon: Settings, label: 'Meta Tags', desc: 'Missing or duplicate tags' },
            { icon: Clock, label: 'Crawl Budget', desc: 'Efficiency analysis' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <item.icon className="w-4 h-4 text-slate-400" />
              </div>
              <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-slate-400">{item.desc}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ResultsTab() {
  const [audits, setAudits] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => { fetchAudits() }, [])

  const fetchAudits = async () => {
    try {
      const res = await fetch(`${API_BASE}/audit`)
      const data = await res.json()
      if (data.success) setAudits(data.audits)
    } catch (err) { console.error(err) }
  }

  const viewResults = async (audit) => {
    try {
      const res = await fetch(`${API_BASE}/audit/${audit.id}/results`)
      const data = await res.json()
      if (data.success) setSelected({ ...audit, results: data.results })
    } catch (err) { console.error(err) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Audit History</h2>
        <button onClick={fetchAudits} className="px-3 py-1.5 bg-slate-700 rounded-lg text-sm hover:bg-slate-600 flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {audits.length === 0 ? (
        <div className="text-center py-12 text-slate-400">No audits run yet. Start an audit to see results.</div>
      ) : (
        <div className="grid gap-4">
          {audits.map(audit => (
            <div key={audit.id} className="bg-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium truncate">{audit.url}</p>
                <p className="text-sm text-slate-400">{new Date(audit.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-3">
                {audit.summary && (
                  <div className="text-right">
                    <p className="text-sm font-medium">{audit.summary.healthScore}%</p>
                    <p className="text-xs text-slate-400">Health</p>
                  </div>
                )}
                <span className={`px-2 py-1 rounded text-xs ${audit.status === 'completed' ? 'bg-green-500/20 text-green-400' : audit.status === 'running' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                  {audit.status}
                </span>
                {audit.status === 'completed' && (
                  <button onClick={() => viewResults(audit)} className="px-3 py-1.5 bg-slate-700 rounded-lg text-sm hover:bg-slate-600">View</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && selected.results && (
        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Audit Results: {selected.url}</h3>
            <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white"><XCircle className="w-5 h-5" /></button>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <ResultCard label="Pages" value={selected.results.crawlStats?.pages || 0} icon={FileText} color="blue" />
            <ResultCard label="Broken Links" value={selected.results.brokenLinks?.length || 0} icon={Link2} color="red" />
            <ResultCard label="Redirects" value={selected.results.redirects?.length || 0} icon={RefreshCw} color="yellow" />
            <ResultCard label="Schema Errors" value={selected.results.schemaErrors?.length || 0} icon={AlertTriangle} color="orange" />
          </div>

          <div className="space-y-4">
            {selected.results.brokenLinks?.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <h4 className="font-medium text-red-400 mb-2">Broken Links ({selected.results.brokenLinks.length})</h4>
                <div className="space-y-1 text-sm">
                  {selected.results.brokenLinks.slice(0, 5).map((link, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-300">
                      <span className="text-red-400">{link.status}</span>
                      <span>from: {link.from}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ResultCard({ label, value, icon: Icon, color }) {
  const colors = { red: 'from-red-500 to-red-600', yellow: 'from-yellow-500 to-yellow-600', blue: 'from-blue-500 to-blue-600', orange: 'from-orange-500 to-orange-600' }
  return (
    <div className="bg-slate-800 rounded-xl p-4">
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center mb-3`}><Icon className="w-5 h-5 text-white" /></div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  )
}

function IssuesTab() {
  const [summary, setSummary] = useState(null)

  useEffect(() => { fetchSummary() }, [])

  const fetchSummary = async () => {
    try {
      const res = await fetch(`${API_BASE}/issues/summary`)
      const data = await res.json()
      if (data.success) setSummary(data.summary)
    } catch (err) { console.error(err) }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Issues Overview</h2>
      
      {summary && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4">By Severity</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><span className="text-red-400">Critical</span><span className="font-bold">{summary.bySeverity.critical}</span></div>
              <div className="flex items-center justify-between"><span className="text-red-500">Errors</span><span className="font-bold">{summary.bySeverity.error}</span></div>
              <div className="flex items-center justify-between"><span className="text-yellow-400">Warnings</span><span className="font-bold">{summary.bySeverity.warning}</span></div>
              <div className="flex items-center justify-between"><span className="text-blue-400">Info</span><span className="font-bold">{summary.bySeverity.info}</span></div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4">By Type</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><span className="text-slate-400">Broken Links</span><span className="font-bold">{summary.byType.brokenLink}</span></div>
              <div className="flex items-center justify-between"><span className="text-slate-400">Redirect Chains</span><span className="font-bold">{summary.byType.redirectChain}</span></div>
              <div className="flex items-center justify-between"><span className="text-slate-400">Schema Errors</span><span className="font-bold">{summary.byType.schemaError}</span></div>
              <div className="flex items-center justify-between"><span className="text-slate-400">Missing Meta</span><span className="font-bold">{summary.byType.missingMeta}</span></div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="font-semibold mb-4">Top Pages with Issues</h3>
        {summary?.topPages?.length > 0 ? (
          <div className="space-y-2">
            {summary.topPages.map((page, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                <span className="text-sm truncate flex-1">{page.page}</span>
                <span className="text-sm text-slate-400 ml-4">{page.issues} issues</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-center py-4">No issues found. Run an audit to see issues.</p>
        )}
      </div>
    </div>
  )
}

export default App
