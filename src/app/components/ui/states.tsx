import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Theme } from '@doordash/prism-react';
import { colors, radius } from '@/styles/theme';
import { Button } from './button';
import { AlertCircle, Loader2 } from 'lucide-react';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${Theme.usage.space.xxxLarge} ${Theme.usage.space.large};
  text-align: center;
  gap: ${Theme.usage.space.medium};
`;

const SpinnerIcon = styled(Loader2)`
  width: 32px;
  height: 32px;
  color: ${colors.mutedForeground};
  animation: ${spin} 1s linear infinite;
`;

const ErrorBox = styled.div`
  padding: ${Theme.usage.space.medium};
  border-radius: ${radius.lg};
  background-color: rgba(212, 24, 61, 0.1);
  color: ${colors.destructive};
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  font-size: ${Theme.usage.fontSize.xSmall};
`;

export function LoadingState({ message = 'Loading...' }: { message?: string; className?: string }) {
  return (
    <Container>
      <SpinnerIcon />
      <p style={{ color: colors.mutedForeground, fontSize: '14px' }}>{message}</p>
    </Container>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: React.ComponentType<any>;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}) {
  return (
    <Container>
      {Icon && <Icon style={{ width: '40px', height: '40px', color: colors.mutedForeground }} />}
      <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{title}</h3>
      {description && <p style={{ color: colors.mutedForeground, fontSize: '14px' }}>{description}</p>}
      {action && (
        <Button variant="outline" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Container>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <Container>
      <ErrorBox>
        <AlertCircle style={{ width: '20px', height: '20px' }} />
        {title}
      </ErrorBox>
      {description && <p style={{ color: colors.mutedForeground, fontSize: '14px' }}>{description}</p>}
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Retry
        </Button>
      )}
    </Container>
  );
}
