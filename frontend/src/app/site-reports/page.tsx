'use client'

import { useState } from 'react'
import { Search, FileText, AlertTriangle, RefreshCw, CheckCircle, XCircle, Link2, TrendingUp } from 'lucide-react'

const API_BASE = 'http://172.16.160.37:3002'

export default function SiteReports() {
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [error, setError] = useState(null)

  const fetchReport = async () => {
    if (!domain) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/audit-v2/report/${encodeURIComponent(domain)}`)
      const data = await res.json()
      if (data.success) {
        setReport(data.report)
      } else {
        setError(data.error || 'Failed to fetch report')
      }
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Site Reports</h1>
      
      <div className="bg-slate-800 rounded-xl p-6 mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Enter domain (e.g., example.com)"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            onKeyDown={(e) => e.key === 'Enter' && fetchReport()}
          />
          <button
            onClick={fetchReport}
            disabled={loading || !domain}
            className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            {loading ? 'Loading...' : 'Get Report'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {report && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Overall Health Score</h2>
              <button onClick={fetchReport} className="p-2 hover:bg-slate-700 rounded-lg">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-6">
              <div className={`text-6xl font-bold ${getScoreColor(report.overallScore)}`}>
                {report.overallScore}
              </div>
              <div className="flex-1">
                <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${report.overallScore >= 80 ? 'bg-green-500' : report.overallScore >= 60 ? 'bg-yellow-500' : report.overallScore >= 40 ? 'bg-orange-500' : 'bg-red-500'}`}
                    style={{ width: `${report.overallScore}%` }}
                  />
                </div>
                <p className="text-sm text-slate-400 mt-2">
                  Based on {report.totalAudits} audit{report.totalAudits !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-800 rounded-xl p-4 text-center">
              <FileText className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-2xl font-bold">{report.totalAudits}</p>
              <p className="text-sm text-slate-400">Total Audits</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 text-center">
              <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-400">
                {report.aggregatedIssues?.brokenLinks?.length || 0}
              </p>
              <p className="text-sm text-slate-400">Broken Links</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 text-center">
              <RefreshCw className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-400">
                {report.aggregatedIssues?.redirects?.length || 0}
              </p>
              <p className="text-sm text-slate-400">Redirects</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 text-center">
              <AlertTriangle className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-400">
                {report.aggregatedIssues?.schemaErrors?.length || 0}
              </p>
              <p className="text-sm text-slate-400">Schema Errors</p>
            </div>
          </div>

          {/* Audit History */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Audit History</h3>
            {report.audits?.length > 0 ? (
              <div className="space-y-3">
                {report.audits.map((audit) => (
                  <div key={audit.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div>
                      <p className="font-medium truncate">{audit.url}</p>
                      <p className="text-sm text-slate-400">
                        {new Date(audit.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {audit.summary && (
                        <span className={`font-bold ${getScoreColor(audit.summary.healthScore)}`}>
                          {audit.summary.healthScore}%
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded text-xs ${
                        audit.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {audit.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-4">No audits yet for this domain</p>
            )}
          </div>

          {/* Issues Detail */}
          {(report.aggregatedIssues?.brokenLinks?.length > 0 || report.aggregatedIssues?.redirects?.length > 0) && (
            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Top Issues</h3>
              <div className="space-y-4">
                {report.aggregatedIssues.brokenLinks?.slice(0, 5).map((link, i) => (
                  <div key={`bl-${i}`} className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{link.from || link.to}</p>
                      <p className="text-xs text-slate-400">404 - Page not found</p>
                    </div>
                  </div>
                ))}
                {report.aggregatedIssues.redirects?.slice(0, 5).map((redirect, i) => (
                  <div key={`rd-${i}`} className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <RefreshCw className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{redirect.from}</p>
                      <p className="text-xs text-slate-400">→ {redirect.toUrl || redirect.to}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!report && !loading && !error && (
        <div className="text-center py-12 text-slate-400">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Enter a domain to generate a consolidated SEO report</p>
        </div>
      )}
    </div>
  )
}
