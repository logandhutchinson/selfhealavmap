import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { ROLE_LABELS } from '@/data/mockData';
import {
  LayoutDashboard, List, FileText, Truck, ShieldAlert,
  Settings, BarChart3, LogOut, Menu, X, Search, MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zones } from '@/data/mockData';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Mismatch Feed', path: '/feed', icon: List },
  { label: 'Patch Detail', path: '/patch/SHM-19-0042', icon: FileText },
  { label: 'Distribution', path: '/distribution', icon: Truck },
  { label: 'Kill Switch', path: '/kill-switch', icon: ShieldAlert },
  { label: 'Thresholds', path: '/thresholds', icon: Settings },
  { label: 'Observability', path: '/observability', icon: BarChart3 },
];

export function AppLayout() {
  const { role, logout, shmEnabled, selectedZone, setSelectedZone } = useApp();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Kill switch banner */}
      {!shmEnabled && (
        <div className="fixed top-0 left-0 right-0 z-50 kill-switch-banner animate-pulse-glow">
          ⚠ SHM GLOBALLY DISABLED — All patches reverted to canonical map
        </div>
      )}

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-0 -ml-1'} transition-all duration-200 bg-sidebar border-r border-sidebar-border flex-shrink-0 flex flex-col overflow-hidden ${!shmEnabled ? 'mt-10' : ''}`}>
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-sidebar-accent-foreground truncate">Atlas SHM</h1>
              <p className="text-[10px] text-sidebar-foreground truncate">Self-Healing Map Console</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const active = location.pathname.startsWith(item.path.split('/').slice(0, 2).join('/')) ||
              (item.path === '/dashboard' && location.pathname === '/dashboard');
            const isExact = location.pathname === item.path || location.pathname.startsWith(item.path);
            return (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${isExact ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'}`}>
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-foreground mb-1 truncate">{role ? ROLE_LABELS[role] : ''}</div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground hover:text-destructive" onClick={logout}>
            <LogOut className="h-3 w-3 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className={`flex-1 flex flex-col overflow-hidden ${!shmEnabled ? 'mt-10' : ''}`}>
        {/* Top bar */}
        <header className="h-12 border-b border-border bg-card flex items-center px-4 gap-3 flex-shrink-0">
          <Button variant="ghost" size="sm" className="p-1" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
          <Select value={selectedZone?.toString() ?? 'all'} onValueChange={v => setSelectedZone(v === 'all' ? null : Number(v))}>
            <SelectTrigger className="w-48 h-8 text-xs">
              <SelectValue placeholder="All Zones" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Zones</SelectItem>
              {zones.map(z => <SelectItem key={z.id} value={z.id.toString()}>{z.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search patches, clusters…" className="h-8 text-xs pl-8" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            {!shmEnabled && <span className="text-xs font-mono text-destructive animate-pulse-glow">SHM OFF</span>}
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
              {role?.[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
