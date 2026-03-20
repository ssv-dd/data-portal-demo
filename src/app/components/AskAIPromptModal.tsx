import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface AskAIPromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedText: string;
  contextType: 'highlight' | 'concern';
  onSelectPrompt: (prompt: string, selectedText: string) => void;
}

export function AskAIPromptModal({
  open,
  onOpenChange,
  selectedText,
  contextType,
  onSelectPrompt
}: AskAIPromptModalProps) {
  const [hoveredPrompt, setHoveredPrompt] = useState<number | null>(null);

  // Detect if selection is a number/metric
  const isNumeric = /^\d+\.?\d*%?|[\$\€\£]\d+/.test(selectedText.trim());

  // Smart prompts based on content type
  const getSmartPrompts = () => {
    if (isNumeric) {
      // Number/metric specific prompts
      return [
        {
          text: 'Why did this metric change?',
          icon: '📊',
          description: 'Understand the drivers behind this number'
        },
        {
          text: 'Show me the trend over time',
          icon: '📈',
          description: 'View historical context and patterns'
        },
        {
          text: 'What should we do about this?',
          icon: '🎯',
          description: 'Get actionable recommendations'
        }
      ];
    } else if (contextType === 'concern') {
      // Concern/issue prompts
      return [
        {
          text: 'What caused this issue?',
          icon: '🔍',
          description: 'Dive into the root causes and contributing factors'
        },
        {
          text: 'What is the recovery plan?',
          icon: '🔄',
          description: 'Understand the steps to resolve and timeline'
        },
        {
          text: 'What are the risks if unaddressed?',
          icon: '⚠️',
          description: 'Assess potential downstream impacts and urgency'
        }
      ];
    } else {
      // General/positive prompts
      return [
        {
          text: 'Explain this in more detail',
          icon: '💡',
          description: 'Get deeper context and background'
        },
        {
          text: 'What are the next steps?',
          icon: '📋',
          description: 'Understand the action plan and timeline'
        },
        {
          text: 'Show related metrics',
          icon: '🔗',
          description: 'See connected data and dependencies'
        }
      ];
    }
  };

  const prompts = getSmartPrompts();

  const handlePromptClick = (promptText: string) => {
    onSelectPrompt(promptText, selectedText);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Ask AI About This
          </DialogTitle>
          <DialogDescription>
            Choose a question to explore this insight with Data Debby
          </DialogDescription>
        </DialogHeader>

        {/* Selected Text Preview */}
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
          <p className="text-sm text-muted-foreground mb-1">Selected text:</p>
          <p className="text-sm font-medium line-clamp-3">"{selectedText}"</p>
        </div>

        {/* Smart Prompts */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Suggested questions:</p>
          {prompts.map((prompt, idx) => (
            <motion.button
              key={idx}
              className="w-full text-left p-4 rounded-xl border-2 transition-all hover:border-purple-400 hover:bg-purple-50"
              style={{
                borderColor: hoveredPrompt === idx ? '#a855f7' : '#e5e7eb'
              }}
              onMouseEnter={() => setHoveredPrompt(idx)}
              onMouseLeave={() => setHoveredPrompt(null)}
              onClick={() => handlePromptClick(prompt.text)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{prompt.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{prompt.text}</span>
                    <ArrowRight className={`h-4 w-4 transition-transform ${
                      hoveredPrompt === idx ? 'translate-x-1' : ''
                    }`} />
                  </div>
                  <p className="text-xs text-muted-foreground">{prompt.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Or ask custom question hint */}
        <div className="pt-2 border-t">
          <p className="text-xs text-center text-muted-foreground">
            Or ask your own question in the chat panel
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
