'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function RankTrackingPage() {
  const [keyword, setKeyword] = useState('');
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const trackRank = async () => {
    if (!keyword || !domain) return;
    setLoading(true);
    try {
      const res = await fetch(`http://172.16.160.37:3002/api/ranks?keyword=${encodeURIComponent(keyword)}&domain=${encodeURIComponent(domain)}`);
      const result = await res.json();
      if (result.success) setData(result.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <>
      <Header title="Rank Tracking" subtitle="Track your search engine rankings" />
      <div style={{ padding: 24 }}>
        <Card title="Track Keyword Ranking" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Keyword"
              style={{ flex: 1, padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14 }}
            />
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Domain"
              style={{ flex: 1, padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14 }}
            />
            <button onClick={trackRank} disabled={loading} style={{ padding: '12px 24px', background: '#10b981', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>
              {loading ? 'Tracking...' : 'Track'}
            </button>
          </div>
        </Card>

        {data && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
              <Card>
                <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Current Rank</p>
                <p style={{ fontSize: 36, fontWeight: 700, color: '#0f172a', margin: '8px 0 0' }}>#{data.currentRank}</p>
              </Card>
              <Card>
                <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Change</p>
                <p style={{ fontSize: 36, fontWeight: 700, color: data.change > 0 ? '#10b981' : '#ef4444', margin: '8px 0 0' }}>
                  {data.change > 0 ? '+' : ''}{data.change}
                </p>
              </Card>
              <Card>
                <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Keyword</p>
                <p style={{ fontSize: 18, fontWeight: 600, color: '#0f172a', margin: '8px 0 0' }}>{data.keyword}</p>
              </Card>
            </div>

            <Card title="Ranking History (30 Days)">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" domain={['auto', 'auto']} reversed />
                  <Tooltip />
                  <Line type="monotone" dataKey="rank" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
