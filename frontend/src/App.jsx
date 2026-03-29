import { useState, useEffect } from 'react'
import { Link2, TrendingUp, AlertTriangle, FileText, Send, Search, Activity, Download, Trash2, Plus, CheckCircle, XCircle } from 'lucide-react'

const API_BASE = '/api'

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [summary, setSummary] = useState(null)
  const [backlinks, setBacklinks] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeTab === 'overview' || activeTab === 'backlinks') {
      fetchSummary()
      fetchBacklinks()
    }
  }, [activeTab])

  const fetchSummary = async () => {
    try {
      const res = await fetch(`${API_BASE}/backlinks/summary?domain=openseo.io`)
      const data = await res.json()
      if (data.success) setSummary(data.summary)
    } catch (err) {
      console.error('Failed to fetch summary:', err)
    }
  }

  const fetchBacklinks = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/backlinks?limit=50`)
      const data = await res.json()
      if (data.success) setBacklinks(data.backlinks)
    } catch (err) {
      console.error('Failed to fetch backlinks:', err)
    }
    setLoading(false)
  }

  const discoverBacklinks = async () => {
    setLoading(true)
    try {
      await fetch(`${API_BASE}/backlinks/discover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: 'openseo.io' })
      })
      await fetchBacklinks()
      await fetchSummary()
    } catch (err) {
      console.error('Failed to discover backlinks:', err)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold">OpenSEO</span>
              <p className="text-xs text-slate-400">Backlink Analysis</p>
            </div>
          </div>
          <button
            onClick={discoverBacklinks}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Discover
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-800 pb-4">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'backlinks', label: 'Backlinks', icon: Link2 },
            { id: 'toxicity', label: 'Toxicity', icon: AlertTriangle },
            { id: 'disavow', label: 'Disavow', icon: FileText },
            { id: 'outreach', label: 'Outreach', icon: Send }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                activeTab === tab.id 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && <OverviewTab summary={summary} />}
        {activeTab === 'backlinks' && <BacklinksTab backlinks={backlinks} loading={loading} />}
        {activeTab === 'toxicity' && <ToxicityTab backlinks={backlinks} />}
        {activeTab === 'disavow' && <DisavowTab />}
        {activeTab === 'outreach' && <OutreachTab />}
      </div>
    </div>
  )
}

