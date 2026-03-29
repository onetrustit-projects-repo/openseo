import { useState } from 'react'
import { FileText, Lightbulb, FileSearch, BookOpen, ArrowRight, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react'

const API_BASE = '/api'

function App() {
  const [activeTab, setActiveTab] = useState('analyze')

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold">OpenSEO</span>
              <p className="text-xs text-slate-400">AI Content Optimization</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8 border-b border-slate-800 pb-4">
          {[
            { id: 'analyze', label: 'Content Analyzer', icon: FileText },
            { id: 'brief', label: 'Brief Generator', icon: BookOpen },
            { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${activeTab === tab.id ? 'bg-pink-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
              <tab.icon className="w-4 h-4" />{tab.label}
            </button>
          ))}
        </div>
        {activeTab === 'analyze' && <ContentAnalyzerTab />}
        {activeTab === 'brief' && <BriefGeneratorTab />}
        {activeTab === 'suggestions' && <SuggestionsTab />}
      </div>
    </div>
  )
}

function ContentAnalyzerTab() {
  const [content, setContent] = useState('')
  const [keyword, setKeyword] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [score, setScore] = useState(null)
  const [metaDescriptions, setMetaDescriptions] = useState(null)
  const [loading, setLoading] = useState(false)

  const analyzeContent = async () => {
    if (!content) return
    setLoading(true)
    try {
      const [analysisRes, scoreRes, metaRes] = await Promise.all([
        fetch(`${API_BASE}/content/analyze`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content, keyword }) }),
        fetch(`${API_BASE}/content/score`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content, keyword }) }),
        fetch(`${API_BASE}/content/meta-description`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content, keyword }) })
      ])
      const analysisData = await analysisRes.json()
      const scoreData = await scoreRes.json()
      const metaData = await metaRes.json()
      if (analysisData.success) setAnalysis(analysisData.analysis)
      if (scoreData.success) setScore(scoreData)
      if (metaData.success) setMetaDescriptions(metaData.metaDescriptions)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Content Input</h3>
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Paste your content here..." className="w-full h-64 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none" />
          <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Target keyword" className="w-full mt-3 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
          <button onClick={analyzeContent} disabled={!content || loading} className="mt-4 w-full px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? 'Analyzing...' : 'Analyze Content'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {score && (
            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="font-semibold mb-4">Content Score</h3>
              <div className="flex items-center justify-center mb-4">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold ${
                  score.score >= 90 ? 'bg-green-500/20 text-green-400' :
                  score.score >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {score.grade}
                </div>
              </div>
              <div className="text-center text-2xl font-bold mb-2">{score.score}/100</div>
              <div className="space-y-2">
                {score.issues.map((issue, i) => (
                  <div key={i} className={`text-sm flex items-start gap-2 ${issue.severity === 'error' ? 'text-red-400' : 'text-yellow-400'}`}>
                    {issue.severity === 'error' ? <AlertTriangle className="w-4 h-4 mt-0.5" /> : <CheckCircle className="w-4 h-4 mt-0.5" />}
                    <span>{issue.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis && (
            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="font-semibold mb-4">NLP Analysis</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-400">Words:</span> {analysis.wordCount}</div>
                <div><span className="text-slate-400">Sentences:</span> {analysis.sentenceCount}</div>
                <div><span className="text-slate-400">Readability:</span> <span className={`${analysis.readability === 'easy' ? 'text-green-400' : analysis.readability === 'moderate' ? 'text-yellow-400' : 'text-red-400'}`}>{analysis.readability}</span></div>
                <div><span className="text-slate-400">Keyword Density:</span> {analysis.keywordDensity}%</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {metaDescriptions && (
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Generated Meta Descriptions</h3>
          <div className="space-y-3">
            {metaDescriptions.map((desc, i) => (
              <div key={i} className="bg-slate-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Option {desc.id}</span>
                  <span className="text-xs text-slate-500">{desc.length}/160</span>
                </div>
                <p className="text-sm">{desc.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function BriefGeneratorTab() {
  const [keyword, setKeyword] = useState('')
  const [targetLength, setTargetLength] = useState(1500)
  const [brief, setBrief] = useState(null)
  const [loading, setLoading] = useState(false)

  const generateBrief = async () => {
    if (!keyword) return
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/brief/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, targetLength })
      })
      const data = await res.json()
      if (data.success) setBrief(data.brief)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="font-semibold mb-4">Generate Content Brief</h3>
        <div className="flex gap-4">
          <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Enter target keyword" className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
          <select value={targetLength} onChange={e => setTargetLength(parseInt(e.target.value))} className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none">
            <option value="1000">1000 words</option>
            <option value="1500">1500 words</option>
            <option value="2000">2000 words</option>
            <option value="2500">2500 words</option>
          </select>
          <button onClick={generateBrief} disabled={!keyword || loading} className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50">
            {loading ? 'Generating...' : 'Generate Brief'}
          </button>
        </div>
      </div>

      {brief && (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Content Brief: {brief.keyword}</h3>
              <span className="text-sm text-slate-400">{brief.estimatedReadTime}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm mb-6">
              <div className="bg-slate-900 rounded-lg p-3"><span className="text-slate-400">Target Length:</span> {brief.targetLength} words</div>
              <div className="bg-slate-900 rounded-lg p-3"><span className="text-slate-400">Sections:</span> {brief.sections.length}</div>
              <div className="bg-slate-900 rounded-lg p-3"><span className="text-slate-400">Competitors:</span> {brief.competitorsAnalyzed}</div>
            </div>
          </div>

          <div className="space-y-4">
            {brief.sections.map((section, i) => (
              <div key={i} className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{section.title}</h4>
                  <span className="text-sm text-slate-400">{section.wordCount} words</span>
                </div>
                <p className="text-sm text-slate-300 mb-3">{section.guidance}</p>
                {section.questions && (
                  <div className="mb-3">
                    <span className="text-sm text-pink-400">Questions to Answer:</span>
                    <ul className="text-sm text-slate-400 mt-1 space-y-1">
                      {section.questions.map((q, qi) => <li key={qi}>• {q}</li>)}
                    </ul>
                  </div>
                )}
                {section.bullets && (
                  <div>
                    <span className="text-sm text-pink-400">Key Points:</span>
                    <ul className="text-sm text-slate-400 mt-1 space-y-1">
                      {section.bullets.map((b, bi) => <li key={bi}>• {b}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SuggestionsTab() {
  const [content, setContent] = useState('')
  const [keyword, setKeyword] = useState('')
  const [suggestions, setSuggestions] = useState(null)
  const [loading, setLoading] = useState(false)

  const getSuggestions = async (type) => {
    if (!content) return
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/suggestions/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, keyword })
      })
      const data = await res.json()
      if (data.success) setSuggestions({ type, ...data })
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="font-semibold mb-4">Get AI Suggestions</h3>
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Paste your content here..." className="w-full h-40 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none mb-4" />
        <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Target keyword" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4" />
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => getSuggestions('readability')} disabled={!content || loading} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 text-sm">Readability</button>
          <button onClick={() => getSuggestions('headings')} disabled={!content || loading} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 text-sm">Headings</button>
          <button onClick={() => getSuggestions('topics')} disabled={!content || !keyword || loading} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 text-sm">Related Topics</button>
          <button onClick={() => getSuggestions('semantics')} disabled={!content || !keyword || loading} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 text-sm">Semantic</button>
        </div>
      </div>

      {suggestions && (
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="font-semibold mb-4 capitalize">{suggestions.type} Suggestions</h3>
          <div className="space-y-3">
            {suggestions.suggestions?.map((s, i) => (
              <div key={i} className={`p-4 rounded-lg ${
                s.priority === 'high' ? 'bg-red-500/10 border border-red-500/30' :
                s.priority === 'medium' ? 'bg-yellow-500/10 border border-yellow-500/30' :
                'bg-slate-700/50 border border-slate-700'
              }`}>
                <div className="flex items-start gap-2">
                  {s.priority === 'high' ? <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" /> : 
                   s.priority === 'medium' ? <TrendingUp className="w-4 h-4 text-yellow-400 mt-0.5" /> :
                   <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />}
                  <div>
                    <p className="text-sm">{s.message}</p>
                    {s.example && <p className="text-xs text-slate-400 mt-2 font-mono">{s.example}</p>}
                  </div>
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
