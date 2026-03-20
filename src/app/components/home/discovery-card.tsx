import { motion } from 'motion/react';
import { useState } from 'react';
import { Sparkles, Star, Clock, ChevronRight, type LucideIcon } from 'lucide-react';
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
  recommendations: DiscoveryItem[];
  favorites: DiscoveryItem[];
  recent: DiscoveryItem[];
  onItemClick?: (item: DiscoveryItem) => void;
}

type TabKey = 'recommendations' | 'favorites' | 'recent';

const tabs = [
  { key: 'recommendations' as TabKey, label: 'For you', icon: Sparkles },
  { key: 'favorites' as TabKey, label: 'Favorites', icon: Star },
  { key: 'recent' as TabKey, label: 'Recent', icon: Clock },
];

export function DiscoveryCard({
  recommendations,
  favorites,
  recent,
  onItemClick,
}: DiscoveryCardProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('recommendations');

  const getItems = () => {
    switch (activeTab) {
      case 'recommendations':
        return recommendations;
      case 'favorites':
        return favorites;
      case 'recent':
        return recent;
    }
  };

  const items = getItems();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="glass-panel rounded-2xl p-6 border border-border/60 dark:border-white/10"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">Discover</h3>

      <div className="flex gap-1 mb-4 p-1 bg-muted/40 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                activeTab === tab.key
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
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
                'w-full p-4 rounded-xl',
                'flex items-start gap-3',
                'bg-background/40 border border-border/40',
                'dark:bg-white/[0.04] dark:border-white/10',
                'hover:bg-accent/60 hover:border-border/60',
                'dark:hover:bg-white/[0.08] dark:hover:border-white/20',
                'transition-all duration-200',
                'group text-left'
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-400/20 dark:from-violet-500/30 dark:to-cyan-400/30 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-violet-600 dark:text-violet-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {item.description}
                </p>
                <span className="inline-block px-2 py-1 text-xs rounded-md bg-muted/60 text-muted-foreground">
                  {item.category}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
