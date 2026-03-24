import { LayoutDashboard } from 'lucide-react';
import styled from 'styled-components';
import { Theme } from '@doordash/prism-react';
import { colors, radius } from '@/styles/theme';

interface DashboardItem {
  id: string;
  title: string;
  type: string;
  icon?: string;
}

interface DashboardLibraryPanelProps {
  activeTab: string;
  onDashboardClick?: (dashboard: DashboardItem) => void;
}

const recentDashboards: DashboardItem[] = [
  { id: '1', title: 'Q1 Operations Dashboard', type: 'Draft' },
  { id: '2', title: 'Revenue Analytics', type: 'Published' },
  { id: '3', title: 'Customer Insights', type: 'Published' },
];

const templateDashboards: DashboardItem[] = [
  { id: 't1', title: 'Executive Summary', type: 'Template' },
  { id: 't2', title: 'Sales Performance', type: 'Template' },
  { id: 't3', title: 'Operations Overview', type: 'Template' },
];

const sharedDashboards: DashboardItem[] = [
  { id: 's1', title: 'Team Performance Dashboard', type: 'Shared by Ops Team' },
  { id: 's2', title: 'Marketing Metrics', type: 'Shared by Marketing' },
];

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
`;

const ItemButton = styled.button`
  width: 100%;
  padding: ${Theme.usage.space.small};
  border-radius: ${radius.lg};
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.small};
  background: rgb(var(--app-surface-rgb) / 0.4);
  border: 1px solid rgb(var(--app-overlay-rgb) / 0.04);
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;

  &:hover {
    background: rgb(var(--app-accent-rgb) / 0.6);
    border-color: rgb(var(--app-overlay-rgb) / 0.06);
  }
`;

const IconBox = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${radius.lg};
  background: rgb(var(--app-muted-rgb) / 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const TextContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemTitle = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.foreground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ItemType = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export function DashboardLibraryPanel({
  activeTab,
  onDashboardClick,
}: DashboardLibraryPanelProps) {
  const getDashboards = () => {
    switch (activeTab) {
      case 'recent':
        return recentDashboards;
      case 'templates':
        return templateDashboards;
      case 'shared':
        return sharedDashboards;
      default:
        return recentDashboards;
    }
  };

  const dashboards = getDashboards();

  return (
    <ListWrapper>
      {dashboards.map((dashboard) => (
        <ItemButton
          key={dashboard.id}
          onClick={() => onDashboardClick?.(dashboard)}
        >
          <IconBox>
            <LayoutDashboard style={{ width: 16, height: 16, color: colors.mutedForeground }} />
          </IconBox>
          <TextContent>
            <ItemTitle>{dashboard.title}</ItemTitle>
            <ItemType>{dashboard.type}</ItemType>
          </TextContent>
        </ItemButton>
      ))}
    </ListWrapper>
  );
}
