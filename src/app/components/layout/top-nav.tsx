import { Link, useLocation } from 'react-router';
import { Bell, User, Moon, Sun } from 'lucide-react';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useTheme } from '@/app/context/theme-context';

const tabs = [
  { name: 'Home', path: '/' },
  { name: 'Dashboards', path: '/dashboards' },
  { name: 'SQL Studio', path: '/sql-studio' },
  { name: 'Notebooks', path: '/notebooks' },
  { name: 'AI Workflows', path: '/ai-workflows' },
];

export function TopNav() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="h-14 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-950/70 backdrop-blur-md flex items-center px-6 gap-6 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-violet-500 to-cyan-400 shadow-lg shadow-violet-500/20 dark:shadow-violet-500/30">
          <span className="text-white font-bold text-lg">D</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-slate-950 dark:text-white">DoorDash</span>
          <span className="text-slate-400 dark:text-slate-500">|</span>
          <span className="text-lg text-slate-600 dark:text-slate-300">Data Portal</span>
        </div>
      </div>

      <div className="flex items-center gap-1 flex-1">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`px-3.5 py-1.5 rounded-lg transition-all duration-200 text-sm font-medium ${
              isActive(tab.path)
                ? 'bg-slate-900 dark:bg-white/10 text-white dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06]'
            }`}
          >
            {tab.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all duration-200"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          ) : (
            <Sun className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          )}
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors duration-150">
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <Badge
                variant="destructive"
                className="absolute top-1 right-1 w-4 h-4 p-0 flex items-center justify-center text-xs"
              >
                2
              </Badge>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <span className="text-sm">Asset pending verification</span>
                <span className="text-xs text-muted-foreground">delivery_latency_by_zone.sql</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <span className="text-sm">Dashboard shared with you</span>
                <span className="text-xs text-muted-foreground">Operations Dashboard by Ops Team</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-white/10 flex items-center justify-center cursor-pointer hover:bg-slate-300 dark:hover:bg-white/[0.15] transition-colors duration-150">
          <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
        </div>
      </div>
    </nav>
  );
}
