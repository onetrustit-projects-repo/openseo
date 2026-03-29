import { useState, useEffect } from 'react'
import { Activity, Gauge, AlertTriangle, Zap, Monitor, Globe, Code, CheckCircle, XCircle, Clock } from 'lucide-react'

const API_BASE = '/api'

function App() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold">OpenSEO</span>
              <p className="text-xs text-slate-400">Core Web Vitals</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8 border-b border-slate-800 pb-4">
          {[
            { id: 'overview', label: 'Overview', icon: Gauge },
            { id: 'synthetic', label: 'Synthetic Tests', icon: Monitor },
            { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
            { id: 'recommendations', label: 'Recommendations', icon: Zap },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${activeTab === tab.id ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
              <tab.icon className="w-4 h-4" />{tab.label}
            </button>
          ))}
        </div>
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'synthetic' && <SyntheticTab />}
        {activeTab === 'alerts' && <AlertsTab />}
        {activeTab === 'recommendations' && <RecommendationsTab />}
      </div>
    </div>
  )
}

function OverviewTab() {
  const [summary, setSummary] = useState(null)
  const [metrics, setMetrics] = useState([])
  const [devices, setDevices] = useState(null)
  const [geo, setGeo] = useState([])

  useEffect(() => {
    fetchSummary()
    fetchMetrics()
    fetchDevices()
    fetchGeo()
  }, [])

  const fetchSummary = async () => {
    try {
      const res = await fetch(`${API_BASE}/metrics/summary`)
      const data = await res.json()
      if (data.success) setSummary(data.summary)
    } catch (err) { console.error(err) }
  }

  const fetchMetrics = async () => {
    try {
      const res = await fetch(`${API_BASE}/metrics`)
      const data = await res.json()
      if (data.success) setMetrics(data.metrics)
    } catch (err) { console.error(err) }
  }

  const fetchDevices = async () => {
    try {
      const res = await fetch(`${API_BASE}/metrics/devices`)
      const data = await res.json()
      if (data.success) setDevices(data.breakdown)
    } catch (err) { console.error(err) }
  }

  const fetchGeo = async () => {
    try {
      const res = await fetch(`${API_BASE}/metrics/geo`)
      const data = await res.json()
      if (data.success) setGeo(data.geoData)
    } catch (err) { console.error(err) }
  }

  if (!summary) return <div className="text-slate-400">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MetricCard label="Overall Score" value={summary.overallScore} icon={Gauge} color="green" />
        <MetricCard label="LCP (ms)" value={summary.avgLcp} icon={Clock} color="blue" />
        <MetricCard label="FID (ms)" value={summary.avgFid} icon={Zap} color="yellow" />
        <MetricCard label="CLS" value={summary.avgCls} icon={Activity} color="purple" />
        <MetricCard label="INP (ms)" value={summary.avgInp} icon={Zap} color="orange" />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Page Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-green-400">Passing</span><span>{summary.passing}</span></div>
            <div className="flex justify-between"><span className="text-yellow-400">Needs Improvement</span><span>{summary.needsImprovement}</span></div>
            <div className="flex justify-between"><span className="text-red-400">Poor</span><span>{summary.poor}</span></div>
          </div>
        </div>
        {devices && (
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Device Breakdown</h3>
            <div className="space-y-3">
              {Object.entries(devices).map(([device, data]) => (
                <div key={device} className="flex justify-between items-center">
                  <span className="capitalize">{device}</span>
                  <span className="text-slate-400">{data.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Geographic Distribution</h3>
          <div className="space-y-2">
            {geo.map(g => (
              <div key={g.region} className="flex justify-between">
                <span>{g.region}</span>
                <span className="text-slate-400">{(g.sessions / 1000).toFixed(0)}K</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h3 className="font-semibold">Page Metrics</h3>
        </div>
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-slate-400">Page</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-slate-400">LCP</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-slate-400">FID</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-slate-400">CLS</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-slate-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map(m => (
              <tr key={m.id} className="border-t border-slate-700">
                <td className="px-6 py-3 text-sm">{m.page}</td>
                <td className="px-6 py-3 text-sm"><MetricValue value={m.lcp.p75} good={2.5} bad={4} unit="s" /></td>
                <td className="px-6 py-3 text-sm"><MetricValue value={m.fid.p75} good={100} bad={300} unit="ms" /></td>
                <td className="px-6 py-3 text-sm"><MetricValue value={m.cls.p75} good={0.1} bad={0.25} /></td>
                <td className="px-6 py-3"><StatusBadge passed={m.lcp.p75 < 2.5 && m.fid.p75 < 100 && m.cls.p75 < 0.1} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MetricCard({ label, value, icon: Icon, color }) {
  const colors = { green: 'from-green-500 to-green-600', blue: 'from-blue-500 to-blue-600', yellow: 'from-yellow-500 to-yellow-600', purple: 'from-purple-500 to-purple-600', orange: 'from-orange-500 to-orange-600' }
  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center`}><Icon className="w-5 h-5 text-white" /></div>
        <span className="text-slate-400 text-sm">{label}</span>
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  )
}

function MetricValue({ value, good, bad, unit = '' }) {
  const numValue = parseFloat(value)
  const color = numValue < good ? 'text-green-400' : numValue < bad ? 'text-yellow-400' : 'text-red-400'
  return <span className={color}>{value}{unit}</span>
}

function StatusBadge({ passed }) {
  return passed ? <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Good</span> : <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs flex items-center gap-1"><XCircle className="w-3 h-3" /> Needs Work</span>
}

function SyntheticTab() {
  const [tests, setTests] = useState([])
  const [url, setUrl] = useState('')
  const [running, setRunning] = useState(false)

  useEffect(() => { fetchTests() }, [])

  const fetchTests = async () => {
    try {
      const res = await fetch(`${API_BASE}/synthetic/tests`)
      const data = await res.json()
      if (data.success) setTests(data.tests)
    } catch (err) { console.error(err) }
  }

  const runTest = async () => {
    if (!url) return
    setRunning(true)
    try {
      await fetch(`${API_BASE}/synthetic/run`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) })
      await fetchTests()
      setUrl('')
    } catch (err) { console.error(err) }
    setRunning(false)
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="font-semibold mb-4">Run Synthetic Test</h3>
        <div className="flex gap-2">
          <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
          <button onClick={runTest} disabled={running || !url} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50">{running ? 'Running...' : 'Run Test'}</button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700"><h3 className="font-semibold">Test History</h3></div>
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-slate-400">URL</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-slate-400">Device</th>
              <th className="text-left px-6 py-6 py-3 text-sm font-medium text-slate-400">Status</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-slate-400">Performance</th>
            </tr>
          </thead>
          <tbody>
            {tests.map(t => (
              <tr key={t.id} className="border-t border-slate-700">
                <td className="px-6 py-3 text-sm truncate max-w-xs">{t.url}</td>
                <td className="px-6 py-3 text-sm capitalize">{t.device}</td>
                <td className="px-6 py-3">
                  {t.status === 'completed' ? <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">Completed</span> : <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">Running</span>}
                </td>
                <td className="px-6 py-3 text-sm">{t.results ? `${t.results.lighthouse.performance}%` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AlertsTab() {
  const [alerts, setAlerts] = useState([])

  useEffect(() => { fetchAlerts() }, [])

  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${API_BASE}/alerts`)
      const data = await res.json()
      if (data.success) setAlerts(data.alerts)
    } catch (err) { console.error(err) }
  }

  const acknowledge = async (id) => {
    try {
      await fetch(`${API_BASE}/alerts/${id}/acknowledge`, { method: 'PATCH' })
      fetchAlerts()
    } catch (err) { console.error(err) }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Active Alerts</h2>
        <span className="text-slate-400">{alerts.filter(a => !a.acknowledged).length} unacknowledged</span>
      </div>
      {alerts.map(alert => (
        <div key={alert.id} className={`p-4 rounded-xl border ${alert.severity === 'critical' ? 'bg-red-500/10 border-red-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className={`w-5 h-5 ${alert.severity === 'critical' ? 'text-red-400' : 'text-yellow-400'}`} />
              <div>
                <p className="font-medium">{alert.metric} exceeded threshold on {alert.page}</p>
                <p className="text-sm text-slate-400">Value: {alert.value} | Threshold: {alert.threshold}</p>
              </div>
            </div>
            {!alert.acknowledged && <button onClick={() => acknowledge(alert.id)} className="px-3 py-1 bg-slate-700 rounded text-sm hover:bg-slate-600">Acknowledge</button>}
          </div>
        </div>
      ))}
      {alerts.length === 0 && <p className="text-slate-400 text-center py-8">No alerts</p>}
    </div>
  )
}

function RecommendationsTab() {
  const [recommendations, setRecommendations] = useState({})
  const [selectedMetric, setSelectedMetric] = useState('LCP')

  useEffect(() => { fetchRecommendations() }, [])

  const fetchRecommendations = async () => {
    try {
      const res = await fetch(`${API_BASE}/recommendations`)
      const data = await res.json()
      if (data.success) setRecommendations(data.recommendations)
    } catch (err) { console.error(err) }
  }

  const metrics = ['LCP', 'FID', 'CLS', 'INP']

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {metrics.map(m => (
          <button key={m} onClick={() => setSelectedMetric(m)} className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedMetric === m ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-400'}`}>{m}</button>
        ))}
      </div>

      <div className="grid gap-4">
        {(recommendations[selectedMetric] || []).map(rec => (
          <div key={rec.id} className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold">{rec.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{rec.description}</p>
              </div>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded text-xs ${rec.impact === 'high' ? 'bg-red-500/20 text-red-400' : rec.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-700 text-slate-400'}`}>{rec.impact} impact</span>
                <span className={`px-2 py-1 rounded text-xs ${rec.effort === 'low' ? 'bg-green-500/20 text-green-400' : rec.effort === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{rec.effort} effort</span>
              </div>
            </div>
            {rec.code && (
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-2"><Code className="w-4 h-4 text-slate-400" /><span className="text-sm text-slate-400">Code Example</span></div>
                <pre className="bg-slate-900 rounded-lg p-4 text-sm font-mono overflow-x-auto text-teal-400">{rec.code}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
