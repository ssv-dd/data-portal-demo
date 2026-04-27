import { Link, useLocation } from 'react-router';
import {
  Home,
  MessageSquare,
  LayoutGrid,
  Database,
  BookOpen,
  Workflow,
  SlidersHorizontal,
} from 'lucide-react';
import styled from 'styled-components';
import { colors, radius } from '@/styles/theme';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', path: '/', icon: Home },
  { id: 'chats', label: 'Chats', path: '/chats', icon: MessageSquare },
  { id: 'dashboards', label: 'Dashboards', path: '/dashboards', icon: LayoutGrid },
  { id: 'sql-studio', label: 'SQL Studio', path: '/sql-studio', icon: Database },
  { id: 'notebooks', label: 'Notebooks', path: '/notebooks', icon: BookOpen },
  { id: 'ai-workflows', label: 'AI Workflows', path: '/ai-workflows', icon: Workflow },
];

const RAIL_WIDTH_EXPANDED = 76;
const RAIL_WIDTH_COLLAPSED = 56;

interface LeftNavProps {
  /** When true, the rail collapses to icon-only (e.g. on /chats where space is needed for the chat history column). */
  collapsed?: boolean;
}

const Rail = styled.nav<{ $collapsed: boolean }>`
  width: ${({ $collapsed }) => ($collapsed ? RAIL_WIDTH_COLLAPSED : RAIL_WIDTH_EXPANDED)}px;
  flex-shrink: 0;
  height: 100%;
  background: var(--app-bg);
  border-right: 1px solid rgb(var(--app-border-rgb) / 0.5);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 12px 0;
  transition: width 200ms ease;
  position: relative;
  z-index: 30;
`;

const ItemList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;

const ItemBottomGroup = styled.div`
  padding: 12px 8px 0;
  border-top: 1px solid rgb(var(--app-border-rgb) / 0.4);
`;

const ItemLink = styled(Link)<{ $active: boolean; $collapsed: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: ${({ $collapsed }) => ($collapsed ? '10px 4px' : '10px 4px 8px')};
  border-radius: ${radius.lg};
  text-decoration: none;
  cursor: pointer;
  transition: background-color 150ms, color 150ms;
  color: ${({ $active }) => ($active ? 'var(--app-violet-600)' : 'var(--app-muted-fg)')};
  background-color: ${({ $active }) =>
    $active ? 'rgb(var(--app-violet-rgb) / 0.10)' : 'transparent'};

  &:hover {
    background-color: ${({ $active }) =>
      $active ? 'rgb(var(--app-violet-rgb) / 0.14)' : 'rgb(var(--app-muted-rgb) / 0.5)'};
    color: ${({ $active }) => ($active ? 'var(--app-violet-600)' : 'var(--app-fg)')};
  }

  &:focus-visible {
    outline: 2px solid var(--app-violet-500);
    outline-offset: 2px;
  }
`;

const ActiveAccent = styled.span`
  position: absolute;
  left: -8px;
  top: 8px;
  bottom: 8px;
  width: 3px;
  border-radius: 0 3px 3px 0;
  background: var(--app-violet-500);
`;

const ItemLabel = styled.span<{ $collapsed: boolean }>`
  font-size: 11px;
  font-weight: 500;
  line-height: 1.2;
  text-align: center;
  display: ${({ $collapsed }) => ($collapsed ? 'none' : 'block')};
`;

const SettingsButton = styled.button<{ $collapsed: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: ${({ $collapsed }) => ($collapsed ? '10px 4px' : '10px 4px 8px')};
  border-radius: ${radius.lg};
  background: none;
  border: none;
  cursor: pointer;
  color: var(--app-muted-fg);
  transition: background-color 150ms, color 150ms;

  &:hover {
    background-color: rgb(var(--app-muted-rgb) / 0.5);
    color: var(--app-fg);
  }

  &:focus-visible {
    outline: 2px solid var(--app-violet-500);
    outline-offset: 2px;
  }
`;

export function LeftNav({ collapsed = false }: LeftNavProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <Rail aria-label="Primary navigation" $collapsed={collapsed}>
      <ItemList>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <li key={item.id}>
              <ItemLink to={item.path} $active={active} $collapsed={collapsed} title={item.label}>
                {active && <ActiveAccent aria-hidden />}
                <Icon size={20} strokeWidth={active ? 2 : 1.75} />
                <ItemLabel $collapsed={collapsed}>{item.label}</ItemLabel>
              </ItemLink>
            </li>
          );
        })}
      </ItemList>
      <ItemBottomGroup>
        <SettingsButton
          type="button"
          aria-label="Preferences"
          title="Preferences"
          $collapsed={collapsed}
        >
          <SlidersHorizontal size={20} strokeWidth={1.75} />
          {!collapsed && <ItemLabel $collapsed={collapsed}>Settings</ItemLabel>}
        </SettingsButton>
      </ItemBottomGroup>
    </Rail>
  );
}
