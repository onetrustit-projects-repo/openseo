import { useState } from 'react'
import { FileText, Search, Settings, Eye, Plus, Trash2, Download, Upload } from 'lucide-react'

const API_BASE = '/api'

const tabs = [
  { id: 'sitemap', label: 'Sitemap', icon: FileText },
  { id: 'robots', label: 'Robots.txt', icon: Search },
  { id: 'preview', label: 'Preview', icon: Eye },
  { id: 'templates', label: 'Templates', icon: Settings }
]

function App() {
  const [activeTab, setActiveTab] = useState('sitemap')
  const [domain, setDomain] = useState('example.com')

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold">OpenSEO</span>
              <p className="text-xs text-slate-400">Sitemap & Robots</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm w-64"
              placeholder="Enter domain..."
            />
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
                    ? 'bg-cyan-500/20 text-cyan-400' 
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
          {activeTab === 'sitemap' && <SitemapTab domain={domain} />}
          {activeTab === 'robots' && <RobotsTab domain={domain} />}
          {activeTab === 'preview' && <PreviewTab domain={domain} />}
          {activeTab === 'templates' && <TemplatesTab domain={domain} />}
        </main>
      </div>
    </div>
  )
}

function SitemapTab({ domain }) {
  const [pages, setPages] = useState([
    { url: `https://${domain}/`, priority: '1.0', changefreq: 'daily', section: 'home' },
    { url: `https://${domain}/about`, priority: '0.8', changefreq: 'monthly', section: 'pages' },
    { url: `https://${domain}/products`, priority: '0.9', changefreq: 'weekly', section: 'products' }
  ])
  const [xml, setXml] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/sitemap/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, pages })
      })
      const data = await res.json()
      setXml(data.data.xml)
    } catch (err) {
      console.error('Failed to generate sitemap:', err)
    }
    setLoading(false)
  }

  const addPage = () => {
    setPages([...pages, { url: '', priority: '0.7', changefreq: 'weekly', section: 'general' }])
  }

  const updatePage = (index, field, value) => {
    const updated = [...pages]
    updated[index][field] = value
    setPages(updated)
  }

  const removePage = (index) => {
    setPages(pages.filter((_, i) => i !== index))
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Sitemap Management</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Page List */}
        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Pages</h2>
            <button
              onClick={addPage}
              className="px-3 py-1.5 bg-slate-700 text-sm rounded-lg hover:bg-slate-600 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Page
            </button>
          </div>
          
          <div className="space-y-3">
            {pages.map((page, i) => (
              <div key={i} className="bg-slate-900 rounded-lg p-4">
                <input
                  type="text"
                  value={page.url}
                  onChange={(e) => updatePage(i, 'url', e.target.value)}
                  placeholder="Page URL"
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 mb-2 text-sm"
                />
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={page.priority}
                    onChange={(e) => updatePage(i, 'priority', e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs"
                  >
                    <option value="1.0">Priority 1.0</option>
                    <option value="0.9">Priority 0.9</option>
                    <option value="0.8">Priority 0.8</option>
                    <option value="0.7">Priority 0.7</option>
                    <option value="0.6">Priority 0.6</option>
                    <option value="0.5">Priority 0.5</option>
                  </select>
                  <select
                    value={page.changefreq}
                    onChange={(e) => updatePage(i, 'changefreq', e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                  <button
                    onClick={() => removePage(i)}
                    className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={loading || pages.length === 0}
            className="w-full mt-4 px-4 py-3 bg-cyan-500 text-white font-medium rounded-lg hover:bg-cyan-600 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Sitemap XML'}
          </button>
        </div>
        
        {/* XML Preview */}
        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Generated XML</h2>
            {xml && (
              <button className="px-3 py-1.5 bg-slate-700 text-sm rounded-lg hover:bg-slate-600 flex items-center gap-2">
                <Download className="w-4 h-4" /> Download
              </button>
            )}
          </div>
          
          {xml ? (
            <pre className="bg-slate-900 rounded-lg p-4 overflow-x-auto text-xs text-cyan-300 max-h-96 overflow-y-auto">
              {xml}
            </pre>
          ) : (
            <div className="bg-slate-900 rounded-lg p-8 text-center text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Click "Generate Sitemap XML" to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function RobotsTab({ domain }) {
  const [rules, setRules] = useState([
    { userAgent: '*', allow: ['/'], disallow: [] }
  ])
  const [crawlDelay, setCrawlDelay] = useState('')
  const [txt, setTxt] = useState(null)

  const handleGenerate = async () => {
    try {
      const res = await fetch(`${API_BASE}/robots/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, rules, crawlDelay: crawlDelay ? parseInt(crawlDelay) : null })
      })
      const data = await res.json()
      setTxt(data.data.txt)
    } catch (err) {
      console.error('Failed to generate robots.txt:', err)
    }
  }

  const addRule = () => {
    setRules([...rules, { userAgent: '', allow: [], disallow: [] }])
  }

  const updateRule = (index, field, value) => {
    const updated = [...rules]
    updated[index][field] = value
    setRules(updated)
  }

  const removeRule = (index) => {
    setRules(rules.filter((_, i) => i !== index))
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Robots.txt Management</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Rules Editor */}
        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Rules</h2>
            <button
              onClick={addRule}
              className="px-3 py-1.5 bg-slate-700 text-sm rounded-lg hover:bg-slate-600 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Rule
            </button>
          </div>
          
          <div className="space-y-4">
            {rules.map((rule, i) => (
              <div key={i} className="bg-slate-900 rounded-lg p-4">
                <div className="mb-3">
                  <label className="text-xs text-slate-400 block mb-1">User Agent</label>
                  <input
                    type="text"
                    value={rule.userAgent}
                    onChange={(e) => updateRule(i, 'userAgent', e.target.value)}
                    placeholder="* or specific bot"
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="text-xs text-slate-400 block mb-1">Allow (one per line)</label>
                  <textarea
                    value={rule.allow.join('\n')}
                    onChange={(e) => updateRule(i, 'allow', e.target.value.split('\n').filter(Boolean))}
                    placeholder="/public/"
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm h-20"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="text-xs text-slate-400 block mb-1">Disallow (one per line)</label>
                  <textarea
                    value={rule.disallow.join('\n')}
                    onChange={(e) => updateRule(i, 'disallow', e.target.value.split('\n').filter(Boolean))}
                    placeholder="/admin/"
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm h-20"
                  />
                </div>
                
                <button
                  onClick={() => removeRule(i)}
                  className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Remove Rule
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-4 mb-4">
            <label className="text-xs text-slate-400 block mb-1">Crawl Delay (seconds)</label>
            <input
              type="number"
              value={crawlDelay}
              onChange={(e) => setCrawlDelay(e.target.value)}
              placeholder="Optional"
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
            />
          </div>
          
          <button
            onClick={handleGenerate}
            className="w-full px-4 py-3 bg-cyan-500 text-white font-medium rounded-lg hover:bg-cyan-600"
          >
            Generate Robots.txt
          </button>
        </div>
        
        {/* TXT Preview */}
        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Generated robots.txt</h2>
            {txt && (
              <button className="px-3 py-1.5 bg-slate-700 text-sm rounded-lg hover:bg-slate-600 flex items-center gap-2">
                <Download className="w-4 h-4" /> Download
              </button>
            )}
          </div>
          
          {txt ? (
            <pre className="bg-slate-900 rounded-lg p-4 overflow-x-auto text-sm text-cyan-300 whitespace-pre-wrap">
              {txt}
            </pre>
          ) : (
            <div className="bg-slate-900 rounded-lg p-8 text-center text-slate-500">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Click "Generate Robots.txt" to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PreviewTab({ domain }) {
  const [interpretation, setInterpretation] = useState(null)
  const [loading, setLoading] = useState(false)

  const testPaths = ['/', '/about', '/admin', '/api', '/sitemap.xml', '/wp-admin', '/login']

  const handlePreview = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/robots/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain })
      })
      const data = await res.json()
      setInterpretation(data.data)
    } catch (err) {
      console.error('Failed to preview:', err)
    }
    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Rule Interpretation Preview</h1>
      
      <div className="bg-slate-800 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">How Search Engines Interpret Your Rules</h2>
        <p className="text-slate-400 mb-4">
          Preview how common search engine crawlers will interpret your robots.txt rules for typical paths.
        </p>
        <button
          onClick={handlePreview}
          disabled={loading}
          className="px-4 py-2 bg-cyan-500 text-white font-medium rounded-lg hover:bg-cyan-600 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Run Preview'}
        </button>
      </div>
      
      {interpretation && (
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Path Interpretations</h3>
          <div className="space-y-2">
            {interpretation.interpretations.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${item.allowed ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                  <code className="text-sm text-slate-300">{item.path}</code>
                </div>
                <span className={`text-sm ${item.allowed ? 'text-emerald-400' : 'text-red-400'}`}>
                  {item.allowed ? 'Allowed' : 'Disallowed'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function TemplatesTab({ domain }) {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(false)

  const loadTemplates = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/robots/templates/list`)
      const data = await res.json()
      setTemplates(data.templates)
    } catch (err) {
      console.error('Failed to load templates:', err)
    }
    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Robots.txt Templates</h1>
      
      {!templates.length && (
        <button
          onClick={loadTemplates}
          disabled={loading}
          className="px-4 py-2 bg-cyan-500 text-white font-medium rounded-lg hover:bg-cyan-600 disabled:opacity-50 mb-6"
        >
          {loading ? 'Loading...' : 'Load Templates'}
        </button>
      )}
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map(tpl => (
          <div key={tpl.id} className="bg-slate-800 rounded-xl p-5">
            <h3 className="font-semibold mb-2">{tpl.name}</h3>
            <p className="text-sm text-slate-400 mb-4">{tpl.description}</p>
            <div className="text-xs text-slate-500 space-y-1">
              {tpl.rules.map((rule, i) => (
                <div key={i}>
                  <span className="text-cyan-400">{rule.userAgent}</span>
                  <span className="text-slate-500"> - </span>
                  <span>{rule.allow.length} allow, {rule.disallow.length} disallow</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
