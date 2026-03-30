'use client'

import { useState, useEffect } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'

export default function SiteAudits() {
  const [activeTab, setActiveTab] = useState('audit')
  const [url, setUrl] = useState('')
  const [maxPages, setMaxPages] = useState(100)
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [audits, setAudits] = useState([])
  const [selectedAudit, setSelectedAudit] = useState(null)

  useEffect(() => {
    fetchAudits()
  }, [])

  const fetchAudits = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/audit-v2`)
      const data = await res.json()
      if (data.success) setAudits(data.audits || [])
    } catch (err) {
      console.error(err)
    }
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
      setTimeout(poll, 2000)
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
          className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'audit' ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
        >
          Run Audit
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'results' ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
        >
          Results ({audits.length})
        </button>
        <button
          onClick={() => setActiveTab('issues')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'issues' ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
        >
          Issues
        </button>
      </div>

      {activeTab === 'audit' && (
        <div className="max-w-2xl space-y-6">
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="font-semibold mb-4">Start New Technical SEO Audit</h2>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
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
              className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              {running ? `Running... ${progress}%` : 'Start Audit'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'results' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Audit History</h2>
            <button onClick={fetchAudits} className="px-3 py-1.5 bg-slate-700 rounded-lg text-sm hover:bg-slate-600">
              Refresh
            </button>
          </div>

          {audits.length === 0 ? (
            <div className="text-center py-12 text-slate-400 bg-slate-800 rounded-xl">No audits run yet.</div>
          ) : (
            <div className="grid gap-4">
              {audits.map((audit) => (
                <div key={audit.id} className="bg-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium truncate">{audit.url}</p>
                    <p className="text-sm text-slate-400">{new Date(audit.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
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
        </div>
      )}

      {activeTab === 'issues' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Issues Overview</h2>
          <div className="bg-slate-800 rounded-xl p-6">
            <p className="text-slate-400 text-center">Run an audit to see issues.</p>
          </div>
        </div>
      )}
    </div>
  )
}
