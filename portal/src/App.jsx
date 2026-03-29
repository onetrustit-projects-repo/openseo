import { useState } from 'react'
import { Code, Key, BarChart3, Webhook, Book, Zap, Globe, Search, FileText, TrendingUp, Shield } from 'lucide-react'

const endpoints = [
  { 
    category: 'URL Audit', 
    icon: Globe,
    endpoints: [
      { method: 'POST', path: '/api/url-audit/analyze', desc: 'Analyze URL for SEO issues' },
      { method: 'POST', path: '/api/url-audit/batch', desc: 'Batch analyze multiple URLs' },
      { method: 'GET', path: '/api/url-audit/history/:url', desc: 'Get audit history' }
    ]
  },
  {
    category: 'Keywords',
    icon: Search,
    endpoints: [
      { method: 'POST', path: '/api/keywords/research', desc: 'Research keywords' },
      { method: 'POST', path: '/api/keywords/analyze', desc: 'Analyze keyword metrics' },
      { method: 'POST', path: '/api/keywords/track', desc: 'Track keyword rankings' },
      { method: 'GET', path: '/api/keywords/suggest', desc: 'Get keyword suggestions' }
    ]
  },
  {
    category: 'Schema',
    icon: FileText,
    endpoints: [
      { method: 'POST', path: '/api/schema/validate', desc: 'Validate schema markup' },
      { method: 'POST', path: '/api/schema/generate', desc: 'Generate schema markup' },
      { method: 'POST', path: '/api/schema/test', desc: 'Test schema markup' }
    ]
  },
  {
    category: 'Rank Tracking',
    icon: TrendingUp,
    endpoints: [
      { method: 'POST', path: '/api/ranks/track', desc: 'Track keyword rankings' },
      { method: 'POST', path: '/api/ranks/history', desc: 'Get ranking history' },
      { method: 'GET', path: '/api/ranks/features', desc: 'Get SERP features' },
      { method: 'GET', path: '/api/ranks/visibility', desc: 'Calculate visibility score' }
    ]
  },
  {
    category: 'Content',
    icon: Book,
    endpoints: [
      { method: 'POST', path: '/api/content/score', desc: 'Score content for SEO' },
      { method: 'POST', path: '/api/content/analyze', desc: 'Deep content analysis' },
      { method: 'POST', path: '/api/content/compare', desc: 'Compare with competitors' }
    ]
  },
  {
    category: 'Site Crawling',
    icon: Zap,
    endpoints: [
      { method: 'POST', path: '/api/crawl/start', desc: 'Start crawl job' },
      { method: 'GET', path: '/api/crawl/status/:jobId', desc: 'Get crawl status' },
      { method: 'GET', path: '/api/crawl/results/:jobId', desc: 'Get crawl results' },
      { method: 'POST', path: '/api/crawl/sitemap', desc: 'Generate sitemap' }
    ]
  }
]

const codeExamples = {
  curl: `curl -X POST https://api.openseo.dev/api/url-audit/analyze \\
  -H "X-API-Key: your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com"}'`,
  node: `const response = await fetch('https://api.openseo.dev/api/url-audit/analyze', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your-api-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ url: 'https://example.com' })
});
const data = await response.json();`,
  python: `import requests

response = requests.post(
    'https://api.openseo.dev/api/url-audit/analyze',
    headers={'X-API-Key': 'your-api-key'},
    json={'url': 'https://example.com'}
)
data = response.json()`,
  go: `req, _ := http.NewRequest("POST", "https://api.openseo.dev/api/url-audit/analyze", 
    strings.NewReader(\`{"url":"https://example.com"}\`))
req.Header.Set("X-API-Key", "your-api-key")
client := &http.Client{}
resp, _ := client.Do(req)`
}

const webhooks = [
  { event: 'audit.complete', desc: 'URL audit completed' },
  { event: 'crawl.complete', desc: 'Site crawl completed' },
  { event: 'rank.change', desc: 'Keyword ranking changed' },
  { event: 'issue.detected', desc: 'New SEO issue detected' }
]

