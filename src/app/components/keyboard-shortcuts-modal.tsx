import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface KeyboardShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const shortcuts = [
  { key: '/', description: 'Focus global search / agent input' },
  { key: 'P', description: 'Pin selected card' },
  { key: 'Ctrl/Cmd + Enter', description: 'Run SQL in SQL Studio' },
  { key: 'Shift + S', description: 'Show SQL overlay from selected result' },
  { key: '?', description: 'Show shortcuts modal' },
];

export function KeyboardShortcutsModal({ open, onOpenChange }: KeyboardShortcutsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.key}
              className="flex items-center justify-between py-2 border-b border-gray-100"
            >
              <span className="text-sm text-gray-900">{shortcut.description}</span>
              <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs text-gray-700">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
