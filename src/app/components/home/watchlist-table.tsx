import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Eye, ChevronRight, ChevronDown, Settings2, Sparkles,
  TrendingUp, TrendingDown,
} from 'lucide-react';
import { Sparkline } from '../scorecard/Sparkline';
import { cn } from '../ui/utils';
import type { ProductArea, Metric } from '@/types';

export type WatchlistVariant = 'A' | 'B';

interface WatchlistTableProps {
  areas: ProductArea[];
  selectedAreaIds: string[];
  maxRows?: number;
  variant?: WatchlistVariant;
  onViewFull?: () => void;
  onMetricClick?: (metric: Metric) => void;
}

function ChangeLabel({ value, label }: { value: number; label: string }) {
  const isUp = value > 0;
  const isDown = value < 0;
  return (
    <span className={cn(
      'inline-flex items-center gap-0.5 font-medium',
      isUp ? 'text-emerald-600 dark:text-emerald-400' : isDown ? 'text-red-500 dark:text-red-400' : 'text-muted-foreground'
    )}>
      {isUp ? <TrendingUp className="w-3 h-3" /> : isDown ? <TrendingDown className="w-3 h-3" /> : null}
      {label}
    </span>
  );
}

function PlanValue({ vsPlan, vsPlanValue }: { vsPlan?: string; vsPlanValue?: number }) {
  if (!vsPlan) {
    return (
      <span className="text-muted-foreground/40 cursor-default" title="Plan data coming soon">
        --
      </span>
    );
  }
  return (
    <span className={cn(
      'font-medium',
      vsPlanValue && vsPlanValue > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
    )}>
      {vsPlan}
    </span>
  );
}

function ComingSoonBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/10 dark:bg-violet-400/10 border border-violet-500/20 dark:border-violet-400/20">
      <Sparkles className="w-2.5 h-2.5 text-violet-600 dark:text-violet-400" />
      <span className="text-[10px] font-medium text-violet-600 dark:text-violet-400">Coming Soon</span>
    </span>
  );
}

function sparkColor(change: number) {
  return change >= 0 ? '#10b981' : '#ef4444';
}

