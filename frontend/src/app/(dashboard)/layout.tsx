'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Link2, FileSearch, TrendingUp, LayoutDashboard, Menu, X } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/keyword-research', label: 'Keywords', icon: Search },
  { href: '/backlinks', label: 'Backlinks', icon: Link2 },
  { href: '/site-audits', label: 'Site Audits', icon: FileSearch },
  { href: '/rank-tracking', label: 'Rankings', icon: TrendingUp },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Search size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold text-white">OpenSEO</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-900/95 pt-16">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                    isActive 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 bg-slate-800 flex-col">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Search size={20} className="text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">OpenSEO</span>
              <p className="text-xs text-slate-400">Self-hosted SEO platform</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <p className="text-xs text-slate-500">100% Self-hosted</p>
          <p className="text-xs text-emerald-500 mt-1">No third-party APIs</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-60 pt-16 md:pt-0 p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}
