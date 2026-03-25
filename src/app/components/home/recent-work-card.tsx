import { motion } from 'framer-motion';
import { Clock, ChevronRight, type LucideIcon } from 'lucide-react';
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

interface RecentWorkCardProps {
  items: RecentWorkItem[];
  onItemClick?: (item: RecentWorkItem) => void;
}

const CardWrapper = styled(motion.div)`
  ${glassPanel}
  border-radius: ${radius['2xl']};
  padding: ${Theme.usage.space.large};
  border: 1px solid ${colors.border};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  margin-bottom: ${Theme.usage.space.medium};
`;

const Title = styled.h3`
  font-size: ${Theme.usage.fontSize.medium};
  font-weight: 600;
  color: ${colors.foreground};
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
`;

const ItemButton = styled(motion.button)`
  width: 100%;
  padding: ${Theme.usage.space.small};
  border-radius: ${radius.xl};
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

const IconBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${radius.lg};
  background: rgb(var(--app-muted-rgb) / 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
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
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ActionsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  flex-shrink: 0;
`;

export function RecentWorkCard({ items, onItemClick }: RecentWorkCardProps) {
  return (
    <CardWrapper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Header>
        <Clock style={{ width: 20, height: 20, color: colors.mutedForeground }} />
        <Title>Continue working</Title>
      </Header>

      <ItemList>
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <ItemButton
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onItemClick?.(item)}
            >
              <IconBox>
                <Icon style={{ width: 20, height: 20, color: colors.mutedForeground }} />
              </IconBox>
              <TextContent>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemMeta>{item.meta}</ItemMeta>
              </TextContent>
              <ActionsGroup>
                <Badge variant="secondary" style={{ fontSize: '12px' }}>
                  {item.status}
                </Badge>
                <ChevronRight style={{ width: 16, height: 16, color: colors.mutedForeground, transition: 'transform 0.2s' }} />
              </ActionsGroup>
            </ItemButton>
          );
        })}
      </ItemList>
    </CardWrapper>
  );
}
