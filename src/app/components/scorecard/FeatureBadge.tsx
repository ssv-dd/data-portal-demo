import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FeatureBadgeProps {
  visible: boolean;
  onDismiss: () => void;
}

export function FeatureBadge({ visible, onDismiss }: FeatureBadgeProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 right-8 z-50 max-w-sm"
        >
          <Card className="p-4 bg-purple-600 text-white shadow-2xl border-2 border-purple-400">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">✨ New Feature: Smart Highlighting</h4>
                <p className="text-xs text-purple-100 mb-2">
                  Highlight any text, number, or metric to ask AI questions or collaborate with teammates
                </p>
                <div className="flex gap-2">
                  <Badge className="bg-purple-500 text-white border-purple-400 text-xs">
                    Try it now!
                  </Badge>
                </div>
              </div>
              <button
                onClick={onDismiss}
                className="flex-shrink-0 h-5 w-5 bg-purple-700 hover:bg-purple-800 rounded-full flex items-center justify-center text-sm transition-colors"
              >
                ×
              </button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
