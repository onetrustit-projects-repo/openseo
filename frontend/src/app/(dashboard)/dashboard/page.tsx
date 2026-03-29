'use client';

import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Search, Link2, FileSearch, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { label: 'Keywords Tracked', value: '1,247', change: '+23', icon: Search, color: '#6366f1' },
    { label: 'Backlinks', value: '8,392', change: '+156', icon: Link2, color: '#10b981' },
    { label: 'Audit Score', value: '87', change: '+5', icon: FileSearch, color: '#f59e0b' },
    { label: 'Avg Rank', value: '12.4', change: '-2.1', icon: TrendingUp, color: '#ec4899' },
  ];

  return (
    <>
      <Header title="Dashboard" subtitle="Your SEO overview at a glance" />
      <div style={{ padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 24 }}>
          {stats.map(stat => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>{stat.label}</p>
                    <p style={{ fontSize: 28, fontWeight: 600, color: '#0f172a', margin: '4px 0 0' }}>{stat.value}</p>
                    <p style={{ fontSize: 12, color: stat.change.startsWith('+') ? '#10b981' : '#ef4444', margin: '4px 0 0' }}>{stat.change} this week</p>
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={22} color={stat.color} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
          <Card title="Recent Activity">
            <div style={{ color: '#64748b', fontSize: 14 }}>
              <p style={{ marginBottom: 8 }}>• New keyword ranked in top 10: "self hosted seo tools"</p>
              <p style={{ marginBottom: 8 }}>• Backlink acquired from github.com</p>
              <p style={{ marginBottom: 8 }}>• Site audit completed - Score: 87/100</p>
              <p>• Ranking improved for: "best seo software"</p>
            </div>
          </Card>
          <Card title="Quick Actions">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button style={{ padding: '12px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>Run Site Audit</button>
              <button style={{ padding: '12px 16px', background: '#fff', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer' }}>Add Keywords</button>
              <button style={{ padding: '12px 16px', background: '#fff', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer' }}>Check Backlinks</button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
