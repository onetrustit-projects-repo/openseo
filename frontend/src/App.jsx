import { useState } from 'react'
import { Video, Image, Eye, Search, FileText, Camera, TrendingUp } from 'lucide-react'

const API_BASE = '/api'

const tabs = [
  { id: 'video', label: 'Video SEO', icon: Video },
  { id: 'image', label: 'Image SEO', icon: Image },
  { id: 'visual', label: 'Visual Tracking', icon: Eye }
]

function App() {
  const [activeTab, setActiveTab] = useState('video')

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold">OpenSEO</span>
              <p className="text-xs text-slate-400">Video & Visual Search</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-800 min-h-screen fixed left-0 top-16 bottom-0">
          <nav className="p-4 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-purple-500/20 text-purple-400' 
                    : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          {activeTab === 'video' && <VideoTab />}
          {activeTab === 'image' && <ImageTab />}
          {activeTab === 'visual' && <VisualTab />}
        </main>
      </div>
    </div>
  )
}

function VideoTab() {
  const [url, setUrl] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!url) return
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/video/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
      const data = await res.json()
      setResults(data.data)
    } catch (err) {
      console.error('Failed to analyze video:', err)
    }
    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Video SEO Analysis</h1>
      
      <div className="bg-slate-800 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Analyze Video</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter video URL..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !url}
            className="px-6 py-3 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>

      {results && (
        <div className="bg-slate-800 rounded-xl p-6">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-slate-900 rounded-lg p-4">
              <p className="text-sm text-slate-500 mb-1">SEO Score</p>
              <p className="text-3xl font-bold text-purple-400">{results.score}</p>
            </div>
            <div className="bg-slate-900 rounded-lg p-4">
              <p className="text-sm text-slate-500 mb-1">Transcript Words</p>
              <p className="text-3xl font-bold">{results.transcript?.wordCount || 0}</p>
            </div>
            <div className="bg-slate-900 rounded-lg p-4">
              <p className="text-sm text-slate-500 mb-1">Searchable</p>
              <p className="text-3xl font-bold">{results.transcript?.searchable ? 'Yes' : 'No'}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Recommendations</h3>
            <ul className="space-y-2">
              {results.recommendations?.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2"></span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

function ImageTab() {
  const [images, setImages] = useState([{ url: '' }])
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const addImage = () => {
    setImages([...images, { url: '' }])
  }

  const updateImage = (index, url) => {
    const updated = [...images]
    updated[index].url = url
    setImages(updated)
  }

  const handleAnalyze = async () => {
    const validImages = images.filter(i => i.url)
    if (validImages.length === 0) return
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/image/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: validImages })
      })
      const data = await res.json()
      setResults(data.results)
    } catch (err) {
      console.error('Failed to analyze images:', err)
    }
    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Image SEO Optimization</h1>
      
      <div className="bg-slate-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Add Images</h2>
          <button
            onClick={addImage}
            className="px-3 py-1.5 bg-slate-700 text-sm rounded-lg hover:bg-slate-600"
          >
            + Add Image
          </button>
        </div>
        
        <div className="space-y-3 mb-4">
          {images.map((img, i) => (
            <input
              key={i}
              type="text"
              value={img.url}
              onChange={(e) => updateImage(i, e.target.value)}
              placeholder={`Image ${i + 1} URL...`}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          ))}
        </div>
        
        <button
          onClick={handleAnalyze}
          disabled={loading || images.every(i => !i.url)}
          className="px-6 py-3 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze Images'}
        </button>
      </div>

      {results && (
        <div className="space-y-4">
          {results.map((result, i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-medium truncate max-w-md">{result.url}</p>
                  <p className="text-sm text-slate-500">{result.filename}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  result.score >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
                  result.score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {result.score}
                </span>
              </div>
              
              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div className="bg-slate-900 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Alt Status</p>
                  <p className="font-medium">{result.issues.missingAlt ? 'Missing' : 'Present'}</p>
                </div>
                <div className="bg-slate-900 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Alt Quality</p>
                  <p className="font-medium capitalize">{result.issues.altQuality}</p>
                </div>
                <div className="bg-slate-900 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Descriptive</p>
                  <p className="font-medium">{result.issues.descriptive ? 'Yes' : 'No'}</p>
                </div>
                <div className="bg-slate-900 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Has Keyword</p>
                  <p className="font-medium">{result.issues.keywordPresent ? 'Yes' : 'No'}</p>
                </div>
              </div>
              
              {result.recommendations.length > 0 && (
                <div>
                  <p className="text-sm text-slate-500 mb-2">Recommendations:</p>
                  <ul className="space-y-1">
                    {result.recommendations.map((rec, j) => (
                      <li key={j} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5"></span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function VisualTab() {
  const [domain, setDomain] = useState('')
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFetch = async () => {
    if (!domain) return
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/visual/overview?domain=${domain}`)
      const data = await res.json()
      setOverview(data.data)
    } catch (err) {
      console.error('Failed to fetch overview:', err)
    }
    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Visual Search Tracking</h1>
      
      <div className="bg-slate-800 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Enter Domain</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleFetch}
            disabled={loading || !domain}
            className="px-6 py-3 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Get Overview'}
          </button>
        </div>
      </div>

      {overview && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-slate-800 rounded-xl p-5">
              <p className="text-sm text-slate-500 mb-1">Images Tracked</p>
              <p className="text-2xl font-bold">{overview.totalImagesTracked}</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-5">
              <p className="text-sm text-slate-500 mb-1">Videos Tracked</p>
              <p className="text-2xl font-bold">{overview.totalVideosTracked}</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-5">
              <p className="text-sm text-slate-500 mb-1">Avg Image Position</p>
              <p className="text-2xl font-bold">{overview.avgImagePosition}</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-5">
              <p className="text-sm text-slate-500 mb-1">Image Visibility</p>
              <p className="text-2xl font-bold text-purple-400">{overview.imageVisibility}</p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Visual Search Traffic</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-slate-500">Sessions</p>
                <p className="text-xl font-bold">{overview.visualSearchTraffic.sessions}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Pageviews</p>
                <p className="text-xl font-bold">{overview.visualSearchTraffic.pageviews}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Bounce Rate</p>
                <p className="text-xl font-bold">{overview.visualSearchTraffic.bounceRate}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Top Visual Queries</h3>
            <div className="space-y-3">
              {overview.topVisualQueries.map((q, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      q.type === 'image' ? 'bg-purple-500/20 text-purple-400' : 'bg-pink-500/20 text-pink-400'
                    }`}>
                      {q.type}
                    </span>
                    <span className="text-slate-300">{q.query}</span>
                  </div>
                  <span className="text-slate-500">{q.count} queries</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
