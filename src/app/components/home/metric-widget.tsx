import { motion } from 'motion/react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../ui/utils';

interface MetricWidgetProps {
  title: string;
  value: string;
  change?: number;
  trend?: 'up' | 'down';
  points?: number[];
  className?: string;
}

export function MetricWidget({
  title,
  value,
  change,
  trend,
  points = [],
  className,
}: MetricWidgetProps) {
  const isPositive = trend === 'up' || (change !== undefined && change > 0);

  // Simple sparkline SVG
  const renderSparkline = () => {
    if (points.length === 0) return null;

    const width = 80;
    const height = 24;
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min || 1;

    const pathData = points
      .map((point, i) => {
        const x = (i / (points.length - 1)) * width;
        const y = height - ((point - min) / range) * height;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');

    return (
      <svg width={width} height={height} className="opacity-60">
        <path
          d={pathData}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={isPositive ? 'text-green-500' : 'text-red-500'}
        />
      </svg>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'p-4 rounded-xl',
        'bg-background/40 border border-border/40',
        className
      )}
    >
      <p className="text-xs text-muted-foreground mb-2">{title}</p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-semibold text-foreground mb-1">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="w-3 h-3 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500" />
              )}
              <span
                className={cn(
                  'text-xs font-medium',
                  isPositive ? 'text-green-500' : 'text-red-500'
                )}
              >
                {change > 0 ? '+' : ''}
                {change}%
              </span>
            </div>
          )}
        </div>
        {renderSparkline()}
      </div>
    </motion.div>
  );
}
