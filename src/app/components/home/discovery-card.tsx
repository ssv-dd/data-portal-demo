import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Users, TrendingUp, Zap, ChevronRight, type LucideIcon } from 'lucide-react';
import { cn } from '../ui/utils';

export interface DiscoveryItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: string;
  route?: string;
}

interface DiscoveryCardProps {
  team: DiscoveryItem[];
  trending: DiscoveryItem[];
  recent: DiscoveryItem[];
  onItemClick?: (item: DiscoveryItem) => void;
}

type TabKey = 'team' | 'trending' | 'recent';

const tabs = [
  { key: 'team' as TabKey, label: 'Your team', icon: Users },
  { key: 'trending' as TabKey, label: 'Trending', icon: TrendingUp },
  { key: 'recent' as TabKey, label: 'Recently published', icon: Zap },
];

export function DiscoveryCard({
  team,
  trending,
  recent,
  onItemClick,
}: DiscoveryCardProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('team');
  const defaultCount = 4;
  const [showAll, setShowAll] = useState(false);

  const getAllItems = () => {
    switch (activeTab) {
      case 'team':
        return team;
      case 'trending':
        return trending;
      case 'recent':
        return recent;
    }
  };

  const allItems = getAllItems();
  const items = showAll ? allItems : allItems.slice(0, defaultCount);
  const hasMore = allItems.length > defaultCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="glass-panel rounded-2xl p-5 border border-border/60 dark:border-white/10 flex flex-col"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-foreground">Trending in your org</h3>
        <div className="flex gap-0.5 p-0.5 bg-muted/40 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setShowAll(false); }}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
                  activeTab === tab.key
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-1">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onItemClick?.(item)}
              className={cn(
                'w-full px-3 py-2 rounded-lg',
                'flex items-center gap-2.5',
                'bg-background/40 border border-border/40',
                'dark:bg-white/[0.04] dark:border-white/10',
                'hover:bg-accent/60 hover:border-border/60',
                'dark:hover:bg-white/[0.08] dark:hover:border-white/20',
                'transition-all duration-200',
                'group text-left'
              )}
            >
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-violet-500/20 to-cyan-400/20 dark:from-violet-500/30 dark:to-cyan-400/30 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-violet-600 dark:text-violet-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {item.description}
                </p>
              </div>
              <span className="px-1.5 py-0.5 text-[10px] rounded-md bg-muted/60 text-muted-foreground flex-shrink-0">
                {item.category}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
            </motion.button>
          );
        })}
      </div>

      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-2 text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors text-left"
        >
          {showAll ? 'See less' : 'See more'}
        </button>
      )}
    </motion.div>
  );
}
