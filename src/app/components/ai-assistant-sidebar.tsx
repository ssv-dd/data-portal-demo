import { Send, Sparkles } from 'lucide-react';

interface SuggestionChip {
  text: string;
  icon?: React.ReactNode;
}

interface AIAssistantSidebarProps {
  title?: string;
  welcomeMessage?: string;
  suggestions?: SuggestionChip[];
}

export function AIAssistantSidebar({
  title = 'AI Assistant',
  welcomeMessage = 'Hi! I can help you build your dashboards by searching for metrics and adding it to your canvas.',
  suggestions = [
    { text: 'Revenue by customer segment' },
    { text: 'Top products by category' },
    { text: 'Daily active users trend' },
    { text: 'Orders by region' },
  ]
}: AIAssistantSidebarProps) {
  return (
    <div className="w-96 border-l border-border/60 flex flex-col overflow-hidden bg-white">
      <div className="px-4 py-3 border-b border-border/60">
        <h3 className="font-medium text-foreground">{title}</h3>
      </div>

      <div className="flex-1 overflow-auto p-6 flex flex-col">
        <div className="mb-6">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {welcomeMessage}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="px-4 py-3 rounded-full border border-border/60 bg-muted/50 text-foreground text-sm flex items-center gap-2 hover:bg-accent/60 transition-colors"
            >
              {suggestion.icon || <Sparkles className="w-4 h-4" />}
              <span>{suggestion.text}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 relative">
          <input
            type="text"
            placeholder="@ for objects, / for commands, ↕ for history"
            className="w-full px-4 py-3 rounded-xl border border-border text-foreground text-sm bg-white placeholder-muted-foreground/60 focus:outline-none focus:border-border-strong"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground/60 hover:text-muted-foreground transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
