'use client'

import { useState, useEffect } from 'react'
import { Search, FileText, AlertTriangle, RefreshCw, CheckCircle, XCircle, Link2, Clock } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'

export default function SiteAudits() {
  const [activeTab, setActiveTab] = useState('audit')
  const [url, setUrl] = useState('')
  const [maxPages, setMaxPages] = useState(100)
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [audits, setAudits] = useState([])
  const [selectedAudit, setSelectedAudit] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAudits()
  }, [])

  const fetchAudits = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/audit-v2`)
      const data = await res.json()
      if (data.success) setAudits(data.audits || [])
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const startAudit = async () => {
    if (!url) return
    setRunning(true)
    setProgress(0)
    try {
      const res = await fetch(`${API_BASE}/api/audit-v2/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, maxPages })
      })
      const data = await res.json()
      if (data.success) {
        pollAudit(data.auditId)
      }
    } catch (err) {
      console.error(err)
      setRunning(false)
    }
  }

  const pollAudit = async (id) => {
    const poll = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/audit-v2/${id}`)
        const data = await res.json()
        if (data.success) {
          setProgress(data.audit.progress || 0)
          if (data.audit.status === 'completed' || data.audit.status === 'failed') {
            setRunning(false)
            fetchAudits()
            return
          }
        }
      } catch (err) {
        console.error(err)
      }
      if (running) setTimeout(poll, 2000)
    }
    poll()
  }

  const viewAudit = async (audit) => {
    try {
      const res = await fetch(`${API_BASE}/api/audit-v2/${audit.id}/results`)
      const data = await res.json()
      if (data.success) setSelectedAudit({ ...audit, results: data.results })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-6">
      <div className="flex gap-2 mb-6 border-b border-slate-700 pb-4">
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${activeTab === 'audit' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
        >
          <Search className="w-4 h-4" /> Run Audit
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${activeTab === 'results' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
        >
          <FileText className="w-4 h-4" /> Results ({audits.length})
        </button>
        <button
          onClick={() => setActiveTab('issues')}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${activeTab === 'issues' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
        >
          <AlertTriangle className="w-4 h-4" /> Issues
        </button>
      </div>

      {activeTab === 'audit' && (
        <div className="max-w-2xl space-y-6">
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-4">Start Technical SEO Audit</h2>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex items-center gap-4 mb-4">
              <label className="text-sm text-slate-400">Max pages:</label>
              <select
                value={maxPages}
                onChange={(e) => setMaxPages(parseInt(e.target.value))}
                className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm"
              >
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={500}>500</option>
                <option value={1000}>1000</option>
              </select>
            </div>
            <button
              onClick={startAudit}
              disabled={running || !url}
              className="w-full px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {running ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Running... {progress}%
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" /> Start Audit
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4">What This Audit Checks</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Link2, label: 'Broken Links', desc: '404 errors and dead pages', color: 'text-red-400' },
                { icon: RefreshCw, label: 'Redirect Chains', desc: 'Multi-hop redirect issues', color: 'text-yellow-400' },
                { icon: FileText, label: 'Duplicate Content', desc: 'SimHash-based detection', color: 'text-blue-400' },
                { icon: AlertTriangle, label: 'Schema Errors', desc: 'Invalid structured data', color: 'text-orange-400' },
                { icon: CheckCircle, label: 'Meta Tags', desc: 'Missing or duplicate tags', color: 'text-purple-400' },
                { icon: Clock, label: 'Crawl Efficiency', desc: 'Budget analysis', color: 'text-cyan-400' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-700 rounded-lg">
                  <item.icon className={`w-5 h-5 ${item.color} flex-shrink-0`} />
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'results' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Audit History</h2>
            <button onClick={fetchAudits} className="px-3 py-1.5 bg-slate-700 rounded-lg text-sm hover:bg-slate-600 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading...</div>
          ) : audits.length === 0 ? (
            <div className="text-center py-12 text-slate-400 bg-slate-800 rounded-xl">No audits run yet. Start an audit to see results.</div>
          ) : (
            <div className="grid gap-4">
              {audits.map((audit) => (
                <div key={audit.id} className="bg-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium truncate">{audit.url}</p>
                    <p className="text-sm text-slate-400">{new Date(audit.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {audit.summary && (
                      <div className="text-right">
                        <p className="text-sm font-medium">{audit.summary.healthScore}%</p>
                        <p className="text-xs text-slate-400">Health</p>
                      </div>
                    )}
                    <span className={`px-2 py-1 rounded text-xs ${
                      audit.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      audit.status === 'running' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {audit.status}
                    </span>
                    {audit.status === 'completed' && (
                      <button
                        onClick={() => viewAudit(audit)}
                        className="px-3 py-1.5 bg-slate-700 rounded-lg text-sm hover:bg-slate-600"
                      >
                        View
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedAudit && selectedAudit.results && (
            <div className="bg-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Results: {selectedAudit.url}</h3>
                <button onClick={() => setSelectedAudit(null)} className="text-slate-400 hover:text-white flex items-center gap-2">
                  <XCircle className="w-5 h-5" /> Close
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-700 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold">{selectedAudit.results.crawlStats?.pages || 0}</p>
                  <p className="text-sm text-slate-400">Pages Crawled</p>
                </div>
                <div className="bg-slate-700 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-red-400">{selectedAudit.results.brokenLinks?.length || 0}</p>
                  <p className="text-sm text-slate-400">Broken Links</p>
                </div>
                <div className="bg-slate-700 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-400">{selectedAudit.results.redirects?.length || 0}</p>
                  <p className="text-sm text-slate-400">Redirects</p>
                </div>
                <div className="bg-slate-700 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-orange-400">{selectedAudit.results.schemaErrors?.length || 0}</p>
                  <p className="text-sm text-slate-400">Schema Errors</p>
                </div>
              </div>

              {selectedAudit.results.brokenLinks?.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <h4 className="font-medium text-red-400 mb-2">Top Broken Links</h4>
                  <div className="space-y-2">
                    {selectedAudit.results.brokenLinks.slice(0, 5).map((link, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span className="text-slate-300">{link.from}</span>
                        <span className="text-slate-500">→</span>
                        <span className="text-red-400">{link.to}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'issues' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Issues Overview</h2>
          <div className="bg-slate-800 rounded-xl p-6">
            <p className="text-slate-400 text-center">Run an audit to see detailed issues, or view results above.</p>
          </div>
        </div>
      )}
    </div>
  )
}
