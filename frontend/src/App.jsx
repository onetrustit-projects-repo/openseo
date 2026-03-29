import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, TrendingDown, AlertTriangle, RefreshCw, Link2, Eye, MousePointer } from 'lucide-react'

const API_BASE = '/api'

function App() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div><span className="text-xl font-bold">OpenSEO</span><p className="text-xs text-slate-400">Search Console</p></div>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8 border-b border-slate-800 pb-4">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'performance', label: 'Performance', icon: TrendingUp },
            { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle },
            { id: 'sync', label: 'Sync', icon: RefreshCw },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${activeTab === tab.id ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
              <tab.icon className="w-4 h-4" />{tab.label}
            </button>
          ))}
        </div>
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'performance' && <PerformanceTab />}
        {activeTab === 'anomalies' && <AnomaliesTab />}
        {activeTab === 'sync' && <SyncTab />}
      </div>
    </div>
  )
}

function OverviewTab() {
  const [analytics, setAnalytics] = useState(null)
  useEffect(() => { fetchAnalytics() }, [])
  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${API_BASE}/gsc/analytics`)
      const data = await res.json()
      if (data.success) setAnalytics(data.analytics)
    } catch (err) { console.error(err) }
  }

  if (!analytics) return <div className="text-slate-400">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Total Clicks" value={analytics.totalClicks.toLocaleString()} icon={MousePointer} color="blue" trend={12} />
        <MetricCard label="Impressions" value={analytics.totalImpressions.toLocaleString()} icon={Eye} color="cyan" trend={8} />
        <MetricCard label="Avg CTR" value={`${analytics.averageCTR}%`} icon={MousePointer} color="green" trend={-2} />
        <MetricCard label="Avg Position" value={analytics.averagePosition} icon={TrendingUp} color="purple" trend={-0.5} />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Device Breakdown</h3>
          <div className="space-y-3">
            {analytics.deviceBreakdown.map(d => (
              <div key={d.device} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                <div><span className="capitalize">{d.device}</span><p className="text-xs text-slate-400">{d.clicks.toLocaleString()} clicks</p></div>
                <div className="text-right"><span className="text-lg font-bold">{d.ctr}%</span><p className="text-xs text-slate-400">CTR</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Top Countries</h3>
          <div className="space-y-3">
            {analytics.countryBreakdown.map(c => (
              <div key={c.country} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                <div><span className="font-medium">{c.country}</span><p className="text-xs text-slate-400">{c.clicks.toLocaleString()} clicks</p></div>
                <div className="text-right"><span className="text-lg font-bold">{c.position}</span><p className="text-xs text-slate-400">Position</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ label, value, icon: Icon, color, trend }) {
  const colors = { blue: 'from-blue-500 to-blue-600', cyan: 'from-cyan-500 to-cyan-600', green: 'from-green-500 to-green-600', purple: 'from-purple-500 to-purple-600' }
  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center`}><Icon className="w-5 h-5 text-white" /></div>
        <span className="text-slate-400 text-sm">{label}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold">{value}</span>
        {trend !== undefined && (
          <span className={`text-sm flex items-center gap-1 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  )
}

function PerformanceTab() {
  const [pages, setPages] = useState([])
  const [queries, setQueries] = useState([])
  useEffect(() => { fetchData() }, [])
  const fetchData = async () => {
    try {
      const [pagesRes, queriesRes] = await Promise.all([fetch(`${API_BASE}/gsc/top-pages`), fetch(`${API_BASE}/gsc/top-queries`)])
      const pagesData = await pagesRes.json()
      const queriesData = await queriesRes.json()
      if (pagesData.success) setPages(pagesData.pages)
      if (queriesData.success) setQueries(queriesData.queries)
    } catch (err) { console.error(err) }
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700"><h3 className="font-semibold">Top Pages</h3></div>
        <table className="w-full">
          <thead className="bg-slate-700/50"><tr><th className="text-left px-6 py-3 text-sm font-medium text-slate-400">Page</th><th className="text-left px-6 py-3 text-sm font-medium text-slate-400">Clicks</th><th className="text-left px-6 py-3 text-sm font-medium text-slate-400">Impr</th><th className="text-left px-6 py-3 text-sm font-medium text-slate-400">CTR</th><th className="text-left px-6 py-3 text-sm font-medium text-slate-400">Pos</th><th className="text-left px-6 py-3 text-sm font-medium text-slate-400">Change</th></tr></thead>
          <tbody>
            {pages.map((p, i) => (
              <tr key={i} className="border-t border-slate-700"><td className="px-6 py-3 text-sm">{p.page}</td><td className="px-6 py-3 text-sm">{p.clicks.toLocaleString()}</td><td className="px-6 py-3 text-sm">{p.impressions.toLocaleString()}</td><td className="px-6 py-3 text-sm">{p.ctr}%</td><td className="px-6 py-3 text-sm">{p.position}</td><td className="px-6 py-3"><span className={p.change >= 0 ? 'text-green-400' : 'text-red-400'}>{p.change >= 0 ? '+' : ''}{p.change}</span></td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700"><h3 className="font-semibold">Top Queries</h3></div>
        <table className="w-full">
          <thead className="bg-slate-700/50"><tr><th className="text-left px-6 py-3 text-sm font-medium text-slate-400">Query</th><th className="text-left px-6 py-3 text-sm font-medium text-slate-400">Clicks</th><th className="text-left px-6 py-3 text-sm font-medium text-slate-400">Impr</th><th className="text-left px-6 py-3 text-sm font-medium text-slate-400">CTR</th><th className="text-left px-6 py-3 text-sm font-medium text-slate-400">Pos</th><th className="text-left px-6 py-3 text-sm font-medium text-slate-400">Change</th></tr></thead>
          <tbody>
            {queries.map((q, i) => (
              <tr key={i} className="border-t border-slate-700"><td className="px-6 py-3 text-sm">{q.query}</td><td className="px-6 py-3 text-sm">{q.clicks.toLocaleString()}</td><td className="px-6 py-3 text-sm">{q.impressions.toLocaleString()}</td><td className="px-6 py-3 text-sm">{q.ctr}%</td><td className="px-6 py-3 text-sm">{q.position}</td><td className="px-6 py-3"><span className={q.change >= 0 ? 'text-green-400' : 'text-red-400'}>{q.change >= 0 ? '+' : ''}{q.change}</span></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AnomaliesTab() {
  const [anomalies, setAnomalies] = useState([])
  useEffect(() => { fetchAnomalies() }, [])
  const fetchAnomalies = async () => {
    try {
      const res = await fetch(`${API_BASE}/alerts/anomalies`)
      const data = await res.json()
      if (data.success) setAnomalies(data.anomalies)
    } catch (err) { console.error(err) }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Detected Anomalies</h2>
      {anomalies.map(a => (
        <div key={a.id} className={`p-4 rounded-xl border ${a.severity === 'high' ? 'bg-red-500/10 border-red-500/30' : a.severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-blue-500/10 border-blue-500/30'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className={`w-5 h-5 ${a.severity === 'high' ? 'text-red-400' : 'text-yellow-400'}`} />
              <div>
                <p className="font-medium">{a.message}</p>
                <p className="text-sm text-slate-400">Affected: {a.affectedPages.join(', ')}</p>
              </div>
            </div>
            <span className={`px-2 py-1 rounded text-xs ${a.severity === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{a.severity}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function SyncTab() {
  const [status, setStatus] = useState(null)
  const [syncing, setSyncing] = useState(false)
  useEffect(() => { fetchStatus() }, [])
  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/sync/status`)
      const data = await res.json()
      if (data.success) setStatus(data.lastSync)
    } catch (err) { console.error(err) }
  }
  const triggerSync = async () => {
    setSyncing(true)
    try {
      await fetch(`${API_BASE}/sync/trigger`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
      fetchStatus()
    } catch (err) { console.error(err) }
    setSyncing(false)
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div><h3 className="font-semibold">Google Search Console Sync</h3><p className="text-sm text-slate-400">Import data from GSC</p></div>
          <button onClick={triggerSync} disabled={syncing} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />{syncing ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>
        {status && (
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div><span className="text-slate-400">Last Sync:</span> {new Date(status.startedAt).toLocaleString()}</div>
            <div><span className="text-slate-400">Status:</span> <span className={status.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}>{status.status}</span></div>
            <div><span className="text-slate-400">Records:</span> {status.recordsImported?.toLocaleString() || 'N/A'}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
