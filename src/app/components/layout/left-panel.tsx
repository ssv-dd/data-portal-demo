import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import styled from 'styled-components';
import { Theme } from '@doordash/prism-react';
import { colors, radius, shadows, glassPanel, glassPanelSubtle } from '@/styles/theme';

export interface LeftPanelTab {
  key: string;
  label: string;
  icon: LucideIcon;
}

interface LeftPanelProps {
  tabs: LeftPanelTab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  children: React.ReactNode;
  searchPlaceholder?: string;
  showSearch?: boolean;
  className?: string;
}

const PanelContainer = styled(motion.div)<{ $collapsed: boolean }>`
  display: flex;
  flex-direction: column;
  border: 1px solid rgb(var(--app-overlay-rgb) / 0.06);
  border-radius: ${radius['2xl']};
  overflow: hidden;
  ${({ $collapsed }) => $collapsed ? glassPanelSubtle : glassPanel}
`;

const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${Theme.usage.space.small};
  border-bottom: 1px solid rgb(var(--app-overlay-rgb) / 0.04);
`;

const HeaderTitle = styled.h3`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 600;
  color: ${colors.foreground};
`;

const CollapseButton = styled.button<{ $centered?: boolean }>`
  padding: ${Theme.usage.space.xSmall};
  border-radius: ${radius.lg};
  transition: background-color 150ms;
  color: ${colors.mutedForeground};
  ${({ $centered }) => $centered && 'margin: 0 auto;'}

  &:hover {
    background-color: rgb(var(--app-overlay-rgb) / 0.04);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const SearchContainer = styled.div`
  padding: ${Theme.usage.space.small};
  border-bottom: 1px solid rgb(var(--app-overlay-rgb) / 0.04);
`;

const SearchWrapper = styled.div`
  position: relative;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: ${Theme.usage.space.small};
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: ${colors.mutedForeground};
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small} ${Theme.usage.space.xSmall} ${Theme.usage.space.xxLarge};
  border-radius: ${radius.lg};
  font-size: ${Theme.usage.fontSize.xSmall};
  background: rgb(var(--app-surface-rgb) / 0.5);
  border: 1px solid rgb(var(--app-overlay-rgb) / 0.04);
  color: ${colors.foreground};
  transition: all 200ms;

  &::placeholder {
    color: ${colors.mutedForeground};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgb(var(--app-dd-primary-rgb) / 0.1);
    border-color: rgb(var(--app-dd-primary-rgb) / 0.4);
  }
`;

const TabsContainer = styled.div<{ $collapsed: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xxSmall};
  padding: ${Theme.usage.space.xSmall};
  ${({ $collapsed }) => $collapsed && 'align-items: center;'}
`;

const TabButton = styled.button<{ $active: boolean; $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
  padding: ${Theme.usage.space.small};
  border-radius: ${radius.lg};
  transition: all 200ms;
  position: relative;
  ${({ $collapsed }) => $collapsed && 'justify-content: center;'}

  ${({ $active }) =>
    $active
      ? `
    background-color: ${colors.accent};
    color: ${colors.foreground};
    box-shadow: ${shadows.sm};
  `
      : `
    color: ${colors.mutedForeground};
    &:hover {
      color: ${colors.foreground};
      background-color: rgb(var(--app-overlay-rgb) / 0.03);
    }
  `}

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

const TabLabel = styled(motion.span)`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  white-space: nowrap;
`;

const CollapsedTooltip = styled.div`
  position: absolute;
  left: 100%;
  margin-left: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.xxSmall} ${Theme.usage.space.xSmall};
  background: ${colors.foreground};
  color: ${colors.background};
  font-size: ${Theme.usage.fontSize.xxSmall};
  border-radius: ${Theme.usage.borderRadius.small};
  opacity: 0;
  pointer-events: none;
  white-space: nowrap;
  z-index: 50;
  transition: opacity 150ms;
`;

const TabButtonWrapper = styled.div`
  position: relative;
  &:hover ${CollapsedTooltip} {
    opacity: 1;
  }
`;

const ContentArea = styled(motion.div)`
  flex: 1;
  overflow: auto;
  padding: ${Theme.usage.space.small};
`;

export function LeftPanel({
  tabs,
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
  children,
  searchPlaceholder = 'Search...',
  showSearch = false,
}: LeftPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <PanelContainer
      $collapsed={collapsed}
      animate={{ width: collapsed ? 72 : 320 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
    >
      <HeaderBar>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ flex: 1 }}
          >
            <HeaderTitle>Navigation</HeaderTitle>
          </motion.div>
        )}
        <CollapseButton
          onClick={onToggleCollapse}
          $centered={collapsed}
          aria-label={collapsed ? 'Expand panel' : 'Collapse panel'}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </CollapseButton>
      </HeaderBar>

      {!collapsed && showSearch && (
        <SearchContainer>
          <SearchWrapper>
            <SearchIcon />
            <SearchInput
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
            />
          </SearchWrapper>
        </SearchContainer>
      )}

      <TabsContainer $collapsed={collapsed}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <TabButtonWrapper key={tab.key}>
              <TabButton
                $active={isActive}
                $collapsed={collapsed}
                onClick={() => onTabChange(tab.key)}
                title={collapsed ? tab.label : undefined}
              >
                <Icon />
                {!collapsed && (
                  <TabLabel
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {tab.label}
                  </TabLabel>
                )}
              </TabButton>
              {collapsed && <CollapsedTooltip>{tab.label}</CollapsedTooltip>}
            </TabButtonWrapper>
          );
        })}
      </TabsContainer>

      {!collapsed && (
        <ContentArea
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, delay: 0.05 }}
        >
          {children}
        </ContentArea>
      )}
    </PanelContainer>
  );
}
