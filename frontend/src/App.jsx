import { useState } from 'react'
import { FileText, Clock, Palette, Download, Plus, Trash2, Play, Settings } from 'lucide-react'

const API_BASE = '/api'

const tabs = [
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'templates', label: 'Templates', icon: Settings },
  { id: 'schedules', label: 'Schedules', icon: Clock },
  { id: 'branding', label: 'White Label', icon: Palette }
]

function App() {
  const [activeTab, setActiveTab] = useState('reports')

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold">OpenSEO</span>
              <p className="text-xs text-slate-400">Report Generator</p>
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
          {activeTab === 'reports' && <ReportsTab />}
          {activeTab === 'templates' && <TemplatesTab />}
          {activeTab === 'schedules' && <SchedulesTab />}
          {activeTab === 'branding' && <BrandingTab />}
        </main>
      </div>
    </div>
  )
}

function ReportsTab() {
  const [reports, setReports] = useState([
    { id: '1', name: 'March SEO Summary', templateId: 'tpl_seo_summary', status: 'completed', createdAt: '2026-03-28' },
    { id: '2', name: 'Technical Audit Q1', templateId: 'tpl_technical_audit', status: 'completed', createdAt: '2026-03-25' },
    { id: '3', name: 'Keyword Tracking Feb', templateId: 'tpl_keyword_tracker', status: 'generating', createdAt: '2026-03-20' }
  ])
  const [loading, setLoading] = useState(false)

  const generateReport = async () => {
    setLoading(true)
    setTimeout(() => {
      setReports([...reports, {
        id: Date.now().toString(),
        name: 'New Report',
        templateId: 'tpl_seo_summary',
        status: 'completed',
        createdAt: new Date().toISOString().split('T')[0]
      }])
      setLoading(false)
    }, 1500)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>
        <button
          onClick={generateReport}
          disabled={loading}
          className="px-4 py-2 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 disabled:opacity-50 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {loading ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      <div className="bg-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Name</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Template</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Created</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {reports.map(report => (
                <tr key={report.id} className="hover:bg-slate-750">
                  <td className="px-6 py-4 font-medium">{report.name}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{report.templateId}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                      report.status === 'generating' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{report.createdAt}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-slate-700 rounded-lg">
                        <Download className="w-4 h-4 text-slate-400" />
                      </button>
                      <button className="p-2 hover:bg-slate-700 rounded-lg">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function TemplatesTab() {
  const [templates, setTemplates] = useState([
    { id: 'tpl_seo_summary', name: 'SEO Summary Report', sections: 5, description: 'Overview of key SEO metrics' },
    { id: 'tpl_technical_audit', name: 'Technical Audit Report', sections: 5, description: 'Deep dive into technical issues' },
    { id: 'tpl_keyword_tracker', name: 'Keyword Tracking Report', sections: 4, description: 'Keyword ranking changes' }
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Report Templates</h1>
        <button className="px-4 py-2 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Template
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {templates.map(tpl => (
          <div key={tpl.id} className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-amber-400" />
              </div>
              <span className="text-xs text-slate-500">{tpl.sections} sections</span>
            </div>
            <h3 className="font-semibold mb-2">{tpl.name}</h3>
            <p className="text-sm text-slate-400 mb-4">{tpl.description}</p>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-slate-700 text-sm rounded-lg hover:bg-slate-600">Edit</button>
              <button className="flex-1 px-3 py-2 bg-slate-700 text-sm rounded-lg hover:bg-slate-600">Preview</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SchedulesTab() {
  const [schedules, setSchedules] = useState([
    { id: '1', name: 'Weekly SEO Summary', frequency: 'weekly', nextRun: '2026-04-05', active: true },
    { id: '2', name: 'Monthly Technical Audit', frequency: 'monthly', nextRun: '2026-04-01', active: true },
    { id: '3', name: 'Daily Keyword Check', frequency: 'daily', nextRun: '2026-03-30', active: false }
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Scheduled Reports</h1>
        <button className="px-4 py-2 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Schedule
        </button>
      </div>

      <div className="space-y-4">
        {schedules.map(schedule => (
          <div key={schedule.id} className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${schedule.active ? 'bg-emerald-500' : 'bg-slate-500'}`}></div>
                <div>
                  <h3 className="font-semibold">{schedule.name}</h3>
                  <p className="text-sm text-slate-400 capitalize">{schedule.frequency} • Next: {schedule.nextRun}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600">
                  <Play className="w-4 h-4" />
                </button>
                <button className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600">
                  <Settings className="w-4 h-4" />
                </button>
                <button className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BrandingTab() {
  const [brandings] = useState([
    { id: 'default', name: 'Default White Label', primaryColor: '#10B981', active: true },
    { id: 'client_acme', name: 'Acme Corp Branding', primaryColor: '#3B82F6', active: false },
    { id: 'client_globex', name: 'Globex Inc', primaryColor: '#8B5CF6', active: false }
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">White Label Branding</h1>
        <button className="px-4 py-2 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Branding
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {brandings.map(brand => (
          <div key={brand.id} className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: brand.primaryColor }}>
                <Palette className="w-6 h-6 text-white" />
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                brand.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-600 text-slate-400'
              }`}>
                {brand.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <h3 className="font-semibold mb-1">{brand.name}</h3>
            <p className="text-sm text-slate-400 mb-4">ID: {brand.id}</p>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-slate-700 text-sm rounded-lg hover:bg-slate-600">Edit</button>
              <button className="flex-1 px-3 py-2 bg-slate-700 text-sm rounded-lg hover:bg-slate-600">Preview</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
