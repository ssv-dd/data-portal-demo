import React from 'react';
import styled from 'styled-components';
import { Zap, Layers, BarChart3 } from 'lucide-react';
import { colors, Theme } from '@/styles/theme';

export type SourceTab = 'sql' | 'semantic' | 'metrics';

interface SourceTabBarProps {
  activeTab: SourceTab;
  onTabChange: (tab: SourceTab) => void;
}

const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid ${colors.border};
  background: transparent;
`;

const Tab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  color: ${({ $active }) => ($active ? '#FF3A00' : colors.mutedForeground)};
  background: transparent;
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? '#FF3A00' : 'transparent')};
  cursor: pointer;
  transition: color 0.15s ease, border-color 0.15s ease;
  margin-bottom: -1px;
  white-space: nowrap;

  &:hover {
    color: ${({ $active }) => ($active ? '#FF3A00' : colors.foreground)};
  }
`;

const tabs: { key: SourceTab; label: string; Icon: React.ElementType }[] = [
  { key: 'sql', label: 'SQL', Icon: Zap },
  { key: 'semantic', label: 'Semantic', Icon: Layers },
  { key: 'metrics', label: 'Metrics', Icon: BarChart3 },
];

export function SourceTabBar({ activeTab, onTabChange }: SourceTabBarProps) {
  return (
    <TabBar>
      {tabs.map(({ key, label, Icon }) => (
        <Tab key={key} $active={activeTab === key} onClick={() => onTabChange(key)}>
          <Icon style={{ width: 14, height: 14 }} />
          {label}
        </Tab>
      ))}
    </TabBar>
  );
}
