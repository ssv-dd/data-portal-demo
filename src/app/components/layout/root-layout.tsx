import { Outlet } from 'react-router';
import { TopNav } from './top-nav';
import { useState, useEffect } from 'react';
import { KeyboardShortcutsModal } from '../keyboard-shortcuts-modal';
import { ThemeProvider } from '@/app/context/theme-context';
import styled from 'styled-components';
import { colors } from '@/styles/theme';

const LayoutContainer = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: ${colors.background};
`;

const MainContent = styled.main`
  flex: 1;
  overflow: auto;
  background-color: ${colors.backgroundSecondary};
`;

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
    <ThemeProvider>
      <LayoutContainer>
        <TopNav />
        <MainContent>
          <Outlet />
        </MainContent>
        <KeyboardShortcutsModal open={showShortcuts} onOpenChange={setShowShortcuts} />
      </LayoutContainer>
    </ThemeProvider>
  );
}
