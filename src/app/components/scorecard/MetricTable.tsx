import { Card } from '../ui/card';
import { Button } from '../ui/button';
import {
  ChevronDown,
  ChevronRight,
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Info,
  Settings,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkline } from './Sparkline';
import type { Metric, ProductArea } from '@/types';

interface MetricTableProps {
  area: ProductArea;
  columnHeaders: { current: string; vsPrior: string };
  expanded: boolean;
  onToggleExpand: () => void;
  onMetricClick: (metric: Metric) => void;
  onCustomize: () => void;
}

export function MetricTable({
  area,
  columnHeaders,
  expanded,
  onToggleExpand,
  onMetricClick,
  onCustomize,
}: MetricTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle2 className="h-4 w-4 text-blue-600" />;
      case 'healthy': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <CheckCircle2 className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* Area Header */}
      <div
        className={`p-4 border-l-4 ${
          area.overallStatus === 'excellent' ? 'border-blue-500' :
          area.overallStatus === 'healthy' ? 'border-green-500' :
          area.overallStatus === 'warning' ? 'border-yellow-500' :
          'border-red-500'
        }`}
      >
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity flex-1"
            onClick={onToggleExpand}
          >
            {expanded ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            )}
            <h3 className="font-semibold text-lg">{area.name}</h3>
          </div>
          <div className="flex items-center gap-4">
            {!expanded && area.quickView && (
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span>{area.quickView.metric1}</span>
                <span>{area.quickView.metric2}</span>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onCustomize();
              }}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Customize
            </Button>
          </div>
        </div>
      </div>

      {/* Expanded Table */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-y">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium w-[12%]">Category</th>
                    <th className="text-left py-3 px-4 font-medium w-[22%]">Metric</th>
                    <th className="text-right py-3 px-4 font-medium w-[10%]">{columnHeaders.current}</th>
                    <th className="text-right py-3 px-4 font-medium w-[10%]">{columnHeaders.vsPrior}</th>
                    <th className="text-right py-3 px-4 font-medium w-[10%]">vs Q1 Plan</th>
                    <th className="text-center py-3 px-4 font-medium w-[10%]">Trend (7D)</th>
                    <th className="text-center py-3 px-4 font-medium w-[8%]">Status</th>
                    <th className="text-center py-3 px-4 font-medium w-[18%]">AI Insight</th>
                  </tr>
                </thead>
                <tbody>
                  {area.metrics.map((metric, idx) => (
                    <tr
                      key={metric.id}
                      className={`border-b hover:bg-muted/30 transition-colors cursor-pointer ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-muted/10'
                      }`}
                      onClick={() => onMetricClick(metric)}
                    >
                      <td className="py-3 px-4 text-xs text-muted-foreground">{metric.category}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{metric.name}</span>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">{metric.current}</td>
                      <td className="py-3 px-4 text-right">
                        <div className={`flex items-center justify-end gap-1 ${
                          metric.change > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {metric.change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          <span className="font-medium">{metric.changeLabel}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {metric.vsPlan && (
                          <span className={metric.vsPlanValue && metric.vsPlanValue > 0 ? 'text-green-600' : 'text-red-600'}>
                            {metric.vsPlan}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Sparkline
                          data={metric.trend}
                          color={metric.change > 0 ? '#10b981' : '#ef4444'}
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        {getStatusIcon(metric.status)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-purple-500 shrink-0" />
                          <span className="text-xs text-muted-foreground line-clamp-2">
                            {metric.aiInsight.summary}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
