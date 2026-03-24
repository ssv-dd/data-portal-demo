import { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, ChevronRight, Plus, type LucideIcon } from 'lucide-react';
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

export interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  route?: string;
}

export type YourWorkVariant = 'A' | 'B' | 'C';

interface YourWorkCardProps {
  recentItems: RecentWorkItem[];
  quickActions: QuickAction[];
  onItemClick?: (item: RecentWorkItem) => void;
  onActionClick?: (action: QuickAction) => void;
  variant?: YourWorkVariant;
}

const iconStyle: Record<string, { bg: string; text: string }> = {
  '/dashboard/draft': { bg: 'bg-blue-100 dark:bg-blue-500/15', text: 'text-blue-600 dark:text-blue-400' },
  '/dashboards': { bg: 'bg-blue-100 dark:bg-blue-500/15', text: 'text-blue-600 dark:text-blue-400' },
  '/notebooks': { bg: 'bg-violet-100 dark:bg-violet-500/15', text: 'text-violet-600 dark:text-violet-400' },
  '/ai-workflows': { bg: 'bg-amber-100 dark:bg-amber-500/15', text: 'text-amber-600 dark:text-amber-400' },
  '/sql-studio': { bg: 'bg-emerald-100 dark:bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400' },
};

function RecentItemRow({ item, index, onItemClick }: { item: RecentWorkItem; index: number; onItemClick?: (item: RecentWorkItem) => void }) {
  const Icon = item.icon;
  const style = iconStyle[item.route] || { bg: 'bg-muted/60', text: 'text-muted-foreground' };
  return (
    <motion.button
      key={item.id}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={() => onItemClick?.(item)}
      className={cn(
        'w-full px-3 py-2 rounded-lg',
        'flex items-center gap-2.5',
        'bg-background/40 border border-border/40',
        'dark:bg-white/[0.04] dark:border-white/10',
        'hover:bg-accent/60 hover:border-border/60',
        'dark:hover:bg-white/[0.08] dark:hover:border-white/20',
        'transition-all duration-200',
        'group'
      )}
    >
      <div className={cn('w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0', style.bg)}>
        <Icon className={cn('w-4 h-4', style.text)} />
      </div>
      <div className="flex-1 text-left min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
        <p className="text-[11px] text-muted-foreground truncate">{item.meta}</p>
      </div>
      <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 flex-shrink-0">
        {item.status}
      </Badge>
      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
    </motion.button>
  );
}

function QuickActionButton({ action, onActionClick, size = 'sm' }: { action: QuickAction; onActionClick?: (action: QuickAction) => void; size?: 'sm' | 'md' }) {
  const Icon = action.icon;
  return (
    <button
      onClick={() => onActionClick?.(action)}
      className={cn(
        'flex-1 flex items-center justify-center gap-1.5 rounded-lg relative',
        'bg-background/40 border border-border/40',
        'dark:bg-white/[0.04] dark:border-white/10',
        'hover:bg-accent/60 hover:border-border/60',
        'dark:hover:bg-white/[0.08] dark:hover:border-white/20',
        'transition-all duration-200 group',
        size === 'md' ? 'px-3 py-2.5' : 'px-2 py-2'
      )}
    >
      <div className="relative">
        <Icon className={cn(
          'text-muted-foreground group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors',
          size === 'md' ? 'w-5 h-5' : 'w-4 h-4'
        )} />
        <Plus className="w-2.5 h-2.5 absolute -top-1 -right-1.5 text-violet-500 dark:text-violet-400" />
      </div>
      <span className={cn('font-medium text-foreground', size === 'md' ? 'text-sm' : 'text-xs')}>{action.label}</span>
    </button>
  );
}

function VariantA({ recentItems, quickActions, onItemClick, onActionClick }: YourWorkCardProps) {
  const defaultCount = 4;
  const [showAll, setShowAll] = useState(false);
  const visibleItems = showAll ? recentItems : recentItems.slice(0, defaultCount);
  const hasMore = recentItems.length > defaultCount;

  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-5 h-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground">Jump back in</h3>
      </div>

      <div className="space-y-1.5">
        {visibleItems.map((item, index) => (
          <RecentItemRow key={item.id} item={item} index={index} onItemClick={onItemClick} />
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-2 text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors text-left"
        >
          {showAll ? 'See less' : 'See more'}
        </button>
      )}
    </>
  );
}

function VariantB({ recentItems, quickActions, onItemClick, onActionClick }: YourWorkCardProps) {
  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-5 h-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground">Jump back in</h3>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 space-y-1.5">
          {recentItems.map((item, index) => (
            <RecentItemRow key={item.id} item={item} index={index} onItemClick={onItemClick} />
          ))}
        </div>

        <div className="w-px bg-border/40 dark:bg-white/10" />

        <div className="w-[140px] flex flex-col gap-2">
          <div className="flex items-center gap-1.5 mb-1">
            <Plus className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Quick create</span>
          </div>
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onActionClick?.(action)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2.5 rounded-lg w-full',
                  'bg-background/40 border border-border/40',
                  'dark:bg-white/[0.04] dark:border-white/10',
                  'hover:bg-accent/60 hover:border-border/60',
                  'dark:hover:bg-white/[0.08] dark:hover:border-white/20',
                  'transition-all duration-200 group'
                )}
              >
                <Icon className="w-4 h-4 text-muted-foreground group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors" />
                <span className="text-sm font-medium text-foreground">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

function VariantC({ recentItems, quickActions, onItemClick, onActionClick }: YourWorkCardProps) {
  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-5 h-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground">Jump back in</h3>
      </div>

      <div className="space-y-1.5 mb-4">
        {recentItems.map((item, index) => (
          <RecentItemRow key={item.id} item={item} index={index} onItemClick={onItemClick} />
        ))}
      </div>

      <div className="border-t border-border/40 dark:border-white/10 pt-3 mt-auto">
        <div className="flex items-center gap-2 mb-2">
          <Plus className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Quick create</span>
        </div>
        <div className="flex gap-2">
          {quickActions.map((action) => (
            <QuickActionButton key={action.id} action={action} onActionClick={onActionClick} />
          ))}
        </div>
      </div>
    </>
  );
}

export function YourWorkCard({ recentItems, quickActions, onItemClick, onActionClick, variant = 'A' }: YourWorkCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="glass-panel rounded-2xl p-5 border border-border/60 dark:border-white/10 flex flex-col"
    >
      {variant === 'A' && <VariantA recentItems={recentItems} quickActions={quickActions} onItemClick={onItemClick} onActionClick={onActionClick} />}
      {variant === 'B' && <VariantB recentItems={recentItems} quickActions={quickActions} onItemClick={onItemClick} onActionClick={onActionClick} />}
      {variant === 'C' && <VariantC recentItems={recentItems} quickActions={quickActions} onItemClick={onItemClick} onActionClick={onActionClick} />}
    </motion.div>
  );
}
