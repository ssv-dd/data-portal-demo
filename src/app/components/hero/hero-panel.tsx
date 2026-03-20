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
      className="glass-hero rounded-2xl p-8 border border-border/60 dark:border-white/10"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/20">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            {greeting}, {userName}
          </h2>
          <p className="text-sm text-muted-foreground">
            What would you like to explore today?
          </p>
        </div>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onSubmit(); } }}
          className={cn(
            'w-full pl-5 pr-12 h-12 rounded-xl',
            'bg-background/50 border border-violet-300/40 dark:border-violet-500/30',
            'text-foreground placeholder:text-muted-foreground/60',
            'focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/40',
            'transition-all duration-200 text-base',
            'ai-glow'
          )}
          placeholder="Ask anything about your data..."
        />
        <button
          onClick={onSubmit}
          className={cn(
            'absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-all',
            searchTerm.trim()
              ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm'
              : 'text-muted-foreground/40 cursor-default'
          )}
          disabled={!searchTerm.trim()}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl">
          {(['chat', 'hybrid', 'notebook'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => onAgentModeChange(mode)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                agentMode === mode
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {mode === 'chat' && <MessageSquare className="w-4 h-4" />}
              {mode === 'hybrid' && <Layers className="w-4 h-4" />}
              {mode === 'notebook' && <BookOpen className="w-4 h-4" />}
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {(['analysis', 'exploration', 'reporting'] as const).map((purpose) => (
            <button
              key={purpose}
              onClick={() => onAgentPurposeChange(purpose)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium border transition-all capitalize',
                agentPurpose === purpose
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background text-foreground border-border hover:bg-accent/40'
              )}
            >
              {purpose}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onPromptClick?.(prompt)}
            className={cn(
              'px-3.5 py-2 rounded-lg text-sm',
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
