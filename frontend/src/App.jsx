import { useState } from 'react'
import { Bell, Slack, MessageSquare, Settings, Plus, Trash2, Play, Clock } from 'lucide-react'

const API_BASE = '/api'

const tabs = [
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'channels', label: 'Channels', icon: MessageSquare },
  { id: 'digests', label: 'Digests', icon: Clock },
  { id: 'settings', label: 'Settings', icon: Settings }
]

function App() {
  const [activeTab, setActiveTab] = useState('alerts')

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold">OpenSEO</span>
              <p className="text-xs text-slate-400">Alerting System</p>
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
                    ? 'bg-pink-500/20 text-pink-400' 
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
          {activeTab === 'alerts' && <AlertsTab />}
          {activeTab === 'channels' && <ChannelsTab />}
          {activeTab === 'digests' && <DigestsTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </main>
      </div>
    </div>
  )
}

function AlertsTab() {
  const [alerts, setAlerts] = useState([
    { id: '1', name: 'Ranking Drop Alert', type: 'ranking_drop', severity: 'high', active: true },
    { id: '2', name: 'New Backlink Alert', type: 'new_backlink', severity: 'medium', active: true },
    { id: '3', name: 'Core Web Vitals', type: 'cwv_degradation', severity: 'high', active: true },
    { id: '4', name: 'Crawl Error', type: 'crawl_error', severity: 'critical', active: false }
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Alert Configuration</h1>
        <button className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Alert
        </button>
      </div>

      <div className="space-y-4">
        {alerts.map(alert => (
          <div key={alert.id} className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${
                  alert.severity === 'critical' ? 'bg-red-500' :
                  alert.severity === 'high' ? 'bg-orange-500' :
                  alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <div>
                  <h3 className="font-semibold">{alert.name}</h3>
                  <p className="text-sm text-slate-400">{alert.type.replace(/_/g, ' ')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  alert.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-600 text-slate-400'
                }`}>
                  {alert.active ? 'Active' : 'Inactive'}
                </span>
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

function ChannelsTab() {
  const [channels, setChannels] = useState([
    { id: 'slack', name: 'SEO Alerts', platform: 'slack', channel: '#seo-alerts', active: true },
    { id: 'discord', name: 'Discord Alerts', platform: 'discord', channel: 'seo-alerts', active: true }
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notification Channels</h1>
        <button className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Channel
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {channels.map(ch => (
          <div key={ch.id} className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {ch.platform === 'slack' ? (
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Slack className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">{ch.name}</h3>
                  <p className="text-sm text-slate-400">{ch.channel}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                ch.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-600 text-slate-400'
              }`}>
                {ch.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-slate-700 text-sm rounded-lg hover:bg-slate-600">
                Test
              </button>
              <button className="flex-1 px-3 py-2 bg-slate-700 text-sm rounded-lg hover:bg-slate-600">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DigestsTab() {
  const [digests, setDigests] = useState([
    { id: '1', name: 'Daily Summary', frequency: 'daily', time: '09:00', active: true },
    { id: '2', name: 'Weekly Report', frequency: 'weekly', time: '09:00', active: true },
    { id: '3', name: 'Monthly Overview', frequency: 'monthly', time: '09:00', active: false }
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Scheduled Digests</h1>
        <button className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Digest
        </button>
      </div>

      <div className="space-y-4">
        {digests.map(digest => (
          <div key={digest.id} className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <h3 className="font-semibold">{digest.name}</h3>
                  <p className="text-sm text-slate-400 capitalize">{digest.frequency} at {digest.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  digest.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-600 text-slate-400'
                }`}>
                  {digest.active ? 'Active' : 'Inactive'}
                </span>
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

function SettingsTab() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Alert Settings</h1>
      
      <div className="bg-slate-800 rounded-xl p-6 mb-6">
        <h2 className="font-semibold mb-4">Quiet Hours</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-400 block mb-2">Start Time</label>
            <input type="time" defaultValue="22:00" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2" />
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-2">End Time</label>
            <input type="time" defaultValue="08:00" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2" />
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-3">Alerts will be silenced during quiet hours but will be sent immediately after.</p>
      </div>

      <div className="bg-slate-800 rounded-xl p-6">
        <h2 className="font-semibold mb-4">Severity Thresholds</h2>
        <div className="space-y-4">
          {['critical', 'high', 'medium', 'low'].map(severity => (
            <div key={severity} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  severity === 'critical' ? 'bg-red-500' :
                  severity === 'high' ? 'bg-orange-500' :
                  severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <span className="capitalize">{severity}</span>
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                <span className="text-sm text-slate-400">Notify</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
