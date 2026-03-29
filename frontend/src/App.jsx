import { useState } from 'react'
import { BookOpen, Link2, FileText, RefreshCw, Settings, Plus, Trash2 } from 'lucide-react'

const API_BASE = '/api'

const tabs = [
  { id: 'analyze', label: 'Analyze', icon: BookOpen },
  { id: 'sync', label: 'Sync', icon: RefreshCw },
  { id: 'meta', label: 'Meta Tags', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings }
]

function App() {
  const [activeTab, setActiveTab] = useState('analyze')

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold">OpenSEO</span>
              <p className="text-xs text-slate-400">Notion Integration</p>
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
                    ? 'bg-amber-500/20 text-amber-400' 
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
          {activeTab === 'analyze' && <AnalyzeTab />}
          {activeTab === 'sync' && <SyncTab />}
          {activeTab === 'meta' && <MetaTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </main>
      </div>
    </div>
  )
}

function AnalyzeTab() {
  const [content, setContent] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!content) return
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/notion/analyze-page`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })
      const data = await res.json()
      setAnalysis(data.analysis)
    } catch (err) {
      console.error('Failed to analyze:', err)
    }
    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analyze Notion Content</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="font-semibold mb-4">Paste Notion Content</h2>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your Notion page content here..."
            className="w-full h-64 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !content}
            className="mt-4 px-6 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze Content'}
          </button>
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="font-semibold mb-4">Analysis Results</h2>
          {analysis ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">SEO Score</span>
                <span className={`text-3xl font-bold ${
                  analysis.score >= 80 ? 'text-emerald-400' :
                  analysis.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {analysis.score}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 rounded-lg p-4">
                  <p className="text-sm text-slate-500">Words</p>
                  <p className="text-xl font-bold">{analysis.metrics?.wordCount || 0}</p>
                </div>
                <div className="bg-slate-900 rounded-lg p-4">
                  <p className="text-sm text-slate-500">Headings</p>
                  <p className="text-xl font-bold">{analysis.metrics?.headingCount || 0}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Recommendations</h3>
                <ul className="space-y-2">
                  {analysis.recommendations?.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mt-1.5"></span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 py-12">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Enter content and click Analyze</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SyncTab() {
  const [syncing, setSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState(null)

  const handleSync = async () => {
    setSyncing(true)
    setTimeout(() => {
      setSyncStatus({
        status: 'completed',
        synced: 12,
        errors: 0,
        lastSync: new Date().toISOString()
      })
      setSyncing(false)
    }, 2000)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Sync with Notion</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="font-semibold mb-4">Sync Status</h2>
          
          {syncStatus ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium text-emerald-400">Sync Complete</p>
                  <p className="text-sm text-slate-500">{new Date(syncStatus.lastSync).toLocaleString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 rounded-lg p-4">
                  <p className="text-sm text-slate-500">Pages Synced</p>
                  <p className="text-2xl font-bold">{syncStatus.synced}</p>
                </div>
                <div className="bg-slate-900 rounded-lg p-4">
                  <p className="text-sm text-slate-500">Errors</p>
                  <p className="text-2xl font-bold text-red-400">{syncStatus.errors}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500 mb-4">Not currently synced</p>
              <button
                onClick={handleSync}
                disabled={syncing}
                className="px-6 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 disabled:opacity-50 flex items-center gap-2 mx-auto"
              >
                <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>
          )}
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="font-semibold mb-4">Sync Options</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              <span>Auto-sync on page save</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              <span>Include SEO metadata</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 rounded" />
              <span>Sync to specific database</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetaTab() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [keyword, setKeyword] = useState('')
  const [meta, setMeta] = useState(null)

  const handleGenerate = async () => {
    if (!title && !content) return
    try {
      const res = await fetch(`${API_BASE}/notion/generate-meta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, focusKeyword: keyword })
      })
      const data = await res.json()
      setMeta(data.meta)
    } catch (err) {
      console.error('Failed to generate meta:', err)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Generate Meta Tags</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-slate-800 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Page Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter page title..."
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Focus Keyword</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter focus keyword..."
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-40 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              placeholder="Paste your content..."
            />
          </div>
          <button
            onClick={handleGenerate}
            className="px-6 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600"
          >
            Generate Meta Tags
          </button>
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="font-semibold mb-4">Generated Meta Tags</h2>
          {meta ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-500 mb-1">Title</label>
                <code className="block bg-slate-900 p-3 rounded text-amber-400 text-sm">
                  {meta.title}
                </code>
                <p className="text-xs text-slate-500 mt-1">{meta.title.length}/60 characters</p>
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-1">Meta Description</label>
                <code className="block bg-slate-900 p-3 rounded text-amber-400 text-sm">
                  {meta.metaDescription}
                </code>
                <p className="text-xs text-slate-500 mt-1">{meta.metaDescription.length}/160 characters</p>
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-1">URL Slug</label>
                <code className="block bg-slate-900 p-3 rounded text-amber-400 text-sm">
                  /{meta.slug}
                </code>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 py-12">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Enter title and content to generate meta tags</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SettingsTab() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Notion Settings</h1>
      
      <div className="bg-slate-800 rounded-xl p-6 mb-6">
        <h2 className="font-semibold mb-4">Connected Workspaces</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-700 rounded flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="font-medium">My Workspace</p>
                <p className="text-sm text-slate-500">workspace_abc123</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded">Connected</span>
              <button className="text-red-400 text-sm hover:text-red-300">Disconnect</button>
            </div>
          </div>
        </div>
        <button className="mt-4 px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Workspace
        </button>
      </div>

      <div className="bg-slate-800 rounded-xl p-6">
        <h2 className="font-semibold mb-4">Sync Preferences</h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <span>Auto-sync on page edit</span>
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
          </label>
          <label className="flex items-center justify-between">
            <span>Include keyword tracking</span>
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
          </label>
          <label className="flex items-center justify-between">
            <span>Show SEO sidebar in Notion</span>
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
          </label>
        </div>
      </div>
    </div>
  )
}

export default App
