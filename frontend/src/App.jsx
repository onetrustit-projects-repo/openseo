import { useState, useEffect } from 'react'
import { Search, TrendingUp, Eye, Target, BarChart3, LineChart, Plus, ArrowUp, ArrowDown, Minus } from 'lucide-react'

const API_BASE = '/api'

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [keywords, setKeywords] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeTab === 'overview' || activeTab === 'keywords') {
      fetchSummary()
      fetchKeywords()
    }
  }, [activeTab])

  const fetchSummary = async () => {
    try {
      const res = await fetch(`${API_BASE}/keywords/summary`)
      const data = await res.json()
      if (data.success) setSummary(data.summary)
    } catch (err) {
      console.error('Failed to fetch summary:', err)
    }
  }

  const fetchKeywords = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/keywords?limit=100`)
      const data = await res.json()
      if (data.success) setKeywords(data.keywords)
    } catch (err) {
      console.error('Failed to fetch keywords:', err)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold">OpenSEO</span>
              <p className="text-xs text-slate-400">Keyword Intelligence</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-800 pb-4">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'keywords', label: 'Keywords', icon: Target },
            { id: 'serp', label: 'SERP Features', icon: Eye },
            { id: 'competitors', label: 'Competitors', icon: TrendingUp },
            { id: 'trends', label: 'Trends', icon: LineChart },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                activeTab === tab.id 
                  ? 'bg-amber-500 text-white' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && <OverviewTab summary={summary} keywords={keywords} />}
        {activeTab === 'keywords' && <KeywordsTab keywords={keywords} loading={loading} />}
        {activeTab === 'serp' && <SerpTab keywords={keywords} />}
        {activeTab === 'competitors' && <CompetitorsTab />}
        {activeTab === 'trends' && <TrendsTab keywords={keywords} />}
      </div>
    </div>
  )
}

function OverviewTab({ summary, keywords }) {
  if (!summary) return <div className="text-slate-400">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Keywords" value={summary.totalKeywords} icon={Target} color="amber" />
        <StatCard label="Total Volume" value={summary.totalSearchVolume.toLocaleString()} icon={TrendingUp} color="green" />
        <StatCard label="Avg Difficulty" value={summary.averageDifficulty} icon={BarChart3} color="blue" />
        <StatCard label="Avg CPC" value={`$${summary.averageCpc}`} icon={Target} color="purple" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Position Distribution</h3>
          <div className="space-y-3">
            <PositionBar label="Top 3" count={summary.positionDistribution.top3} color="bg-green-500" />
            <PositionBar label="Top 10" count={summary.positionDistribution.top10} color="bg-blue-500" />
            <PositionBar label="Top 20" count={summary.positionDistribution.top20} color="bg-yellow-500" />
            <PositionBar label="Top 100+" count={summary.positionDistribution.top100} color="bg-slate-500" />
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Top Keywords</h3>
          <div className="space-y-3">
            {keywords.slice(0, 5).map((kw, i) => (
              <div key={kw.id} className="flex items-center justify-between">
                <span className="text-sm truncate flex-1">{kw.keyword}</span>
                <span className="text-slate-400 text-sm ml-2">#{i + 1}</span>
                <ChangeIndicator value={kw.change} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PositionBar({ label, count, color }) {
  const max = 50;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-slate-400 w-20">{label}</span>
      <div className="flex-1 h-4 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${(count / max) * 100}%` }} />
      </div>
      <span className="text-sm w-8">{count}</span>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, color }) {
  const colors = {
    amber: 'from-amber-500 to-amber-600',
    green: 'from-green-500 to-green-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600'
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

function ChangeIndicator({ value }) {
  if (value > 0) return <span className="text-green-400 text-sm flex items-center ml-2"><ArrowUp className="w-3 h-3 mr-1" />{value}</span>
  if (value < 0) return <span className="text-red-400 text-sm flex items-center ml-2"><ArrowDown className="w-3 h-3 mr-1" />{Math.abs(value)}</span>
  return <span className="text-slate-400 text-sm ml-2"><Minus className="w-3 h-3" /></span>
}

function KeywordsTab({ keywords, loading }) {
  const [search, setSearch] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('')

  const filteredKeywords = keywords.filter(kw => {
    if (search && !kw.keyword.toLowerCase().includes(search.toLowerCase())) return false
    if (difficultyFilter === 'easy' && kw.difficulty >= 40) return false
    if (difficultyFilter === 'medium' && (kw.difficulty < 40 || kw.difficulty >= 60)) return false
    if (difficultyFilter === 'hard' && kw.difficulty < 60) return false
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Keyword Portfolio</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search keywords..."
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <select
            value={difficultyFilter}
            onChange={e => setDifficultyFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none"
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy (&lt;40)</option>
            <option value="medium">Medium (40-60)</option>
            <option value="hard">Hard (60+)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading keywords...</div>
      ) : (
        <div className="bg-slate-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Keyword</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Volume</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Difficulty</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">CPC</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Position</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Change</th>
              </tr>
            </thead>
            <tbody>
              {filteredKeywords.map(kw => (
                <tr key={kw.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                  <td className="px-4 py-3 text-sm font-medium">{kw.keyword}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{kw.searchVolume.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <DifficultyBadge value={kw.difficulty} />
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-400">${kw.cpc}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={kw.position <= 3 ? 'text-green-400' : kw.position <= 10 ? 'text-blue-400' : 'text-slate-400'}>
                      #{kw.position}
                    </span>
                  </td>
                  <td className="px-4 py-3"><ChangeIndicator value={kw.change} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function DifficultyBadge({ value }) {
  const color = value < 40 ? 'bg-green-500/20 text-green-400' : value < 60 ? 'bg-yellow-500/20 text-yellow-400' : value < 80 ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'
  return <span className={`px-2 py-1 rounded text-xs ${color}`}>{value}</span>
}

function SerpTab({ keywords }) {
  const [analysis, setAnalysis] = useState(null)
  const [selectedKeyword, setSelectedKeyword] = useState('')
  const [loading, setLoading] = useState(false)

  const analyzeSerp = async () => {
    if (!selectedKeyword) return
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/serp/analysis?keyword=${encodeURIComponent(selectedKeyword)}`)
      const data = await res.json()
      if (data.success) setAnalysis(data.analysis)
    } catch (err) {
      console.error('Failed to analyze:', err)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">SERP Feature Tracking</h2>
          <p className="text-slate-400 text-sm">Track featured snippets, People Also Ask, and more</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedKeyword}
            onChange={e => setSelectedKeyword(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none"
          >
            <option value="">Select keyword</option>
            {keywords.map(kw => (
              <option key={kw.id} value={kw.keyword}>{kw.keyword}</option>
            ))}
          </select>
          <button
            onClick={analyzeSerp}
            disabled={!selectedKeyword || loading}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>

      {analysis && (
        <div className="grid md:grid-cols-3 gap-4">
          <FeatureCard title="Featured Snippet" present={analysis.features.featuredSnippet.present} position={analysis.features.featuredSnippet.position} />
          <FeatureCard title="People Also Ask" present={analysis.features.peopleAlsoAsk.present} count={analysis.features.peopleAlsoAsk.count} />
          <FeatureCard title="Video Result" present={analysis.features.videoResult.present} position={analysis.features.videoResult.position} />
          <FeatureCard title="Image Pack" present={analysis.features.imagePack.present} position={analysis.features.imagePack.position} />
          <FeatureCard title="Local Pack" present={analysis.features.localPack.present} count={analysis.features.localPack.count} />
          <FeatureCard title="Top Stories" present={analysis.features.topStories.present} count={analysis.features.topStories.count} />
        </div>
      )}
    </div>
  )
}

function FeatureCard({ title, present, position, count }) {
  return (
    <div className={`p-4 rounded-xl border ${present ? 'bg-green-500/10 border-green-500/30' : 'bg-slate-800 border-slate-700'}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-sm">{title}</h4>
        {present ? (
          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">Present</span>
        ) : (
          <span className="px-2 py-0.5 bg-slate-700 text-slate-400 rounded text-xs">Absent</span>
        )}
      </div>
      {present && (
        <div className="text-sm text-slate-400">
          {position && <span>Position #{position}</span>}
          {count && <span>{count} results</span>}
        </div>
      )}
    </div>
  )
}

function CompetitorsTab() {
  const [competitors, setCompetitors] = useState([])
  const [gap, setGap] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCompetitors()
  }, [])

  const fetchCompetitors = async () => {
    try {
      const res = await fetch(`${API_BASE}/competitors`)
      const data = await res.json()
      if (data.success) setCompetitors(data.competitors)
    } catch (err) {
      console.error('Failed to fetch:', err)
    }
  }

  const analyzeGap = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/competitors/gap?domain=openseo.io&competitor=semrush.com`)
      const data = await res.json()
      if (data.success) setGap(data.gap)
    } catch (err) {
      console.error('Failed to analyze:', err)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Competitive Analysis</h2>
          <p className="text-slate-400 text-sm">Analyze competitor keyword overlap and gaps</p>
        </div>
        <button
          onClick={analyzeGap}
          disabled={loading}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze Gap'}
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {competitors.map(comp => (
          <div key={comp.id} className="bg-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">{comp.name}</h4>
              <span className="text-xs text-slate-400">{comp.overlap}% overlap</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Authority</span>
                <span>{comp.authority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Keywords</span>
                <span>{comp.keywords.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Backlinks</span>
                <span>{(comp.backlinks / 1000000).toFixed(1)}M</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {gap && (
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Keyword Gap Analysis</h3>
          <div className="space-y-3">
            {gap.gapKeywords.map((kw, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-900 rounded-lg px-4 py-3">
                <div>
                  <span className="font-medium">{kw.keyword}</span>
                  <span className="text-slate-400 text-sm ml-2">({kw.volume.toLocaleString()} vol)</span>
                </div>
                <div className="flex items-center gap-3">
                  <DifficultyBadge value={kw.difficulty} />
                  <span className={`px-2 py-1 rounded text-xs ${
                    kw.priority === 'high' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>{kw.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function TrendsTab({ keywords }) {
  const [trendData, setTrendData] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [selectedKeyword, setSelectedKeyword] = useState('')

  useEffect(() => {
    if (keywords.length > 0 && !selectedKeyword) {
      setSelectedKeyword(keywords[0].keyword)
    }
  }, [keywords])

  const fetchTrends = async () => {
    if (!selectedKeyword) return
    try {
      const [trendsRes, forecastRes] = await Promise.all([
        fetch(`${API_BASE}/trends/keywords?keyword=${encodeURIComponent(selectedKeyword)}`),
        fetch(`${API_BASE}/trends/forecast?keyword=${encodeURIComponent(selectedKeyword)}`)
      ])
      const trendsData = await trendsRes.json()
      const forecastData = await forecastRes.json()
      if (trendsData.success) setTrendData(trendsData.trends)
      if (forecastData.success) setForecast(forecastData.forecast)
    } catch (err) {
      console.error('Failed to fetch trends:', err)
    }
  }

  useEffect(() => {
    if (selectedKeyword) fetchTrends()
  }, [selectedKeyword])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Ranking Trends</h2>
          <p className="text-slate-400 text-sm">Historical position data and forecasts</p>
        </div>
        <select
          value={selectedKeyword}
          onChange={e => setSelectedKeyword(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none"
        >
          {keywords.map(kw => (
            <option key={kw.id} value={kw.keyword}>{kw.keyword}</option>
          ))}
        </select>
      </div>

      {trendData && (
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Position Trend (Last 30 Days)</h3>
          <div className="h-48 flex items-end gap-1">
            {trendData.position.map((p, i) => (
              <div key={i} className="flex-1 bg-amber-500 rounded-t" style={{ height: `${Math.max(5, (1 - p.value / 100) * 100)}%` }} title={`${p.date}: ${p.value}`} />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>{trendData.position[0]?.date}</span>
            <span>{trendData.position[trendData.position.length - 1]?.date}</span>
          </div>
        </div>
      )}

      {forecast && (
        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Position Forecast</h3>
            <span className="text-sm text-slate-400">Confidence: {Math.round(forecast.confidence * 100)}%</span>
          </div>
          <div className="space-y-3">
            {forecast.predictions.map((pred, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-slate-400">{pred.week}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">#{pred.position}</span>
                  <span className="text-xs text-slate-500">({pred.range[0]}-{pred.range[1]})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
