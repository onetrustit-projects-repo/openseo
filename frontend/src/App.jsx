import { useState, useEffect, useRef } from 'react'
import { Activity, Gauge, AlertTriangle, Zap, Monitor, Globe, Code, CheckCircle, XCircle, Clock, TrendingUp, TrendingDown, Server, Play, RefreshCw, ChevronDown } from 'lucide-react'

const API_BASE = '/api'

// Simple chart component
function MiniChart({ data, color = '#22c55e', height = 40 }) {
  if (!data || data.length < 2) return <div className="w-full h-full bg-slate-700 rounded animate-pulse" />;
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((v - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg viewBox="0 0 100 100" className="w-full" preserveAspectRatio="none" style={{ height }}>
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
      <polygon fill={`url(#grad-${color.replace('#', '')})`} points={`0,100 ${points} 100,100`} />
    </svg>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = () => setRefreshKey(k => k + 1)

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
              <p className="text-xs text-slate-400">Core Web Vitals Monitor</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={refresh} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <RefreshCw className={`w-4 h-4 text-slate-400 ${refreshKey > 0 ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8 border-b border-slate-800 pb-4 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Gauge },
            { id: 'synthetic', label: 'Synthetic Tests', icon: Monitor },
            { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
            { id: 'recommendations', label: 'Recommendations', icon: Zap },
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-green-500 text-white' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === 'overview' && <OverviewTab key={refreshKey} />}
        {activeTab === 'synthetic' && <SyntheticTab key={refreshKey} />}
        {activeTab === 'alerts' && <AlertsTab key={refreshKey} />}
        {activeTab === 'recommendations' && <RecommendationsTab key={refreshKey} />}
      </div>
    </div>
  )
}

function OverviewTab() {
  const [summary, setSummary] = useState(null)
  const [metrics, setMetrics] = useState([])
  const [devices, setDevices] = useState(null)
  const [geo, setGeo] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchSummary(), fetchMetrics(), fetchDevices(), fetchGeo()]).finally(() => setLoading(false))
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

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" /></div>

  return (
    <div className="space-y-6">
      {/* Score Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <ScoreCard label="Overall Score" value={summary?.overallScore} unit="%" color="#22c55e" />
        <ScoreCard label="LCP" value={summary?.avgLcp} unit="s" color="#3b82f6" />
        <ScoreCard label="FID" value={summary?.avgFid} unit="ms" color="#f59e0b" />
        <ScoreCard label="CLS" value={summary?.avgCls} unit="" color="#a855f7" />
        <ScoreCard label="INP" value={summary?.avgInp} unit="ms" color="#ef4444" />
      </div>

      {/* Trend Charts */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.slice(0, 4).map(m => (
          <TrendCard key={m.id} page={m.page} metric="lcp" data={m.lcp?.values} />
        ))}
      </div>

      {/* Status Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" /> Page Status
          </h3>
          <div className="space-y-3">
            <StatusRow label="Passing" value={summary?.passing} color="text-green-400" />
            <StatusRow label="Needs Improvement" value={summary?.needsImprovement} color="text-yellow-400" />
            <StatusRow label="Poor" value={summary?.poor} color="text-red-400" />
          </div>
        </div>

        {devices && (
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Monitor className="w-5 h-5 text-blue-400" /> Device Breakdown
            </h3>
            <div className="space-y-3">
              {Object.entries(devices).map(([device, data]) => (
                <div key={device} className="flex justify-between items-center">
                  <span className="capitalize text-slate-300">{device}</span>
                  <span className="text-slate-400">{data.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-400" /> Geographic Distribution
          </h3>
          <div className="space-y-3">
            {geo.map(g => (
              <div key={g.region} className="flex justify-between">
                <span className="text-slate-300">{g.region}</span>
                <span className="text-slate-400">{(g.sessions / 1000).toFixed(0)}K</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Table */}
      <div className="bg-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h3 className="font-semibold">Page Metrics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-400">Page</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-400">LCP (p75)</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-400">FID (p75)</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-400">CLS (p75)</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map(m => (
                <tr key={m.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                  <td className="px-6 py-3 text-sm font-mono">{m.page}</td>
                  <td className="px-6 py-3"><MetricValue value={m.lcp?.p75} good={2.5} bad={4} unit="s" /></td>
                  <td className="px-6 py-3"><MetricValue value={m.fid?.p75} good={100} bad={300} unit="ms" /></td>
                  <td className="px-6 py-3"><MetricValue value={m.cls?.p75} good={0.1} bad={0.25} /></td>
                  <td className="px-6 py-3">
                    <StatusBadge passed={m.lcp?.p75 < 2.5 && m.fid?.p75 < 100 && m.cls?.p75 < 0.1} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ScoreCard({ label, value, unit, color }) {
  return (
    <div className="bg-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-sm">{label}</span>
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      </div>
      <div className="text-3xl font-bold" style={{ color }}>{value}{unit}</div>
    </div>
  )
}

function StatusRow({ label, value, color }) {
  return (
    <div className="flex justify-between">
      <span className={color}>{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function TrendCard({ page, metric, data }) {
  const metricColors = { lcp: '#3b82f6', fid: '#f59e0b', cls: '#a855f7', inp: '#ef4444' };
  const color = metricColors[metric] || '#22c55e';
  
  return (
    <div className="bg-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-400 uppercase">{metric}</span>
        <span className="text-xs text-slate-500 font-mono">{page}</span>
      </div>
      <div className="h-12">
        <MiniChart data={data?.slice(-14)} color={color} />
      </div>
    </div>
  )
}

function MetricValue({ value, good, bad, unit = '' }) {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return <span className="text-slate-500">-</span>;
  const color = numValue < good ? 'text-green-400' : numValue < bad ? 'text-yellow-400' : 'text-red-400';
  return <span className={color}>{value}{unit}</span>;
}

function StatusBadge({ passed }) {
  return passed ? (
    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs flex items-center gap-1 w-fit">
      <CheckCircle className="w-3 h-3" /> Good
    </span>
  ) : (
    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs flex items-center gap-1 w-fit">
      <XCircle className="w-3 h-3" /> Needs Work
    </span>
  );
}

function SyntheticTab() {
  const [tests, setTests] = useState([])
  const [url, setUrl] = useState('')
  const [device, setDevice] = useState('desktop')
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
      await fetch(`${API_BASE}/synthetic/run`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ url, device }) 
      })
      await fetchTests()
      setUrl('')
    } catch (err) { console.error(err) }
    setRunning(false)
  }

  return (
    <div className="space-y-6">
      {/* Run Test Form */}
      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Play className="w-5 h-5 text-green-400" /> Run Synthetic Test
        </h3>
        <div className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            value={url} 
            onChange={e => setUrl(e.target.value)} 
            placeholder="https://example.com" 
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-slate-500"
          />
          <select 
            value={device} 
            onChange={e => setDevice(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
          >
            <option value="desktop">Desktop</option>
            <option value="mobile">Mobile</option>
          </select>
          <button 
            onClick={runTest} 
            disabled={running || !url} 
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2 justify-center"
          >
            {running ? <><RefreshCw className="w-4 h-4 animate-spin" /> Running...</> : <><Play className="w-4 h-4" /> Run Test</>}
          </button>
        </div>
      </div>

      {/* Test Results */}
      <div className="grid md:grid-cols-3 gap-4">
        {tests.filter(t => t.status === 'completed').slice(0, 3).map(t => (
          <TestResultCard key={t.id} test={t} />
        ))}
      </div>

      {/* Test History Table */}
      <div className="bg-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h3 className="font-semibold">Test History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-400">URL</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-400">Device</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-400">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-400">Score</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-400">LCP</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-400">FID</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-400">CLS</th>
              </tr>
            </thead>
            <tbody>
              {tests.map(t => (
                <tr key={t.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                  <td className="px-6 py-3 text-sm truncate max-w-xs">{t.url}</td>
                  <td className="px-6 py-3 text-sm capitalize">{t.device}</td>
                  <td className="px-6 py-3">
                    {t.status === 'completed' ? (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">Completed</span>
                    ) : t.status === 'running' ? (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs flex items-center gap-1 w-fit">
                        <RefreshCw className="w-3 h-3 animate-spin" /> Running
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">Failed</span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    {t.results ? (
                      <span className={`font-bold ${
                        t.results.performanceScore >= 90 ? 'text-green-400' : 
                        t.results.performanceScore >= 50 ? 'text-yellow-400' : 'text-red-400'
                      }`}>{t.results.performanceScore}</span>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    {t.results?.metrics?.LCP ? `${t.results.metrics.LCP}s` : '-'}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    {t.results?.metrics?.FID ? `${t.results.metrics.FID}ms` : '-'}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    {t.results?.metrics?.CLS || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function TestResultCard({ test }) {
  return (
    <div className="bg-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-400 truncate flex-1 mr-2">{test.url}</span>
        <span className="text-xs bg-slate-700 px-2 py-1 rounded capitalize">{test.device}</span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className={`text-4xl font-bold ${
            test.results?.performanceScore >= 90 ? 'text-green-400' : 
            test.results?.performanceScore >= 50 ? 'text-yellow-400' : 'text-red-400'
          }`}>{test.results?.performanceScore || '-'}</div>
          <div className="text-xs text-slate-500">Performance Score</div>
        </div>
        <div className="text-right text-xs text-slate-400">
          {test.results?.passed?.length || 0} passed / {test.results?.failed?.length || 0} failed
        </div>
      </div>
    </div>
  )
}

function AlertsTab() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAlerts().finally(() => setLoading(false)) }, [])

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

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" /></div>

  const activeAlerts = alerts.filter(a => !a.acknowledged)
  const acknowledgedAlerts = alerts.filter(a => a.acknowledged)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Active Alerts</h2>
        <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">{activeAlerts.length} unacknowledged</span>
      </div>

      {activeAlerts.length === 0 && (
        <div className="bg-slate-800 rounded-xl p-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <p className="text-slate-400">No active alerts. All metrics are within thresholds.</p>
        </div>
      )}

      <div className="space-y-4">
        {activeAlerts.map(alert => (
          <AlertCard key={alert.id} alert={alert} onAcknowledge={() => acknowledge(alert.id)} />
        ))}
      </div>

      {acknowledgedAlerts.length > 0 && (
        <>
          <h3 className="text-lg font-semibold text-slate-400 pt-4">Acknowledged</h3>
          <div className="space-y-4 opacity-60">
            {acknowledgedAlerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} onAcknowledge={() => {}} acknowledged />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function AlertCard({ alert, onAcknowledge, acknowledged }) {
  const isCritical = alert.severity === 'critical';
  
  return (
    <div className={`p-5 rounded-xl border ${isCritical ? 'bg-red-500/10 border-red-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <AlertTriangle className={`w-6 h-6 ${isCritical ? 'text-red-400' : 'text-yellow-400'}`} />
          <div>
            <p className="font-semibold">{alert.metric} exceeded threshold on <span className="font-mono">{alert.page}</span></p>
            <p className="text-sm text-slate-400 mt-1">
              Current: <span className={isCritical ? 'text-red-400' : 'text-yellow-400'}>{alert.value}</span> | 
              Threshold: {alert.threshold}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Triggered: {new Date(alert.triggeredAt).toLocaleString()}
            </p>
          </div>
        </div>
        {!acknowledged && (
          <button 
            onClick={onAcknowledge} 
            className="px-4 py-2 bg-slate-700 rounded-lg text-sm hover:bg-slate-600 transition-colors"
          >
            Acknowledge
          </button>
        )}
        {acknowledged && (
          <span className="text-sm text-slate-500">Acknowledged</span>
        )}
      </div>
    </div>
  )
}

function RecommendationsTab() {
  const [recommendations, setRecommendations] = useState({})
  const [selectedMetric, setSelectedMetric] = useState('LCP')
  const [expandedRec, setExpandedRec] = useState(null)

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
      <div className="flex gap-2 flex-wrap">
        {metrics.map(m => (
          <button 
            key={m} 
            onClick={() => { setSelectedMetric(m); setExpandedRec(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              selectedMetric === m ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {(recommendations[selectedMetric] || []).map(rec => (
          <div key={rec.id} className="bg-slate-800 rounded-xl overflow-hidden">
            <div 
              className="p-5 cursor-pointer hover:bg-slate-700/30 transition-colors"
              onClick={() => setExpandedRec(expandedRec === rec.id ? null : rec.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{rec.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">{rec.description}</p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    rec.impact === 'high' ? 'bg-red-500/20 text-red-400' : 
                    rec.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 
                    'bg-slate-700 text-slate-400'
                  }`}>{rec.impact} impact</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    rec.effort === 'low' ? 'bg-green-500/20 text-green-400' : 
                    rec.effort === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 
                    'bg-red-500/20 text-red-400'
                  }`}>{rec.effort} effort</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedRec === rec.id ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </div>
            
            {expandedRec === rec.id && rec.code && (
              <div className="px-5 pb-5 border-t border-slate-700">
                <div className="flex items-center gap-2 mt-4 mb-2">
                  <Code className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-400">Code Example</span>
                </div>
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
