'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Link2, FileSearch, TrendingUp, LayoutDashboard } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/keyword-research', label: 'Keywords', icon: Search },
  { href: '/backlinks', label: 'Backlinks', icon: Link2 },
  { href: '/site-audits', label: 'Site Audits', icon: FileSearch },
  { href: '/rank-tracking', label: 'Rankings', icon: TrendingUp },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{ width: 240, height: '100vh', background: '#1e293b', position: 'fixed', left: 0, top: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #10b981, #06b6d4)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Search size={20} color="white" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc' }}>OpenSEO</span>
        </div>
        <p style={{ fontSize: 11, color: '#64748b', margin: '8px 0 0' }}>Self-hosted SEO platform</p>
      </div>
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', marginBottom: 4, borderRadius: 6, textDecoration: 'none',
              color: isActive ? '#10b981' : '#94a3b8', background: isActive ? '#10b98115' : 'transparent', fontWeight: isActive ? 500 : 400, fontSize: 14
            }}>
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div style={{ padding: '16px', borderTop: '1px solid #334155' }}>
        <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>100% Self-hosted</p>
        <p style={{ fontSize: 11, color: '#10b981', margin: '4px 0 0' }}>No third-party APIs</p>
      </div>
    </aside>
  );
}
