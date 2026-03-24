import { motion } from 'motion/react';
import { Eye, ChevronRight, Settings2 } from 'lucide-react';
import { cn } from '../ui/utils';
import type { ProductAreaWatchlist, WatchlistMetric } from '@/app/data/mock/watchlist-data';

interface WatchlistTeaserProps {
  areas: ProductAreaWatchlist[];
  selectedAreaIds: string[];
  onViewFull?: () => void;
}

const trendColor = {
  up: { change: 'text-emerald-600 dark:text-emerald-400', spark: '#10b981', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  down: { change: 'text-red-500 dark:text-red-400', spark: '#ef4444', bg: 'bg-red-50 dark:bg-red-500/10' },
  flat: { change: 'text-muted-foreground', spark: '#9ca3af', bg: 'bg-muted/40' },
};

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 72;
  const h = 28;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(' ');
  const fillPoints = `0,${h} ${points} ${w},${h}`;

  return (
    <svg width={w} height={h} className="flex-shrink-0">
      <defs>
        <linearGradient id={`fill-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={fillPoints} fill={`url(#fill-${color.replace('#', '')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MetricTile({ metric }: { metric: WatchlistMetric }) {
  const { change: changeColor, spark: sparkColor, bg } = trendColor[metric.trend];
  return (
    <div className={cn(
      'rounded-xl px-3 py-2 flex flex-col gap-1',
      'bg-background/40 border border-border/30',
      'dark:bg-white/[0.03] dark:border-white/[0.06]',
      'hover:border-border/50 dark:hover:border-white/10 transition-all'
    )}>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide truncate">{metric.name}</p>
      <div className="flex items-end justify-between gap-1">
        <div>
          <p className="text-base font-bold text-foreground leading-tight">{metric.value}</p>
          <span className={cn('text-[11px] font-semibold inline-block px-1.5 py-0.5 rounded-md', changeColor, bg)}>
            {metric.change}
          </span>
        </div>
        <MiniSparkline data={metric.sparkline} color={sparkColor} />
      </div>
    </div>
  );
}

function AreaSection({ area }: { area: ProductAreaWatchlist }) {
  const topMetrics = area.metrics.slice(0, 2);
  return (
    <div className="min-w-0 px-4 first:pl-0 last:pr-0">
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">{area.shortName}</p>
      <div className="grid grid-cols-2 gap-2">
        {topMetrics.map((metric) => (
          <MetricTile key={metric.id} metric={metric} />
        ))}
      </div>
    </div>
  );
}

export function WatchlistTeaser({ areas, selectedAreaIds, onViewFull }: WatchlistTeaserProps) {
  const selectedAreas = areas.filter((a) => selectedAreaIds.includes(a.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="glass-panel rounded-2xl px-5 py-4 border border-border/60 dark:border-white/10"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          <h3 className="text-sm font-semibold text-foreground">Your Watchlist</h3>
          <button className="p-1 rounded-md hover:bg-muted/60 transition-colors" title="Customize watchlist">
            <Settings2 className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
        <button
          onClick={onViewFull}
          className="flex items-center gap-1 text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors group"
        >
          View full scorecard
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className={cn(
        'grid divide-x divide-border/40 dark:divide-white/10',
        selectedAreas.length === 1 && 'grid-cols-1',
        selectedAreas.length === 2 && 'grid-cols-2',
        selectedAreas.length === 3 && 'grid-cols-3',
        selectedAreas.length >= 4 && 'grid-cols-4',
      )}>
        {selectedAreas.map((area) => (
          <AreaSection key={area.id} area={area} />
        ))}
      </div>
    </motion.div>
  );
}
