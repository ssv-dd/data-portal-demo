import { motion } from 'motion/react';
import { useState } from 'react';
import { Users, TrendingUp, Zap, ChevronRight, type LucideIcon } from 'lucide-react';
import styled from 'styled-components';
import { colors, radius, shadows, glassPanel, Theme } from '@/styles/theme';

export interface DiscoveryItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: string;
  route?: string;
}

interface DiscoveryCardProps {
  team: DiscoveryItem[];
  trending: DiscoveryItem[];
  recent: DiscoveryItem[];
  onItemClick?: (item: DiscoveryItem) => void;
}

type TabKey = 'team' | 'trending' | 'recent';

const tabs = [
  { key: 'team' as TabKey, label: 'Your team', icon: Users },
  { key: 'trending' as TabKey, label: 'Trending', icon: TrendingUp },
  { key: 'recent' as TabKey, label: 'Recently published', icon: Zap },
];

const CardWrapper = styled(motion.div)`
  ${glassPanel}
  border-radius: ${radius['2xl']};
  padding: 20px;
  border: 1px solid ${colors.border};
  display: flex;
  flex-direction: column;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${Theme.usage.space.xSmall};
`;

const Title = styled.h3`
  font-size: ${Theme.usage.fontSize.medium};
  font-weight: 600;
  color: ${colors.foreground};
`;

const TabGroup = styled.div`
  display: flex;
  gap: ${Theme.usage.space.xxxSmall};
  padding: ${Theme.usage.space.xxxSmall};
  background: rgb(var(--app-muted-rgb) / 0.4);
  border-radius: ${radius.lg};
`;

const TabButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
  padding: ${Theme.usage.space.xxSmall} ${Theme.usage.space.small};
  border-radius: ${radius.md};
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  background: ${({ $active }) => ($active ? colors.background : 'transparent')};
  color: ${({ $active }) => ($active ? colors.foreground : colors.mutedForeground)};
  box-shadow: ${({ $active }) => ($active ? shadows.sm : 'none')};

  &:hover {
    color: ${colors.foreground};
  }
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xxSmall};
`;

const ItemButton = styled(motion.button)`
  width: 100%;
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
  border-radius: ${radius.lg};
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
  background: rgb(var(--app-surface-rgb) / 0.4);
  border: 1px solid rgb(var(--app-overlay-rgb) / 0.04);
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    background: rgb(var(--app-accent-rgb) / 0.6);
    border-color: rgb(var(--app-overlay-rgb) / 0.06);
  }
`;

const ItemIconBox = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${radius.md};
  background: linear-gradient(to bottom right, rgb(var(--app-violet-rgb) / 0.2), rgb(var(--app-cyan-rgb) / 0.2));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ItemTextContent = styled.div`
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

const ItemDescription = styled.p`
  font-size: 11px;
  color: ${colors.mutedForeground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CategoryBadge = styled.span`
  padding: ${Theme.usage.space.xxxSmall} ${Theme.usage.space.xxSmall};
  font-size: 10px;
  border-radius: ${radius.md};
  background: rgb(var(--app-muted-rgb) / 0.6);
  color: ${colors.mutedForeground};
  flex-shrink: 0;
`;

const SeeMoreButton = styled.button`
  margin-top: ${Theme.usage.space.xSmall};
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  color: ${colors.violet600};
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: color 0.2s;

  &:hover {
    color: ${colors.violet700};
  }
`;

export function DiscoveryCard({
  team,
  trending,
  recent,
  onItemClick,
}: DiscoveryCardProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('team');
  const defaultCount = 4;
  const [showAll, setShowAll] = useState(false);

  const getAllItems = () => {
    switch (activeTab) {
      case 'team':
        return team;
      case 'trending':
        return trending;
      case 'recent':
        return recent;
    }
  };

  const allItems = getAllItems();
  const items = showAll ? allItems : allItems.slice(0, defaultCount);
  const hasMore = allItems.length > defaultCount;

  return (
    <CardWrapper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <HeaderRow>
        <Title>Trending in your org</Title>
        <TabGroup>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabButton
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setShowAll(false); }}
                $active={activeTab === tab.key}
              >
                <Icon style={{ width: 14, height: 14 }} />
                {tab.label}
              </TabButton>
            );
          })}
        </TabGroup>
      </HeaderRow>

      <ItemList>
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <ItemButton
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onItemClick?.(item)}
            >
              <ItemIconBox>
                <Icon style={{ width: 16, height: 16, color: colors.violet600 }} />
              </ItemIconBox>
              <ItemTextContent>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemDescription>{item.description}</ItemDescription>
              </ItemTextContent>
              <CategoryBadge>{item.category}</CategoryBadge>
              <ChevronRight style={{ width: 14, height: 14, color: 'rgb(var(--app-muted-fg-rgb) / 0.5)', flexShrink: 0, transition: 'transform 0.2s' }} />
            </ItemButton>
          );
        })}
      </ItemList>

      {hasMore && (
        <SeeMoreButton onClick={() => setShowAll(!showAll)}>
          {showAll ? 'See less' : 'See more'}
        </SeeMoreButton>
      )}
    </CardWrapper>
  );
}
