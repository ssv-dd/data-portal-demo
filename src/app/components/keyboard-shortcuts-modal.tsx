import { Dialog, DialogContent } from './ui/dialog';
import styled from 'styled-components';
import { Theme } from '@doordash/prism-react';
import { colors, radius } from '@/styles/theme';

interface KeyboardShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShortcutRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${Theme.usage.space.xSmall} 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
`;

const ShortcutDescription = styled.span`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.foreground};
`;

const Kbd = styled.kbd`
  padding: ${Theme.usage.space.xxSmall} ${Theme.usage.space.xSmall};
  background-color: ${colors.muted};
  border: 1px solid ${colors.border};
  border-radius: ${radius.sm};
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.foreground};
  font-family: inherit;
`;

const ShortcutList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
`;

const shortcuts = [
  { key: '/', description: 'Focus global search / agent input' },
  { key: 'P', description: 'Pin selected card' },
  { key: 'Ctrl/Cmd + Enter', description: 'Run SQL in SQL Studio' },
  { key: 'Shift + S', description: 'Show SQL overlay from selected result' },
  { key: '?', description: 'Show shortcuts modal' },
];

export function KeyboardShortcutsModal({ open, onOpenChange }: KeyboardShortcutsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Keyboard Shortcuts">
      <DialogContent style={{ maxWidth: '512px' }}>
        <ShortcutList>
          {shortcuts.map((shortcut) => (
            <ShortcutRow key={shortcut.key}>
              <ShortcutDescription>{shortcut.description}</ShortcutDescription>
              <Kbd>{shortcut.key}</Kbd>
            </ShortcutRow>
          ))}
        </ShortcutList>
      </DialogContent>
    </Dialog>
  );
}