// Slim table with scrollable body
function AreaTableSlim({ area, defaultExpanded, maxRows, onMetricClick }: {
  area: ProductArea; defaultExpanded: boolean; maxRows?: number; onMetricClick?: (metric: Metric) => void;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const rowHeight = 33;
  const maxHeight = maxRows ? maxRows * rowHeight : undefined;

  return (
    <div className="rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-muted/30 transition-colors"
      >
        {expanded
          ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
        <span className="text-xs font-semibold text-foreground">{area.name}</span>
        {!expanded && (
          <span className="text-[11px] text-muted-foreground ml-auto">{area.metrics.length} metrics</span>
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="overflow-y-auto"
              style={maxHeight ? { maxHeight: maxHeight + 28 } : undefined}
            >
              <table className="w-full text-xs table-fixed">
                <colgroup>
                  <col style={{ width: '22%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '16%' }} />
                  <col style={{ width: '16%' }} />
                </colgroup>
                <thead className="sticky top-0 z-10">
                  <tr className="bg-white dark:bg-slate-900 border-y border-border/20">
                    <th className="text-left py-1.5 px-3 font-medium text-muted-foreground">Metric</th>
                    <th className="text-left py-1.5 px-3 font-medium text-muted-foreground">Current Week</th>
                    <th className="text-left py-1.5 px-3 font-medium text-muted-foreground">Prior Week</th>
                    <th className="text-left py-1.5 px-3 font-medium text-muted-foreground">vs Prior Week</th>
                    <th className="text-left py-1.5 px-3 font-medium text-muted-foreground">Trend</th>
                    <th className="text-left py-1.5 px-3 font-medium text-muted-foreground">vs Plan</th>
                    <th className="text-left py-1.5 px-3 font-medium text-muted-foreground">AI Insight</th>
                  </tr>
                </thead>
                <tbody>
                  {area.metrics.map((metric, idx) => (
                    <tr
                      key={metric.id}
                      onClick={() => onMetricClick?.(metric)}
                      className={cn(
                        'border-b border-border/10 hover:bg-muted/20 transition-colors cursor-pointer',
                        idx % 2 === 1 && 'bg-muted/10 dark:bg-white/[0.02]'
                      )}
                    >
                      <td className="py-2 px-3 font-medium text-foreground truncate">{metric.name}</td>
                      <td className="py-2 px-3 text-left font-semibold text-foreground">{metric.current}</td>
                      <td className="py-2 px-3 text-left text-muted-foreground">{metric.prior}</td>
                      <td className="py-2 px-3 text-left">
                        <ChangeLabel value={metric.change} label={metric.changeLabel} />
                      </td>
                      <td className="py-2 px-3 text-left">
                        <Sparkline data={metric.trend} color={sparkColor(metric.change)} />
                      </td>
                      <td className="py-2 px-3 text-left">
                        <ComingSoonBadge />
                      </td>
                      <td className="py-2 px-3">
                        <ComingSoonBadge />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Option B: Clean metric strips
function AreaStrips({ area, defaultExpanded, maxRows, onMetricClick }: {
  area: ProductArea; defaultExpanded: boolean; maxRows?: number; onMetricClick?: (metric: Metric) => void;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const visibleMetrics = maxRows ? area.metrics.slice(0, maxRows) : area.metrics;
  const hasMore = maxRows ? area.metrics.length > maxRows : false;

  return (
    <div className="rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted/30 transition-colors"
      >
        {expanded
          ? <ChevronDown className="w-4 h-4 text-muted-foreground" />
          : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        <span className="text-sm font-semibold text-foreground">{area.name}</span>
        {!expanded && (
          <span className="text-[11px] text-muted-foreground ml-auto">{area.metrics.length} metrics</span>
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-3 pb-2"
          >
            <div className="space-y-0.5">
              {visibleMetrics.map((metric) => (
                <button
                  key={metric.id}
                  onClick={() => onMetricClick?.(metric)}
                  className={cn(
                    'w-full flex items-center px-3 py-2 rounded-lg',
                    'hover:bg-muted/30 dark:hover:bg-white/[0.04] transition-colors',
                    'group text-left'
                  )}
                >
                  <span className="text-xs text-muted-foreground w-[22%] truncate">{metric.name}</span>
                  <span className="text-xs font-bold text-foreground w-[12%] text-right">{metric.current}</span>
                  <span className="text-xs text-muted-foreground w-[12%] text-right">{metric.prior}</span>
                  <span className="w-[12%] text-right"><ChangeLabel value={metric.change} label={metric.changeLabel} /></span>
                  <span className="w-[10%] flex justify-center">
                    <Sparkline data={metric.trend} color={sparkColor(metric.change)} />
                  </span>
                  <span className="w-[16%] flex justify-center">
                    <ComingSoonBadge />
                  </span>
                  <span className="w-[16%] flex justify-center">
                    <ComingSoonBadge />
                  </span>
                </button>
              ))}
            </div>
            {hasMore && (
              <div className="px-3 pt-1 text-center">
                <span className="text-[11px] text-muted-foreground">+{area.metrics.length - maxRows!} more</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function WatchlistTable({ areas, selectedAreaIds, maxRows = 5, variant = 'A', onViewFull, onMetricClick }: WatchlistTableProps) {
  const selectedAreas = areas.filter((a) => selectedAreaIds.includes(a.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="glass-panel rounded-2xl px-5 py-3 border border-border/60 dark:border-white/10"
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          <h3 className="text-lg font-semibold text-foreground">Your Watchlist</h3>
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

      <div className="space-y-1">
        {selectedAreas.map((area, idx) => (
          variant === 'A'
            ? <AreaTableSlim key={area.id} area={area} defaultExpanded={idx === 0} maxRows={maxRows} onMetricClick={onMetricClick} />
            : <AreaStrips key={area.id} area={area} defaultExpanded={idx === 0} maxRows={maxRows} onMetricClick={onMetricClick} />
        ))}
      </div>
    </motion.div>
  );
}
