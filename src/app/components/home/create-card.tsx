import { motion } from 'motion/react';
import { Plus, type LucideIcon } from 'lucide-react';
import styled from 'styled-components';
import { colors, radius, glassPanel, Theme } from '@/styles/theme';

export interface CreateAction {
  id: string;
  label: string;
  icon: LucideIcon;
  route?: string;
  gradient?: string;
}

interface CreateCardProps {
  actions: CreateAction[];
  onActionClick?: (action: CreateAction) => void;
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

const HeaderIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${radius.lg};
  background: linear-gradient(to bottom right, rgb(var(--app-violet-rgb) / 0.15), rgb(var(--app-cyan-rgb) / 0.15));
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h3`
  font-size: ${Theme.usage.fontSize.medium};
  font-weight: 600;
  color: ${colors.foreground};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${Theme.usage.space.small};
`;

const ActionButton = styled(motion.button)`
  padding: ${Theme.usage.space.medium};
  border-radius: ${radius.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${Theme.usage.space.xSmall};
  background: rgb(var(--app-surface-rgb) / 0.4);
  border: 1px solid rgb(var(--app-overlay-rgb) / 0.04);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgb(var(--app-accent-rgb) / 0.6);
    border-color: rgb(var(--app-overlay-rgb) / 0.06);
    box-shadow: 0 1px 2px 0 rgb(var(--app-overlay-rgb) / 0.05);
  }
`;

const ActionIconBox = styled.div<{ $gradient?: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${radius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $gradient }) =>
    $gradient || 'linear-gradient(to bottom right, rgb(var(--app-violet-rgb) / 0.2), rgb(var(--app-cyan-rgb) / 0.2))'};
`;

const ActionLabel = styled.span`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.foreground};
  text-align: center;
`;

export function CreateCard({ actions, onActionClick }: CreateCardProps) {
  return (
    <CardWrapper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
    >
      <Header>
        <HeaderIcon>
          <Plus style={{ width: 20, height: 20, color: colors.violet600 }} />
        </HeaderIcon>
        <Title>Quick create</Title>
      </Header>

      <Grid>
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <ActionButton
              key={action.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onActionClick?.(action)}
            >
              <ActionIconBox $gradient={action.gradient}>
                <Icon style={{ width: 24, height: 24, color: colors.violet600, transition: 'transform 0.2s' }} />
              </ActionIconBox>
              <ActionLabel>{action.label}</ActionLabel>
            </ActionButton>
          );
        })}
      </Grid>
    </CardWrapper>
  );
}
