import { BarChart3, TrendingUp, Users, DollarSign, ShoppingCart } from 'lucide-react';
import { cn } from '../ui/utils';
import type { LucideIcon } from 'lucide-react';

interface Metric {
  id: string;
  name: string;
  category: string;
  icon: LucideIcon;
  description?: string;
}

interface MetricsLibraryPanelProps {
  onMetricAdd?: (metric: Metric) => void;
}

const metrics: Metric[] = [
  {
    id: 'm1',
    name: 'Total Revenue',
    category: 'Financial',
    icon: DollarSign,
    description: 'Total revenue across all channels',
  },
  {
    id: 'm2',
    name: 'Active Users',
    category: 'Engagement',
    icon: Users,
    description: 'Monthly active users',
  },
  {
    id: 'm3',
    name: 'Conversion Rate',
    category: 'Sales',
    icon: TrendingUp,
    description: 'Overall conversion rate',
  },
  {
    id: 'm4',
    name: 'Order Volume',
    category: 'Operations',
    icon: ShoppingCart,
    description: 'Total number of orders',
  },
  {
    id: 'm5',
    name: 'Customer Satisfaction',
    category: 'Quality',
    icon: BarChart3,
    description: 'Average CSAT score',
  },
];

export function MetricsLibraryPanel({ onMetricAdd }: MetricsLibraryPanelProps) {
  return (
    <div className="space-y-2">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <button
            key={metric.id}
            onClick={() => onMetricAdd?.(metric)}
            className={cn(
              'w-full p-3 rounded-lg',
              'flex items-start gap-3',
              'bg-background/40 border border-border/40',
              'hover:bg-accent/60 hover:border-border/60',
              'transition-all duration-200',
              'group text-left'
            )}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-dd-primary/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-dd-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {metric.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {metric.category}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
