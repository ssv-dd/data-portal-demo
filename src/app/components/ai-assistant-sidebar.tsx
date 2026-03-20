import { useState } from 'react';
import { Send, Sparkles, ChevronDown, Database, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from './ui/utils';
import { knowledgeBases, type KnowledgeBase } from '../data/mock/knowledge-bases-data';

interface SuggestionChip {
  text: string;
  icon?: React.ReactNode;
}

interface AIAssistantSidebarProps {
  title?: string;
  welcomeMessage?: string;
  suggestions?: SuggestionChip[];
  knowledgeBaseId?: string;
  onKnowledgeBaseChange?: (id: string) => void;
  suggestedActions?: string[];
  contextLabel?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export function AIAssistantSidebar({
  title = 'AI Assistant',
  welcomeMessage = 'Hi! I can help you build your dashboards by searching for metrics and adding it to your canvas.',
  suggestions = [
    { text: 'Revenue by customer segment' },
    { text: 'Top products by category' },
    { text: 'Daily active users trend' },
    { text: 'Orders by region' },
  ],
  knowledgeBaseId = 'all',
  onKnowledgeBaseChange,
  suggestedActions = [],
  contextLabel,
  collapsible = false,
  collapsed = false,
  onToggleCollapse,
  className,
}: AIAssistantSidebarProps) {
  const [showKBDropdown, setShowKBDropdown] = useState(false);
  const [selectedKB, setSelectedKB] = useState(knowledgeBaseId);

  const currentKB = knowledgeBases.find((kb) => kb.id === selectedKB) || knowledgeBases[0];
  const KBIcon = currentKB.icon;

  const handleKBSelect = (kb: KnowledgeBase) => {
    setSelectedKB(kb.id);
    onKnowledgeBaseChange?.(kb.id);
    setShowKBDropdown(false);
  };

  if (collapsed && collapsible) {
    return (
      <motion.div
        animate={{ width: 72 }}
        transition={{ duration: 0.2 }}
        className={cn('border-l border-border/60 flex flex-col items-center glass-panel-subtle', className)}
      >
        <div className="p-3 border-b border-border/40 w-full flex justify-center">
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg hover:bg-accent/60 transition-colors"
            aria-label="Expand assistant"
          >
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-muted-foreground" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      animate={{ width: 384 }}
      transition={{ duration: 0.2 }}
      className={cn('border-l border-border/60 flex flex-col overflow-hidden glass-panel-chat', className)}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/60 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-foreground dark:text-white">{title}</h3>
          {contextLabel && (
            <span className="rounded-xl border border-violet-400/20 dark:border-violet-400/30 bg-violet-500/10 dark:bg-violet-500/15 px-2.5 py-1 text-xs font-medium text-violet-700 dark:text-violet-200">
              {contextLabel}
            </span>
          )}
        </div>
        {collapsible && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg hover:bg-accent/60 transition-colors"
            aria-label="Collapse assistant"
          >
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Knowledge Base Selector */}
      <div className="px-4 py-3 border-b border-border/40 dark:border-white/10 relative">
        <button
          onClick={() => setShowKBDropdown(!showKBDropdown)}
          className={cn(
            'w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg',
            'bg-background/50 dark:bg-white/[0.05] border border-border/40 dark:border-white/10',
            'hover:bg-accent/40 dark:hover:bg-white/[0.08] transition-colors',
            'text-sm'
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <KBIcon className={cn('w-4 h-4 flex-shrink-0', currentKB.color)} />
            <span className="text-foreground dark:text-white font-medium truncate">{currentKB.name}</span>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </button>

        {/* Dropdown */}
        {showKBDropdown && (
          <div className="absolute top-full left-4 right-4 mt-1 bg-background dark:bg-slate-900/95 border border-border/60 dark:border-white/10 rounded-xl shadow-popover z-50 py-1">
            {knowledgeBases.map((kb) => {
              const Icon = kb.icon;
              return (
                <button
                  key={kb.id}
                  onClick={() => handleKBSelect(kb)}
                  className={cn(
                    'w-full flex items-start gap-3 px-3 py-2.5 hover:bg-accent/60 dark:hover:bg-white/[0.08] transition-colors text-left',
                    selectedKB === kb.id && 'bg-accent/40 dark:bg-white/[0.06]'
                  )}
                >
                  <Icon className={cn('w-4 h-4 flex-shrink-0 mt-0.5', kb.color)} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground dark:text-white">{kb.name}</div>
                    <div className="text-xs text-muted-foreground dark:text-slate-400 line-clamp-1">
                      {kb.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 flex flex-col">
        <div className="mb-6">
          <p className="text-muted-foreground dark:text-slate-400 text-sm leading-relaxed">
            {welcomeMessage}
          </p>
        </div>

        {/* Suggestion Chips */}
        <div className="grid grid-cols-2 gap-3 mb-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className={cn(
                'px-4 py-3 rounded-xl border border-border/60 dark:border-white/10',
                'bg-background/40 dark:bg-white/[0.04] text-foreground dark:text-slate-200 text-sm',
                'flex items-center gap-2',
                'hover:bg-accent/60 dark:hover:bg-white/[0.07] hover:border-border dark:hover:border-violet-400/20 transition-all',
                'hover:shadow-sm'
              )}
            >
              {suggestion.icon || <Sparkles className="w-4 h-4" />}
              <span>{suggestion.text}</span>
            </button>
          ))}
        </div>

        {/* Suggested Actions */}
        {suggestedActions.length > 0 && (
          <div className="mt-6 pt-6 border-t border-border/40 dark:border-white/10">
            <p className="text-xs font-medium text-muted-foreground dark:text-slate-500 uppercase tracking-wider mb-3">Suggested actions</p>
            <div className="flex flex-wrap gap-2">
              {suggestedActions.map((action, index) => (
                <button
                  key={index}
                  className={cn(
                    'px-3 py-2 rounded-full text-xs font-medium',
                    'border border-white/10 dark:border-white/10',
                    'bg-black/10 dark:bg-black/20',
                    'text-slate-700 dark:text-slate-300',
                    'hover:bg-black/20 dark:hover:bg-black/30 transition-colors'
                  )}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="mt-6 relative">
          <input
            type="text"
            placeholder="@ for objects, / for commands, ↕ for history"
            className={cn(
              'w-full px-4 py-3 rounded-xl border border-border dark:border-white/10',
              'text-foreground dark:text-slate-200 text-sm',
              'bg-background/50 dark:bg-slate-950/70',
              'placeholder-muted-foreground/60 dark:placeholder-slate-400',
              'focus:outline-none focus:ring-2 focus:ring-violet-400/20 focus:border-violet-400/40',
              'transition-all'
            )}
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground/60 dark:text-slate-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