function OverviewTab({ summary }) {
  if (!summary) return <div className="text-slate-400">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Backlinks" value={summary.totalBacklinks} icon={Link2} color="purple" />
        <StatCard label="New (30 days)" value={summary.newBacklinks} icon={TrendingUp} color="green" />
        <StatCard label="Lost" value={summary.lostBacklinks} icon={XCircle} color="red" />
        <StatCard label="Avg DA" value={summary.averageDomainAuthority} icon={Activity} color="blue" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Link Types</h3>
          <div className="space-y-3">
            {Object.entries(summary.typeBreakdown || {}).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-slate-400 capitalize">{type}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500" 
                      style={{ width: `${(count / summary.totalBacklinks) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Follow Distribution</h3>
          <div className="flex items-center justify-center gap-8 py-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{summary.doFollowBacklinks}</div>
              <div className="text-sm text-slate-400">Do-Follow</div>
            </div>
            <div className="text-slate-600">/</div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-500">{summary.noFollowBacklinks}</div>
              <div className="text-sm text-slate-400">No-Follow</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, color }) {
  const colors = {
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    blue: 'from-blue-500 to-blue-600'
  }
  
  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-slate-400 text-sm">{label}</span>
      </div>
      <div className="text-3xl font-bold">{value || 0}</div>
    </div>
  )
}

function BacklinksTab({ backlinks, loading }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Backlink Profile</h2>
        <span className="text-slate-400">{backlinks.length} backlinks</span>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading backlinks...</div>
      ) : (
        <div className="bg-slate-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Source</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Anchor</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">DA</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Type</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {backlinks.map(bl => (
                <tr key={bl.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                  <td className="px-4 py-3">
                    <a href={bl.source} target="_blank" className="text-purple-400 hover:underline text-sm truncate max-w-xs block">
                      {bl.source}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-sm">{bl.anchorText}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${bl.domainAuthority > 50 ? 'text-green-400' : bl.domainAuthority > 20 ? 'text-yellow-400' : 'text-slate-400'}`}>
                      {bl.domainAuthority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-slate-700 rounded text-xs capitalize">{bl.type}</span>
                  </td>
                  <td className="px-4 py-3">
                    {bl.isNew && <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs mr-1">New</span>}
                    {bl.isLost && <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">Lost</span>}
                    {!bl.isNew && !bl.isLost && <span className="px-2 py-1 bg-slate-700 text-slate-400 rounded text-xs">Active</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function ToxicityTab({ backlinks }) {
  const [results, setResults] = useState([])
  const [analyzing, setAnalyzing] = useState(false)

  const analyzeToxicity = async () => {
    setAnalyzing(true)
    try {
      const res = await fetch(`${API_BASE}/analysis/toxicity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backlinks })
      })
      const data = await res.json()
      if (data.success) setResults(data.results)
    } catch (err) {
      console.error('Failed to analyze:', err)
    }
    setAnalyzing(false)
  }

  const riskColors = {
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-green-500/20 text-green-400 border-green-500/30'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Toxic Link Detection</h2>
          <p className="text-slate-400 text-sm">Analyze backlinks for spam and harmful patterns</p>
        </div>
        <button
          onClick={analyzeToxicity}
          disabled={analyzing || backlinks.length === 0}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
        >
          <AlertTriangle className="w-4 h-4" />
          {analyzing ? 'Analyzing...' : 'Analyze Toxicity'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          {results.map(r => (
            <div key={r.id} className={`p-4 rounded-xl border ${riskColors[r.riskLevel]}`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-sm">{r.source}</p>
                  <p className="text-xs opacity-70">Anchor: {r.anchorText}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{Math.round(r.toxicityScore * 100)}%</div>
                  <div className="text-xs uppercase">{r.riskLevel} risk</div>
                </div>
              </div>
              {r.patterns.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {r.patterns.map((p, i) => (
                    <span key={i} className="px-2 py-0.5 bg-black/20 rounded text-xs">{p}</span>
                  ))}
                </div>
              )}
              <div className="mt-2 pt-2 border-t border-black/10 flex items-center justify-between">
                <span className="text-xs">Recommendation: <strong>{r.recommendation}</strong></span>
                {r.recommendation === 'disavow' && (
                  <button className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">Add to Disavow</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function DisavowTab() {
  const [entries, setEntries] = useState([])
  const [newDomain, setNewDomain] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')

  const fetchEntries = async () => {
    try {
      const res = await fetch(`${API_BASE}/disavow`)
      const data = await res.json()
      if (data.success) setEntries(data.entries)
    } catch (err) {
      console.error('Failed to fetch:', err)
    }
  }

  useEffect(() => { fetchEntries() }, [])

  const addEntry = async () => {
    if (!newDomain) return
    try {
      await fetch(`${API_BASE}/disavow/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries: [{ type: 'domain', value: newDomain }] })
      })
      setNewDomain('')
      fetchEntries()
    } catch (err) {
      console.error('Failed to add:', err)
    }
  }

  const generateFile = async () => {
    try {
      const res = await fetch(`${API_BASE}/disavow/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domains: entries.map(e => e.value) })
      })
      const data = await res.json()
      if (data.success) setGeneratedContent(data.content)
    } catch (err) {
      console.error('Failed to generate:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Disavow File Management</h2>
          <p className="text-slate-400 text-sm">{entries.length} domains in disavow list</p>
        </div>
        <button
          onClick={generateFile}
          disabled={entries.length === 0}
          className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Generate File
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Add Domain</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newDomain}
              onChange={e => setNewDomain(e.target.value)}
              placeholder="example.com"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={addEntry}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Disavow Entries</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {entries.map(e => (
              <div key={e.id} className="flex items-center justify-between bg-slate-900 rounded-lg px-3 py-2">
                <span className="text-sm font-mono">{e.type === 'domain' ? `domain:${e.value}` : e.value}</span>
                <button className="text-red-400 hover:text-red-300">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {entries.length === 0 && (
              <p className="text-slate-500 text-sm text-center py-4">No entries yet</p>
            )}
          </div>
        </div>
      </div>

      {generatedContent && (
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Generated Disavow File</h3>
          <pre className="bg-slate-900 rounded-lg p-4 text-sm font-mono overflow-x-auto">
            {generatedContent}
          </pre>
        </div>
      )}
    </div>
  )
}

function OutreachTab() {
  const [activeTab, setActiveTab] = useState('campaigns')
  const [campaigns, setCampaigns] = useState([])
  const [stats, setStats] = useState(null)
  const [prospects, setProspects] = useState([])

  useEffect(() => {
    fetchCampaigns()
    fetchStats()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const res = await fetch(`${API_BASE}/outreach/campaigns`)
      const data = await res.json()
      if (data.success) setCampaigns(data.campaigns)
    } catch (err) {
      console.error('Failed to fetch:', err)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/outreach/stats`)
      const data = await res.json()
      if (data.success) setStats(data.stats)
    } catch (err) {
      console.error('Failed to fetch:', err)
    }
  }

  const createCampaign = async () => {
    try {
      await fetch(`${API_BASE}/outreach/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `Campaign ${campaigns.length + 1}`, type: 'guest-post' })
      })
      fetchCampaigns()
    } catch (err) {
      console.error('Failed to create:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Link Building Outreach</h2>
          <p className="text-slate-400 text-sm">Manage campaigns and track prospects</p>
        </div>
        <button
          onClick={createCampaign}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Campaign
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Prospects" value={stats.totalProspects} icon={Search} color="purple" />
          <StatCard label="Contacted" value={stats.contacted} icon={Send} color="blue" />
          <StatCard label="Approved" value={stats.approved} icon={CheckCircle} color="green" />
          <StatCard label="Published" value={stats.published} icon={Link2} color="purple" />
        </div>
      )}

      <div className="bg-slate-800 rounded-xl overflow-hidden">
        <div className="flex border-b border-slate-700">
          {['Campaigns', 'Prospects', 'History'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-6 py-3 text-sm font-medium ${activeTab === tab.toLowerCase() ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-700/50'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="p-6">
          {activeTab === 'campaigns' && (
            <div className="space-y-4">
              {campaigns.map(c => (
                <div key={c.id} className="bg-slate-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{c.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${c.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                      {c.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div><span className="text-slate-400">Contacted:</span> {c.contacted}</div>
                    <div><span className="text-slate-400">Replied:</span> {c.replied}</div>
                    <div><span className="text-slate-400">Approved:</span> {c.approved}</div>
                    <div><span className="text-slate-400">Published:</span> {c.published}</div>
                  </div>
                </div>
              ))}
              {campaigns.length === 0 && (
                <p className="text-slate-500 text-center py-8">No campaigns yet. Create your first campaign!</p>
              )}
            </div>
          )}
          {activeTab === 'prospects' && (
            <p className="text-slate-400 text-center py-8">Prospects will appear here as you add them to campaigns.</p>
          )}
          {activeTab === 'history' && (
            <p className="text-slate-400 text-center py-8">Outreach history will be logged here.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
