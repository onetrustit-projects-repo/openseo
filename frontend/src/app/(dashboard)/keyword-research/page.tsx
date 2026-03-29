'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Search } from 'lucide-react';

export default function KeywordResearchPage() {
  const [query, setQuery] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchKeywords = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`http://172.16.160.37:3002/api/keywords/research?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success) setKeywords(data.data.keywords || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <>
      <Header title="Keyword Research" subtitle="Find valuable keywords with Google Suggest" />
      <div style={{ padding: 24 }}>
        <Card title="Keyword Research" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchKeywords()}
              placeholder="Enter a seed keyword..."
              style={{ flex: 1, padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14 }}
            />
            <button onClick={searchKeywords} disabled={loading} style={{ padding: '12px 24px', background: '#10b981', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </Card>

        {keywords.length > 0 && (
          <Card title={`Keywords for "${query}"`}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, color: '#64748b' }}>Keyword</th>
                  <th style={{ textAlign: 'right', padding: '12px 8px', fontSize: 12, color: '#64748b' }}>Volume</th>
                  <th style={{ textAlign: 'right', padding: '12px 8px', fontSize: 12, color: '#64748b' }}>Difficulty</th>
                  <th style={{ textAlign: 'right', padding: '12px 8px', fontSize: 12, color: '#64748b' }}>CPC</th>
                  <th style={{ textAlign: 'right', padding: '12px 8px', fontSize: 12, color: '#64748b' }}>Competition</th>
                </tr>
              </thead>
              <tbody>
                {keywords.map((kw: any, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 500 }}>{kw.keyword}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'right' }}>{kw.searchVolume?.toLocaleString()}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                      <span style={{ 
                        padding: '4px 8px', borderRadius: 4, 
                        background: kw.difficulty < 30 ? '#10b98120' : kw.difficulty < 70 ? '#f59e0b20' : '#ef444420',
                        color: kw.difficulty < 30 ? '#10b981' : kw.difficulty < 70 ? '#f59e0b' : '#ef4444'
                      }}>{kw.difficulty}</span>
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'right' }}>${kw.cpc}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'right' }}>{kw.competition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </>
  );
}
