import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Sparkles, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Theme } from '@doordash/prism-react';
import { colors } from '@/styles/theme';

interface TextSelectionToolbarProps {
  onAskAI: (selectedText: string) => void;
  onComment: (selectedText: string) => void;
  containerRef: React.RefObject<HTMLElement>;
}

const ToolbarCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.xxSmall};
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  border: 2px solid ${colors.purple200};
`;

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

      if (text.length > 0 && containerRef.current) {
        const range = selectedText.getRangeAt(0);
        const container = containerRef.current;

        if (container.contains(range.commonAncestorContainer)) {
          const rect = range.getBoundingClientRect();

          setSelection({
            text,
            rect
          });
          setIsVisible(true);

          const selectionRange = selectedText.getRangeAt(0);
          if (selectionRange) {
            // browsers handle highlight styling automatically
          }
        } else {
          setIsVisible(false);
        }
      } else {
        setIsVisible(false);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);

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
        style={{
          position: 'fixed',
          zIndex: 50,
          top: `${top}px`,
          left: `${left}px`,
          transform: 'translateX(-50%)'
        }}
      >
        <ToolbarCard>
          <Button
            size="sm"
            style={{
              height: '32px',
              gap: '4px',
              backgroundColor: colors.purple600,
              color: colors.white,
            }}
            onClick={handleAskAI}
          >
            <Sparkles style={{ height: '14px', width: '14px' }} />
            Ask AI
          </Button>
          <Button
            size="sm"
            variant="outline"
            style={{
              height: '32px',
              gap: '4px',
              borderColor: colors.purple200,
              color: colors.purple700,
            }}
            onClick={handleComment}
          >
            <MessageSquare style={{ height: '14px', width: '14px' }} />
            Comment
          </Button>
        </ToolbarCard>
      </motion.div>
    </AnimatePresence>
  );
}
