import { useState } from 'react'
import { Users, Shield, Activity, Settings, Plus, Trash2, Edit } from 'lucide-react'

const API_BASE = '/api'

const tabs = [
  { id: 'team', label: 'Team', icon: Users },
  { id: 'roles', label: 'Roles & Permissions', icon: Shield },
  { id: 'activity', label: 'Activity Log', icon: Activity },
  { id: 'settings', label: 'Settings', icon: Settings }
]

function App() {
  const [activeTab, setActiveTab] = useState('team')

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold">OpenSEO</span>
              <p className="text-xs text-slate-400">Team Collaboration</p>
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
                    ? 'bg-violet-500/20 text-violet-400' 
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
          {activeTab === 'team' && <TeamTab />}
          {activeTab === 'roles' && <RolesTab />}
          {activeTab === 'activity' && <ActivityTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </main>
      </div>
    </div>
  )
}

function TeamTab() {
  const [members] = useState([
    { id: '1', name: 'Admin User', email: 'admin@openseo.dev', role: 'admin', status: 'active' },
    { id: '2', name: 'Sarah Chen', email: 'sarah@example.com', role: 'editor', status: 'active' },
    { id: '3', name: 'John Smith', email: 'john@example.com', role: 'viewer', status: 'active' },
    { id: '4', name: 'Emily Davis', email: 'emily@example.com', role: 'editor', status: 'pending' }
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <button className="px-4 py-2 bg-violet-500 text-white font-medium rounded-lg hover:bg-violet-600 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      <div className="bg-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Member</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Role</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Status</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {members.map(member => (
              <tr key={member.id} className="hover:bg-slate-750">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-500/20 rounded-full flex items-center justify-center text-violet-400 font-medium">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-slate-400">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    member.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                    member.role === 'editor' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    member.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-slate-700 rounded-lg">
                    <Edit className="w-4 h-4 text-slate-400" />
                  </button>
                  <button className="p-2 hover:bg-slate-700 rounded-lg">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function RolesTab() {
  const [roles] = useState([
    { 
      id: 'admin', 
      name: 'Admin', 
      description: 'Full access to all features',
      userCount: 1,
      permissions: ['All permissions']
    },
    { 
      id: 'editor', 
      name: 'Editor', 
      description: 'Can create and edit reports',
      userCount: 2,
      permissions: ['View reports', 'Create reports', 'Edit reports', 'Manage alerts']
    },
    { 
      id: 'viewer', 
      name: 'Viewer', 
      description: 'Read-only access',
      userCount: 1,
      permissions: ['View reports', 'View alerts']
    }
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Roles & Permissions</h1>
        <button className="px-4 py-2 bg-violet-500 text-white font-medium rounded-lg hover:bg-violet-600 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Role
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {roles.map(role => (
          <div key={role.id} className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-violet-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-violet-400" />
              </div>
              <span className="text-sm text-slate-500">{role.userCount} users</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">{role.name}</h3>
            <p className="text-sm text-slate-400 mb-4">{role.description}</p>
            <div className="space-y-1">
              {role.permissions.map((perm, i) => (
                <div key={i} className="text-xs text-slate-500 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full"></div>
                  {perm}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ActivityTab() {
  const [activities] = useState([
    { id: '1', user: 'Admin User', action: 'Created report', resource: 'March SEO Summary', time: '2 hours ago' },
    { id: '2', user: 'Sarah Chen', action: 'Updated alert', resource: 'Ranking Drop Alert', time: '4 hours ago' },
    { id: '3', user: 'John Smith', action: 'Viewed audit', resource: 'example.com audit', time: '6 hours ago' },
    { id: '4', user: 'Emily Davis', action: 'Invited user', resource: 'john@example.com', time: '1 day ago' },
    { id: '5', user: 'Admin User', action: 'Generated sitemap', resource: 'example.com', time: '2 days ago' }
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Activity Log</h1>
        <button className="px-4 py-2 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-600">
          Export
        </button>
      </div>

      <div className="bg-slate-800 rounded-xl p-6">
        <div className="space-y-4">
          {activities.map(activity => (
            <div key={activity.id} className="flex items-start gap-4 py-3 border-b border-slate-700 last:border-0">
              <div className="w-10 h-10 bg-violet-500/20 rounded-full flex items-center justify-center text-violet-400 font-medium flex-shrink-0">
                {activity.user.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-slate-300">
                  <span className="font-medium text-white">{activity.user}</span>
                  {' '}{activity.action.toLowerCase()}
                  {' '}<span className="text-violet-400">{activity.resource}</span>
                </p>
                <p className="text-sm text-slate-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SettingsTab() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Workspace Settings</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="font-semibold mb-4">SSO Configuration</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-slate-900">G</span>
                </div>
                <span>Google SSO</span>
              </div>
              <button className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded">Connected</button>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center">
                  <span className="text-white font-bold">GH</span>
                </div>
                <span>GitHub SSO</span>
              </div>
              <button className="px-3 py-1 bg-slate-600 text-sm rounded">Connect</button>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="font-semibold mb-4">Notification Settings</h2>
          <div className="space-y-3">
            {['Email notifications', 'Slack notifications', 'Weekly digest'].map(setting => (
              <div key={setting} className="flex items-center justify-between">
                <span>{setting}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
