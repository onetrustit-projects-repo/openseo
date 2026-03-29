'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { FileSearch } from 'lucide-react';

export default function SiteAuditsPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const runAudit = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/audits?url=${encodeURIComponent(url)}`);
      const result = await res.json();
      if (result.success) setData(result.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <>
      <Header title="Site Audits" subtitle="Run Lighthouse-style SEO audits" />
      <div style={{ padding: 24 }}>
        <Card title="Run Site Audit" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runAudit()}
              placeholder="Enter URL (e.g., https://example.com)"
              style={{ flex: 1, padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14 }}
            />
            <button onClick={runAudit} disabled={loading} style={{ padding: '12px 24px', background: '#10b981', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>
              {loading ? 'Auditing...' : 'Run Audit'}
            </button>
          </div>
        </Card>

        {data && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 24, marginBottom: 24 }}>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: 120, height: 120, borderRadius: '50%', margin: '0 auto 16px',
                    border: `8px solid ${getScoreColor(data.score)}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: 36, fontWeight: 700, color: getScoreColor(data.score) }}>{data.score}</span>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#0f172a', margin: 0 }}>SEO Score</p>
                </div>
              </Card>

              <Card title="Audit Metrics">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  <div>
                    <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Title Length</p>
                    <p style={{ fontSize: 20, fontWeight: 600, color: '#0f172a', margin: '4px 0 0' }}>{data.metrics?.titleLength || 0}</p>
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>characters</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>H1 Headings</p>
                    <p style={{ fontSize: 20, fontWeight: 600, color: '#0f172a', margin: '4px 0 0' }}>{data.metrics?.h1Count || 0}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Page Size</p>
                    <p style={{ fontSize: 20, fontWeight: 600, color: '#0f172a', margin: '4px 0 0' }}>{data.metrics?.pageSize || 0}</p>
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>KB</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card title="Issues Found">
              {data.issues && data.issues.length > 0 ? (
                <div>
                  {data.issues.map((issue: any, i: number) => (
                    <div key={i} style={{ 
                      padding: '12px 16px', marginBottom: 8, borderRadius: 8,
                      background: issue.type === 'error' ? '#ef444410' : '#f59e0b10',
                      borderLeft: `4px solid ${issue.type === 'error' ? '#ef4444' : '#f59e0b'}`
                    }}>
                      <p style={{ fontWeight: 500, color: '#0f172a', margin: 0 }}>{issue.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#10b981', fontWeight: 500 }}>No issues found! Great job.</p>
              )}
            </Card>
          </>
        )}
      </div>
    </>
  );
}
