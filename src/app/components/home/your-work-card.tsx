import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ChevronRight, Plus, type LucideIcon } from 'lucide-react';
import { Badge } from '../ui/badge';
import styled from 'styled-components';
import { colors, radius, glassPanel, Theme } from '@/styles/theme';

export interface RecentWorkItem {
  id: string;
  title: string;
  meta: string;
  status: string;
  icon: LucideIcon;
  route: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  route?: string;
}

export type YourWorkVariant = 'A' | 'B' | 'C';

interface YourWorkCardProps {
  recentItems: RecentWorkItem[];
  quickActions: QuickAction[];
  onItemClick?: (item: RecentWorkItem) => void;
  onActionClick?: (action: QuickAction) => void;
  variant?: YourWorkVariant;
}

const iconStyleMap: Record<string, { bg: string; text: string }> = {
  '/dashboard/draft': { bg: 'var(--app-route-blue-bg)', text: 'var(--app-route-blue-text)' },
  '/dashboards': { bg: 'var(--app-route-blue-bg)', text: 'var(--app-route-blue-text)' },
  '/notebooks': { bg: 'var(--app-route-violet-bg)', text: 'var(--app-route-violet-text)' },
  '/ai-workflows': { bg: 'var(--app-route-amber-bg)', text: 'var(--app-route-amber-text)' },
  '/sql-studio': { bg: 'var(--app-route-emerald-bg)', text: 'var(--app-route-emerald-text)' },
};

const CardWrapper = styled(motion.div)`
  ${glassPanel}
  border-radius: ${radius['2xl']};
  padding: 20px;
  border: 1px solid ${colors.border};
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  margin-bottom: ${Theme.usage.space.small};
`;

const Title = styled.h3`
  font-size: ${Theme.usage.fontSize.medium};
  font-weight: 600;
  color: ${colors.foreground};
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

  &:hover {
    background: rgb(var(--app-accent-rgb) / 0.6);
    border-color: rgb(var(--app-overlay-rgb) / 0.06);
  }
`;

const IconBox = styled.div<{ $bg: string }>`
  width: 32px;
  height: 32px;
  border-radius: ${radius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ $bg }) => $bg};
`;

const TextContent = styled.div`
  flex: 1;
  text-align: left;
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

const ItemMeta = styled.p`
  font-size: 11px;
  color: ${colors.mutedForeground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SeeMoreBtn = styled.button`
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

const Divider = styled.div`
  width: 1px;
  background: rgb(var(--app-overlay-rgb) / 0.04);
  align-self: stretch;
`;

const HorizontalDivider = styled.div`
  border-top: 1px solid rgb(var(--app-overlay-rgb) / 0.04);
  padding-top: ${Theme.usage.space.small};
  margin-top: auto;
`;

const QuickCreateLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

const QuickCreateLabelText = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  color: ${colors.mutedForeground};
`;

const QuickActionBtn = styled.button<{ $size?: 'sm' | 'md' }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${Theme.usage.space.xxSmall};
  border-radius: ${radius.lg};
  position: relative;
  background: rgb(var(--app-surface-rgb) / 0.4);
  border: 1px solid rgb(var(--app-overlay-rgb) / 0.04);
  cursor: pointer;
  transition: all 0.2s;
  padding: ${({ $size }) => ($size === 'md' ? `${Theme.usage.space.small} ${Theme.usage.space.small}` : Theme.usage.space.xSmall)};

  &:hover {
    background: rgb(var(--app-accent-rgb) / 0.6);
    border-color: rgb(var(--app-overlay-rgb) / 0.06);
  }
`;

const QuickActionLabel = styled.span<{ $size?: 'sm' | 'md' }>`
  font-weight: 500;
  color: ${colors.foreground};
  font-size: ${({ $size }) => ($size === 'md' ? Theme.usage.fontSize.xSmall : Theme.usage.fontSize.xxSmall)};
`;

const SideQuickActionBtn = styled.button`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.small} ${Theme.usage.space.small};
  border-radius: ${radius.lg};
  width: 100%;
  background: rgb(var(--app-surface-rgb) / 0.4);
  border: 1px solid rgb(var(--app-overlay-rgb) / 0.04);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgb(var(--app-accent-rgb) / 0.6);
    border-color: rgb(var(--app-overlay-rgb) / 0.06);
  }
