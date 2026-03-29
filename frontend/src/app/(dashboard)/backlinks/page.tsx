'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Link2 } from 'lucide-react';

export default function BacklinksPage() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const analyzeBacklinks = async () => {
    if (!domain) return;
    setLoading(true);
    try {
      const res = await fetch(`http://172.16.160.37:3002/api/backlinks?domain=${encodeURIComponent(domain)}`);
      const result = await res.json();
      if (result.success) setData(result.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <>
      <Header title="Backlink Analysis" subtitle="Analyze backlinks and referring domains" />
      <div style={{ padding: 24 }}>
        <Card title="Analyze Domain" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && analyzeBacklinks()}
              placeholder="Enter domain (e.g., example.com)"
              style={{ flex: 1, padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14 }}
            />
            <button onClick={analyzeBacklinks} disabled={loading} style={{ padding: '12px 24px', background: '#10b981', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </Card>

        {data && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 24 }}>
              <Card>
                <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Domain Authority</p>
                <p style={{ fontSize: 28, fontWeight: 600, color: '#0f172a', margin: '8px 0 0' }}>{data.domainAuthority}</p>
              </Card>
              <Card>
                <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Page Authority</p>
                <p style={{ fontSize: 28, fontWeight: 600, color: '#0f172a', margin: '8px 0 0' }}>{data.pageAuthority}</p>
              </Card>
              <Card>
                <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Total Backlinks</p>
                <p style={{ fontSize: 28, fontWeight: 600, color: '#0f172a', margin: '8px 0 0' }}>{data.totalBacklinks}</p>
              </Card>
              <Card>
                <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Referring Domains</p>
                <p style={{ fontSize: 28, fontWeight: 600, color: '#0f172a', margin: '8px 0 0' }}>{data.referringDomains}</p>
              </Card>
            </div>

            <Card title="Backlink Details">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, color: '#64748b' }}>Source</th>
                    <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, color: '#64748b' }}>Anchor</th>
                    <th style={{ textAlign: 'center', padding: '12px 8px', fontSize: 12, color: '#64748b' }}>Type</th>
                    <th style={{ textAlign: 'center', padding: '12px 8px', fontSize: 12, color: '#64748b' }}>Authority</th>
                  </tr>
                </thead>
                <tbody>
                  {data.backlinks.slice(0, 10).map((bl: any, i: number) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 8px', fontSize: 13 }}>{bl.source}</td>
                      <td style={{ padding: '12px 8px', fontSize: 13, color: '#64748b' }}>{bl.anchor}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        <span style={{ 
                          padding: '4px 8px', borderRadius: 4, fontSize: 12,
                          background: bl.type === 'dofollow' ? '#10b98120' : '#64748b20',
                          color: bl.type === 'dofollow' ? '#10b981' : '#64748b'
                        }}>{bl.type}</span>
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 500 }}>{bl.authority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
