import { LayoutDashboard, Clock, Users, Star } from 'lucide-react';
import { cn } from '../ui/utils';

interface DashboardItem {
  id: string;
  title: string;
  type: string;
  icon?: string;
}

interface DashboardLibraryPanelProps {
  activeTab: string;
  onDashboardClick?: (dashboard: DashboardItem) => void;
}

const recentDashboards: DashboardItem[] = [
  { id: '1', title: 'Q1 Operations Dashboard', type: 'Draft' },
  { id: '2', title: 'Revenue Analytics', type: 'Published' },
  { id: '3', title: 'Customer Insights', type: 'Published' },
];

const templateDashboards: DashboardItem[] = [
  { id: 't1', title: 'Executive Summary', type: 'Template' },
  { id: 't2', title: 'Sales Performance', type: 'Template' },
  { id: 't3', title: 'Operations Overview', type: 'Template' },
];

const sharedDashboards: DashboardItem[] = [
  { id: 's1', title: 'Team Performance Dashboard', type: 'Shared by Ops Team' },
  { id: 's2', title: 'Marketing Metrics', type: 'Shared by Marketing' },
];

export function DashboardLibraryPanel({
  activeTab,
  onDashboardClick,
}: DashboardLibraryPanelProps) {
  const getDashboards = () => {
    switch (activeTab) {
      case 'recent':
        return recentDashboards;
      case 'templates':
        return templateDashboards;
      case 'shared':
        return sharedDashboards;
      default:
        return recentDashboards;
    }
  };

  const dashboards = getDashboards();

  return (
    <div className="space-y-2">
      {dashboards.map((dashboard) => (
        <button
          key={dashboard.id}
          onClick={() => onDashboardClick?.(dashboard)}
          className={cn(
            'w-full p-3 rounded-lg',
            'flex items-start gap-3',
            'bg-background/40 border border-border/40',
            'hover:bg-accent/60 hover:border-border/60',
            'transition-all duration-200',
            'group text-left'
          )}
        >
          <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center flex-shrink-0">
            <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {dashboard.title}
            </p>
            <p className="text-xs text-muted-foreground truncate">{dashboard.type}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
