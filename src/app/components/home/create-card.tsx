import { motion } from 'motion/react';
import { Plus, type LucideIcon } from 'lucide-react';
import { cn } from '../ui/utils';

export interface CreateAction {
  id: string;
  label: string;
  icon: LucideIcon;
  route?: string;
  gradient?: string;
}

interface CreateCardProps {
  actions: CreateAction[];
  onActionClick?: (action: CreateAction) => void;
}

export function CreateCard({ actions, onActionClick }: CreateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="glass-panel rounded-2xl p-6 border border-border/60 dark:border-white/10"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/15 to-cyan-400/15 dark:from-violet-500/25 dark:to-cyan-400/25 flex items-center justify-center">
          <Plus className="w-5 h-5 text-violet-600 dark:text-violet-300" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Quick create</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onActionClick?.(action)}
              className={cn(
                'p-4 rounded-xl',
                'flex flex-col items-center justify-center gap-2',
                'bg-background/40 border border-border/40',
                'dark:bg-white/[0.04] dark:border-white/10',
                'hover:bg-accent/60 hover:border-border/60',
                'dark:hover:bg-white/[0.08] dark:hover:border-white/20',
                'hover:shadow-sm',
                'transition-all duration-200',
                'group'
              )}
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  action.gradient ||
                    'bg-gradient-to-br from-violet-500/20 to-cyan-400/20 dark:from-violet-500/30 dark:to-cyan-400/30'
                )}
              >
                <Icon className="w-6 h-6 text-violet-600 dark:text-violet-300 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-sm font-medium text-foreground text-center">
                {action.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
