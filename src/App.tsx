import React, { useState, useEffect } from 'react';
import {
  Menu,
  LayoutDashboard,
  FolderTree,
  FileText,
  ImageIcon,
  ClipboardList,
  Bell,
  Award,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { cn } from './lib/utils';

type SidebarItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accent: string;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (_token: string) => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, accent: 'text-sky-400' },
    { id: 'categories', label: 'Categories', icon: FolderTree, accent: 'text-emerald-400' },
    { id: 'blogs', label: 'Blogs', icon: FileText, accent: 'text-violet-400' },
    { id: 'hero', label: 'Hero Section', icon: ImageIcon, accent: 'text-amber-400' },
    { id: 'banner', label: 'Quiz', icon: ClipboardList, accent: 'text-orange-400' },
    { id: 'updates', label: 'Latest Updates', icon: Bell, accent: 'text-cyan-400' },
    { id: 'sponser', label: 'Sponsor', icon: Award, accent: 'text-rose-400' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f4f8]">
      {/* Sidebar */}
      <aside
        className={cn(
          'relative flex flex-col shrink-0 transition-all duration-300 ease-in-out',
          'bg-gradient-to-b from-[#0c1222] via-[#111827] to-[#0f2847]',
          'border-r border-white/5 shadow-2xl shadow-blue-950/40',
          isSidebarOpen ? 'w-64' : 'w-[72px]'
        )}
      >
        {/* Subtle mesh glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 20% -10%, rgba(56, 189, 248, 0.25), transparent), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(16, 185, 129, 0.15), transparent)',
          }}
        />

        {/* Header */}
        <div className="relative flex items-center justify-between gap-2 border-b border-white/10 px-4 py-5">
          {isSidebarOpen ? (
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Notes Market
              </p>
              <h2 className="text-lg font-bold bg-gradient-to-r from-sky-300 via-white to-emerald-300 bg-clip-text text-transparent">
                Admin Panel
              </h2>
            </div>
          ) : (
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 text-xs font-bold text-white shadow-lg shadow-sky-500/30">
              NM
            </div>
          )}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="relative flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <p
            className={cn(
              'mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500',
              !isSidebarOpen && 'sr-only'
            )}
          >
            Menu
          </p>
          {sidebarItems.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                title={!isSidebarOpen ? item.label : undefined}
                className={cn(
                  'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-sky-500/20 via-blue-500/15 to-emerald-500/20 text-white shadow-inner ring-1 ring-white/10'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                )}
              >
                <span
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors',
                    isActive
                      ? 'bg-white/10 shadow-sm'
                      : 'bg-white/5 group-hover:bg-white/10'
                  )}
                >
                  <Icon
                    size={18}
                    className={cn(isActive ? item.accent : 'text-slate-400 group-hover:text-slate-300')}
                  />
                </span>
                {isSidebarOpen && (
                  <span className={cn('truncate text-sm font-medium', isActive && 'text-white')}>
                    {item.label}
                  </span>
                )}
                {isActive && isSidebarOpen && (
                  <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="relative border-t border-white/10 p-3">
          <button
            type="button"
            onClick={handleLogout}
            title={!isSidebarOpen ? 'Logout' : undefined}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
              'text-rose-300/90 hover:bg-rose-500/10 hover:text-rose-300'
            )}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/10">
              <LogOut size={18} />
            </span>
            {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile / top bar when needed */}
        <header className="flex items-center gap-3 border-b border-slate-200/80 bg-white/70 px-4 py-3 backdrop-blur-md lg:hidden">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            <Menu size={22} />
          </button>
          <span className="font-semibold text-slate-800">Admin Panel</span>
        </header>

        <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/40">
          <Dashboard activeSection={activeSection} />
        </main>
      </div>
    </div>
  );
}

export default App;
