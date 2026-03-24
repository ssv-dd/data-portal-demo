import { motion } from 'motion/react';
import { Sparkles, Send, MessageSquare, Layers, BookOpen } from 'lucide-react';
// Sparkles used only for greeting icon
import { cn } from '../ui/utils';

type AgentMode = 'chat' | 'hybrid' | 'notebook';
type AgentPurpose = 'analysis' | 'exploration' | 'reporting';

interface HeroPanelProps {
  userName: string;
  greeting?: string;
  prompts: string[];
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onSubmit: () => void;
  onPromptClick?: (prompt: string) => void;
  agentMode: AgentMode;
  onAgentModeChange: (mode: AgentMode) => void;
  agentPurpose: AgentPurpose;
  onAgentPurposeChange: (purpose: AgentPurpose) => void;
}

export function HeroPanel({
  userName,
  greeting = 'Good morning',
  prompts,
  searchTerm,
  onSearchTermChange,
  onSubmit,
  onPromptClick,
  agentMode,
  onAgentModeChange,
  agentPurpose,
  onAgentPurposeChange,
}: HeroPanelProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-hero rounded-2xl px-6 py-5 border border-border/60 dark:border-white/10"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-foreground">
            {greeting}, {userName}
          </h2>
          <p className="text-xs text-muted-foreground">
            What would you like to explore today?
          </p>
        </div>
      </div>

      <div className="relative mb-3">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onSubmit(); } }}
          className={cn(
            'w-full pl-5 pr-14 h-14 rounded-2xl text-[15px]',
            'bg-background/70 border-2 border-violet-300/50 dark:border-violet-500/40',
            'text-foreground placeholder:text-muted-foreground/50',
            'focus:outline-none focus:ring-2 focus:ring-violet-500/25 focus:border-violet-500/50',
            'transition-all duration-200',
            'shadow-[0_0_20px_rgba(139,92,246,0.12)]',
            'ai-glow'
          )}
          placeholder="Ask anything about your data..."
        />
        <button
          onClick={onSubmit}
          className={cn(
            'absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center transition-all',
            searchTerm.trim()
              ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-md shadow-violet-500/25'
              : 'text-muted-foreground/30 cursor-default'
          )}
          disabled={!searchTerm.trim()}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-0.5 bg-muted/60 p-0.5 rounded-lg">
          {(['chat', 'hybrid'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => onAgentModeChange(mode)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                agentMode === mode
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {mode === 'chat' && <MessageSquare className="w-3.5 h-3.5" />}
              {mode === 'hybrid' && <Layers className="w-3.5 h-3.5" />}
              {mode === 'notebook' && <BookOpen className="w-3.5 h-3.5" />}
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {(['analysis', 'exploration', 'reporting'] as const).map((purpose) => {
            const isComingSoon = purpose === 'exploration' || purpose === 'reporting';
            return (
              <button
                key={purpose}
                onClick={() => !isComingSoon && onAgentPurposeChange(purpose)}
                disabled={isComingSoon}
                title={isComingSoon ? 'Coming soon' : undefined}
                className={cn(
                  'px-2.5 py-1 rounded-full text-xs font-medium border transition-all capitalize',
                  isComingSoon
                    ? 'opacity-40 cursor-not-allowed border-border/50 text-muted-foreground'
                    : agentPurpose === purpose
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-background text-foreground border-border hover:bg-accent/40'
                )}
              >
                {purpose}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {prompts.map((prompt, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onPromptClick?.(prompt)}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs',
              'bg-muted/60 border border-border/40',
              'text-foreground/80 hover:text-foreground',
              'hover:bg-accent/60 hover:border-border/60',
              'transition-all duration-200',
              'hover:shadow-sm'
            )}
          >
            {prompt}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
