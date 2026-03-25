import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import styled from 'styled-components';
import { Theme } from '@doordash/prism-react';
import { colors, radius } from '@/styles/theme';

interface MetricWidgetProps {
  title: string;
  value: string;
  change?: number;
  trend?: 'up' | 'down';
  points?: number[];
  className?: string;
}

const WidgetWrapper = styled(motion.div)`
  padding: ${Theme.usage.space.medium};
  border-radius: ${radius.xl};
  background: rgb(var(--app-surface-rgb) / 0.4);
  border: 1px solid rgb(var(--app-overlay-rgb) / 0.04);
`;

const WidgetTitle = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  margin-bottom: ${Theme.usage.space.xSmall};
`;

const ContentRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const ValueText = styled.p`
  font-size: ${Theme.usage.fontSize.xxLarge};
  font-weight: 600;
  color: ${colors.foreground};
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

const ChangeRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
`;

const ChangeText = styled.span<{ $positive: boolean }>`
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  color: ${({ $positive }) => ($positive ? '#22c55e' : '#ef4444')};
`;

export function MetricWidget({
  title,
  value,
  change,
  trend,
  points = [],
  className,
}: MetricWidgetProps) {
  const isPositive = trend === 'up' || (change !== undefined && change > 0);

  const renderSparkline = () => {
    if (points.length === 0) return null;

    const width = 80;
    const height = 24;
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min || 1;

    const pathData = points
      .map((point, i) => {
        const x = (i / (points.length - 1)) * width;
        const y = height - ((point - min) / range) * height;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');

    return (
      <svg width={width} height={height} style={{ opacity: 0.6 }}>
        <path
          d={pathData}
          fill="none"
          stroke={isPositive ? '#22c55e' : '#ef4444'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <WidgetWrapper
      className={className}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <WidgetTitle>{title}</WidgetTitle>
      <ContentRow>
        <div>
          <ValueText>{value}</ValueText>
          {change !== undefined && (
            <ChangeRow>
              {isPositive ? (
                <TrendingUp style={{ width: 12, height: 12, color: '#22c55e' }} />
              ) : (
                <TrendingDown style={{ width: 12, height: 12, color: '#ef4444' }} />
              )}
              <ChangeText $positive={isPositive}>
                {change > 0 ? '+' : ''}
                {change}%
              </ChangeText>
            </ChangeRow>
          )}
        </div>
        {renderSparkline()}
      </ContentRow>
    </WidgetWrapper>
  );
}
