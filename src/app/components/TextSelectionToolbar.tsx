import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Sparkles, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TextSelectionToolbarProps {
  onAskAI: (selectedText: string) => void;
  onComment: (selectedText: string) => void;
  containerRef: React.RefObject<HTMLElement>;
}

export function TextSelectionToolbar({ onAskAI, onComment, containerRef }: TextSelectionToolbarProps) {
  const [selection, setSelection] = useState<{
    text: string;
    rect: DOMRect | null;
  } | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selectedText = window.getSelection();

      if (!selectedText || selectedText.rangeCount === 0) {
        setIsVisible(false);
        return;
      }

      const text = selectedText.toString().trim();

      // Only show toolbar if text is selected and it's within our container
      if (text.length > 0 && containerRef.current) {
        const range = selectedText.getRangeAt(0);
        const container = containerRef.current;

        // Check if selection is within our container
        if (container.contains(range.commonAncestorContainer)) {
          const rect = range.getBoundingClientRect();

          setSelection({
            text,
            rect
          });
          setIsVisible(true);

          // Add highlight styling to selected text
          const selectionRange = selectedText.getRangeAt(0);
          if (selectionRange) {
            // This creates a visual effect (browsers handle this automatically)
            // We just need to make sure it's visible
          }
        } else {
          setIsVisible(false);
        }
      } else {
        setIsVisible(false);
      }
    };

    // Handle selection changes
    document.addEventListener('selectionchange', handleSelectionChange);

    // Handle clicks outside to dismiss
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        const selectedText = window.getSelection();
        if (selectedText && !selectedText.toString().trim()) {
          setIsVisible(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [containerRef]);

  const handleAskAI = () => {
    if (selection) {
      onAskAI(selection.text);
      setIsVisible(false);
      window.getSelection()?.removeAllRanges();
    }
  };

  const handleComment = () => {
    if (selection) {
      onComment(selection.text);
      setIsVisible(false);
      window.getSelection()?.removeAllRanges();
    }
  };

  if (!isVisible || !selection?.rect) return null;

  // Calculate position (above the selection)
  const top = selection.rect.top + window.scrollY - 50;
  const left = selection.rect.left + window.scrollX + (selection.rect.width / 2);

  return (
    <AnimatePresence>
      <motion.div
        ref={toolbarRef}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 5 }}
        transition={{ duration: 0.15 }}
        className="fixed z-50"
        style={{
          top: `${top}px`,
          left: `${left}px`,
          transform: 'translateX(-50%)'
        }}
      >
        <Card className="flex items-center gap-2 p-1.5 shadow-xl border-2 border-purple-200">
          <Button
            size="sm"
            className="h-8 gap-1.5 bg-purple-600 hover:bg-purple-700 text-white"
            onClick={handleAskAI}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Ask AI
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 border-purple-200 hover:bg-purple-50 text-purple-700"
            onClick={handleComment}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Comment
          </Button>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
