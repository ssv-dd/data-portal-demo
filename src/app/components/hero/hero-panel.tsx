import { motion } from 'motion/react';
import { Search, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../ui/utils';

interface HeroPanelProps {
  userName: string;
  greeting?: string;
  prompts: string[];
  onPromptClick?: (prompt: string) => void;
  onSearch?: (query: string) => void;
}

export function HeroPanel({
  userName,
  greeting = 'Good morning',
  prompts,
  onPromptClick,
  onSearch,
}: HeroPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery);
      setSearchQuery('');
    }
  };

  const handlePromptClick = (prompt: string) => {
    if (onPromptClick) {
      onPromptClick(prompt);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-hero rounded-2xl p-8 border border-border/60 dark:border-white/10"
    >
      <div className="flex items-start gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/20">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-foreground mb-1">
            {greeting}, {userName}
          </h2>
          <p className="text-sm text-muted-foreground">
            What would you like to explore today?
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ask anything about your data..."
            className={cn(
              'w-full pl-12 pr-4 py-3.5 rounded-xl',
              'bg-background/50 border border-border/60',
              'text-foreground placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-dd-primary/20 focus:border-dd-primary/40',
              'transition-all duration-200'
            )}
          />
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handlePromptClick(prompt)}
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
