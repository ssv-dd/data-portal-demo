import { Link, useLocation } from 'react-router';
import { Bell, User } from 'lucide-react';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const tabs = [
  { name: 'Home', path: '/' },
  { name: 'Dashboards', path: '/dashboards' },
  { name: 'SQL Studio', path: '/sql-studio' },
  { name: 'Notebooks', path: '/notebooks' },
  { name: 'AI Workflows', path: '/ai-workflows' },
];

export function TopNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="h-14 border-b border-border/60 bg-white/80 backdrop-blur-md flex items-center px-6 gap-6 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-dd-primary">
          <span className="text-white font-bold text-lg">D</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-foreground">DoorDash</span>
          <span className="text-muted-foreground/40">|</span>
          <span className="text-lg text-muted-foreground">Data Portal</span>
        </div>
      </div>

      <div className="flex items-center gap-1 flex-1">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`px-3.5 py-1.5 rounded-lg transition-all duration-200 text-sm font-medium ${
              isActive(tab.path)
                ? 'bg-foreground text-background shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
            }`}
          >
            {tab.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 rounded-lg hover:bg-accent/60 transition-colors duration-150">
              <Bell className="w-5 h-5 text-muted-foreground" />
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
        <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center cursor-pointer hover:bg-accent transition-colors duration-150">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </nav>
  );
}
