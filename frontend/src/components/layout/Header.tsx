'use client';

import { Bell, Search } from 'lucide-react';

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header style={{ height: 64, background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 10 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: '#0f172a', margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>{subtitle}</p>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button style={{ width: 40, height: 40, borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Bell size={18} color="#64748b" />
        </button>
      </div>
    </header>
  );
}
