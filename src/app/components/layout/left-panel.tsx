import { motion } from 'motion/react';
import { Search, ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react';
import { cn } from '../ui/utils';
import { useState } from 'react';

export interface LeftPanelTab {
  key: string;
  label: string;
  icon: LucideIcon;
}

interface LeftPanelProps {
  tabs: LeftPanelTab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  children: React.ReactNode;
  searchPlaceholder?: string;
  showSearch?: boolean;
  className?: string;
}

export function LeftPanel({
  tabs,
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
  children,
  searchPlaceholder = 'Search...',
  showSearch = false,
  className,
}: LeftPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <motion.div
      animate={{
        width: collapsed ? 72 : 320,
      }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={cn(
        'flex flex-col border border-border/60 rounded-2xl overflow-hidden',
        collapsed ? 'glass-panel-subtle' : 'glass-panel',
        className
      )}
    >
      {/* Header with collapse toggle */}
      <div className="flex items-center justify-between p-3 border-b border-border/40">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex-1"
          >
            <h3 className="text-sm font-semibold text-foreground">Navigation</h3>
          </motion.div>
        )}
        <button
          onClick={onToggleCollapse}
          className={cn(
            'p-2 rounded-lg hover:bg-accent/60 transition-colors',
            collapsed && 'mx-auto'
          )}
          aria-label={collapsed ? 'Expand panel' : 'Collapse panel'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Search box - only when expanded and showSearch is true */}
      {!collapsed && showSearch && (
        <div className="p-3 border-b border-border/40">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className={cn(
                'w-full pl-9 pr-3 py-2 rounded-lg text-sm',
                'bg-background/50 border border-border/40',
                'text-foreground placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-1 focus:ring-dd-primary/20 focus:border-dd-primary/40',
                'transition-all duration-200'
              )}
            />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className={cn('flex flex-col gap-1 p-2', collapsed && 'items-center')}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                'group relative',
                isActive
                  ? 'bg-accent text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/40',
                collapsed && 'justify-center'
              )}
              title={collapsed ? tab.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  {tab.label}
                </motion.span>
              )}
              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {tab.label}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Content area */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, delay: 0.05 }}
          className="flex-1 overflow-auto p-3"
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}
