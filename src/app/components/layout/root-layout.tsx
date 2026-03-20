import { Outlet } from 'react-router';
import { TopNav } from './top-nav';
import { useState, useEffect } from 'react';
import { KeyboardShortcutsModal } from '../keyboard-shortcuts-modal';

export function RootLayout() {
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowShortcuts(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-background">
      <TopNav />
      <main className="flex-1 overflow-auto bg-background-secondary">
        <Outlet />
      </main>
      <KeyboardShortcutsModal open={showShortcuts} onOpenChange={setShowShortcuts} />
    </div>
  );
}
