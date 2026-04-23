import { Outlet } from 'react-router';
import { AppSidebar } from './app-sidebar';
import { TopNav } from './top-nav';
import { useState, useEffect } from 'react';
import { KeyboardShortcutsModal } from '../keyboard-shortcuts-modal';
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

const BodyContainer = styled.div`
  flex: 1;
  display: flex;
  min-height: 0;
  overflow: hidden;
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
    <LayoutContainer>
      <TopNav />
      <BodyContainer>
        <AppSidebar />
        <MainContent>
          <Outlet />
        </MainContent>
      </BodyContainer>
      <KeyboardShortcutsModal open={showShortcuts} onOpenChange={setShowShortcuts} />
    </LayoutContainer>
  );
}
