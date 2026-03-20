import { motion } from 'motion/react';
import { Clock, ChevronRight, type LucideIcon } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';

export interface RecentWorkItem {
  id: string;
  title: string;
  meta: string;
  status: string;
  icon: LucideIcon;
  route: string;
}

interface RecentWorkCardProps {
  items: RecentWorkItem[];
  onItemClick?: (item: RecentWorkItem) => void;
}

export function RecentWorkCard({ items, onItemClick }: RecentWorkCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="glass-panel rounded-2xl p-6 border border-border/60 dark:border-white/10"
    >
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground">Continue working</h3>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onItemClick?.(item)}
              className={cn(
                'w-full p-3 rounded-xl',
                'flex items-center gap-3',
                'bg-background/40 border border-border/40',
                'dark:bg-white/[0.04] dark:border-white/10',
                'hover:bg-accent/60 hover:border-border/60',
                'dark:hover:bg-white/[0.08] dark:hover:border-white/20',
                'transition-all duration-200',
                'group'
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-muted/60 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {item.meta}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant="secondary" className="text-xs">
                  {item.status}
                </Badge>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