function App() {
  const [activeTab, setActiveTab] = useState('docs')
  const [apiKey, setApiKey] = useState('openseo-test-key-001')
  const [selectedLang, setSelectedLang] = useState('curl')
  const [selectedEndpoint, setSelectedEndpoint] = useState(null)

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold">OpenSEO</span>
              <p className="text-xs text-slate-400">Developer Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg">
              <Key className="w-4 h-4 text-emerald-400" />
              <code className="text-xs text-emerald-400">{apiKey.slice(0, 20)}...</code>
            </div>
            <button className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600">
              Get API Key
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-800 min-h-screen fixed left-0 top-16 bottom-0 overflow-y-auto">
          <nav className="p-4 space-y-1">
            {[
              { id: 'docs', icon: Book, label: 'API Documentation' },
              { id: 'keys', icon: Key, label: 'API Keys' },
              { id: 'analytics', icon: BarChart3, label: 'Usage Analytics' },
              { id: 'webhooks', icon: Webhook, label: 'Webhooks' },
              { id: 'sdks', icon: Code, label: 'Code Examples' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          {activeTab === 'docs' && (
            <div>
              <h1 className="text-2xl font-bold mb-6">API Documentation</h1>
              
              {/* Quick Start */}
              <div className="bg-slate-800 rounded-xl p-6 mb-8">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-400" />
                  Quick Start
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <p className="text-slate-300">Get your API key from the dashboard</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <p className="text-slate-300">Include your API key in the <code className="bg-slate-900 px-2 py-1 rounded text-emerald-400">X-API-Key</code> header</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <p className="text-slate-300">Start making API calls</p>
                  </div>
                </div>
              </div>

              {/* Endpoints */}
              <div className="space-y-6">
                {endpoints.map(category => (
                  <div key={category.category} className="bg-slate-800 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-slate-700 flex items-center gap-3">
                      <category.icon className="w-5 h-5 text-emerald-400" />
                      <h3 className="font-semibold">{category.category}</h3>
                    </div>
                    <div className="divide-y divide-slate-700">
                      {category.endpoints.map(ep => (
                        <div 
                          key={ep.path}
                          onClick={() => setSelectedEndpoint(ep)}
                          className="p-4 hover:bg-slate-750 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              ep.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                              ep.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {ep.method}
                            </span>
                            <code className="text-sm text-slate-300">{ep.path}</code>
                          </div>
                          <p className="mt-2 text-sm text-slate-500">{ep.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'keys' && (
            <div>
              <h1 className="text-2xl font-bold mb-6">API Keys</h1>
              <div className="bg-slate-800 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Primary Key</h3>
                    <p className="text-sm text-slate-500">Created Mar 15, 2026</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded-full">Active</span>
                </div>
                <div className="flex items-center gap-3">
                  <code className="flex-1 bg-slate-900 px-4 py-3 rounded-lg text-emerald-400 font-mono">
                    openseo_test_key_001••••••••••••
                  </code>
                  <button className="px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-700">
                    Copy
                  </button>
                </div>
              </div>
              <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center gap-2">
                <Key className="w-4 h-4" />
                Generate New Key
              </button>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Usage Analytics</h1>
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Requests This Month', value: '15,420', change: '+12%' },
                  { label: 'Remaining Credits', value: '84,580', change: '' },
                  { label: 'API Calls Today', value: '523', change: '+5%' },
                  { label: 'Avg Response Time', value: '124ms', change: '-8%' }
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-800 rounded-xl p-5">
                    <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    {stat.change && <p className="text-sm text-emerald-400">{stat.change}</p>}
                  </div>
                ))}
              </div>
              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="font-semibold mb-4">Usage by Endpoint</h3>
                <div className="space-y-3">
                  {[
                    { endpoint: '/url-audit/analyze', calls: 5230 },
                    { endpoint: '/keywords/research', calls: 4120 },
                    { endpoint: '/ranks/track', calls: 3450 },
                    { endpoint: '/crawl/start', calls: 1620 },
                    { endpoint: '/content/score', calls: 1000 }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300">{item.endpoint}</span>
                          <span className="text-slate-500">{item.calls.toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${(item.calls / 5230) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'webhooks' && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Webhooks</h1>
              <div className="bg-slate-800 rounded-xl p-6 mb-6">
                <h3 className="font-semibold mb-4">Available Events</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {webhooks.map(w => (
                    <div key={w.event} className="p-4 bg-slate-900 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Webhook className="w-4 h-4 text-emerald-400" />
                        <code className="text-sm text-emerald-400">{w.event}</code>
                      </div>
                      <p className="text-sm text-slate-500">{w.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center gap-2">
                <Webhook className="w-4 h-4" />
                Add Webhook
              </button>
            </div>
          )}

          {activeTab === 'sdks' && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Code Examples</h1>
              <div className="flex gap-2 mb-6">
                {Object.keys(codeExamples).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLang(lang)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedLang === lang 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="bg-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                  <span className="text-sm text-slate-400">{selectedLang.toUpperCase()} Example</span>
                  <button className="text-sm text-emerald-400 hover:text-emerald-300">Copy</button>
                </div>
                <pre className="p-4 overflow-x-auto">
                  <code className="text-sm text-slate-300 font-mono">{codeExamples[selectedLang]}</code>
                </pre>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