`;

function RecentItemRow({ item, index, onItemClick }: { item: RecentWorkItem; index: number; onItemClick?: (item: RecentWorkItem) => void }) {
  const Icon = item.icon;
  const style = iconStyleMap[item.route] || { bg: 'rgb(var(--app-muted-rgb) / 0.6)', text: colors.mutedForeground };
  return (
    <ItemButton
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={() => onItemClick?.(item)}
    >
      <IconBox $bg={style.bg}>
        <Icon style={{ width: 16, height: 16, color: style.text }} />
      </IconBox>
      <TextContent>
        <ItemTitle>{item.title}</ItemTitle>
        <ItemMeta>{item.meta}</ItemMeta>
      </TextContent>
      <Badge variant="secondary" style={{ fontSize: 10, padding: '2px 4px', flexShrink: 0 }}>
        {item.status}
      </Badge>
      <ChevronRight style={{ width: 14, height: 14, color: 'rgb(var(--app-muted-fg-rgb) / 0.5)', flexShrink: 0, transition: 'transform 0.2s' }} />
    </ItemButton>
  );
}

function VariantA({ recentItems, onItemClick }: YourWorkCardProps) {
  const defaultCount = 4;
  const [showAll, setShowAll] = useState(false);
  const visibleItems = showAll ? recentItems : recentItems.slice(0, defaultCount);
  const hasMore = recentItems.length > defaultCount;

  return (
    <>
      <Header>
        <Clock style={{ width: 20, height: 20, color: colors.mutedForeground }} />
        <Title>Jump back in</Title>
      </Header>
      <ItemList>
        {visibleItems.map((item, index) => (
          <RecentItemRow key={item.id} item={item} index={index} onItemClick={onItemClick} />
        ))}
      </ItemList>
      {hasMore && (
        <SeeMoreBtn onClick={() => setShowAll(!showAll)}>
          {showAll ? 'See less' : 'See more'}
        </SeeMoreBtn>
      )}
    </>
  );
}

function VariantB({ recentItems, quickActions, onItemClick, onActionClick }: YourWorkCardProps) {
  return (
    <>
      <Header>
        <Clock style={{ width: 20, height: 20, color: colors.mutedForeground }} />
        <Title>Jump back in</Title>
      </Header>
      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {recentItems.map((item, index) => (
            <RecentItemRow key={item.id} item={item} index={index} onItemClick={onItemClick} />
          ))}
        </div>
        <Divider />
        <div style={{ width: 140, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <QuickCreateLabel>
            <Plus style={{ width: 14, height: 14, color: colors.mutedForeground }} />
            <QuickCreateLabelText>Quick create</QuickCreateLabelText>
          </QuickCreateLabel>
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <SideQuickActionBtn
                key={action.id}
                onClick={() => onActionClick?.(action)}
              >
                <Icon style={{ width: 16, height: 16, color: colors.mutedForeground, transition: 'color 0.2s' }} />
                <span style={{ fontSize: '14px', fontWeight: 500, color: colors.foreground }}>{action.label}</span>
              </SideQuickActionBtn>
            );
          })}
        </div>
      </div>
    </>
  );
}

function VariantC({ recentItems, quickActions, onItemClick, onActionClick }: YourWorkCardProps) {
  return (
    <>
      <Header>
        <Clock style={{ width: 20, height: 20, color: colors.mutedForeground }} />
        <Title>Jump back in</Title>
      </Header>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>
        {recentItems.map((item, index) => (
          <RecentItemRow key={item.id} item={item} index={index} onItemClick={onItemClick} />
        ))}
      </div>
      <HorizontalDivider>
        <QuickCreateLabel style={{ marginBottom: '8px' }}>
          <Plus style={{ width: 14, height: 14, color: colors.mutedForeground }} />
          <QuickCreateLabelText>Quick create</QuickCreateLabelText>
        </QuickCreateLabel>
        <div style={{ display: 'flex', gap: '8px' }}>
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <QuickActionBtn key={action.id} onClick={() => onActionClick?.(action)}>
                <div style={{ position: 'relative' }}>
                  <Icon style={{ width: 16, height: 16, color: colors.mutedForeground, transition: 'color 0.2s' }} />
                  <Plus style={{ width: 10, height: 10, position: 'absolute', top: -4, right: -6, color: colors.violet500 }} />
                </div>
                <QuickActionLabel>{action.label}</QuickActionLabel>
              </QuickActionBtn>
            );
          })}
        </div>
      </HorizontalDivider>
    </>
  );
}

export function YourWorkCard({ recentItems, quickActions, onItemClick, onActionClick, variant = 'A' }: YourWorkCardProps) {
  return (
    <CardWrapper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {variant === 'A' && <VariantA recentItems={recentItems} quickActions={quickActions} onItemClick={onItemClick} onActionClick={onActionClick} />}
      {variant === 'B' && <VariantB recentItems={recentItems} quickActions={quickActions} onItemClick={onItemClick} onActionClick={onActionClick} />}
      {variant === 'C' && <VariantC recentItems={recentItems} quickActions={quickActions} onItemClick={onItemClick} onActionClick={onActionClick} />}
    </CardWrapper>
  );
}
