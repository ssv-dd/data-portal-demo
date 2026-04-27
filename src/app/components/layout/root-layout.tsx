import { Outlet, useLocation } from 'react-router';
import { TopNav } from './top-nav';
import { LeftNav } from './left-nav';
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

const Body = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: row;
`;

const MainContent = styled.main`
  flex: 1;
  min-width: 0;
  overflow: auto;
  background-color: ${colors.backgroundSecondary};
`;

const COLLAPSED_RAIL_ROUTES = ['/chats'];

export function RootLayout() {
  const location = useLocation();

  const railCollapsed = COLLAPSED_RAIL_ROUTES.some(
    (path) => location.pathname === path || location.pathname.startsWith(`${path}/`),
  );

  return (
    <LayoutContainer>
      <TopNav />
      <Body>
        <LeftNav collapsed={railCollapsed} />
        <MainContent>
          <Outlet />
        </MainContent>
      </Body>
    </LayoutContainer>
  );
}
