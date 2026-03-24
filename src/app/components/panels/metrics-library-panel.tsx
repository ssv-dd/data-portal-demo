import styled from 'styled-components';
import { BarChart3, TrendingUp, Users, DollarSign, ShoppingCart } from 'lucide-react';
import { Theme } from '@doordash/prism-react';
import { colors, radius } from '@/styles/theme';
import type { LucideIcon } from 'lucide-react';

interface Metric {
  id: string;
  name: string;
  category: string;
  icon: LucideIcon;
  description?: string;
}

interface MetricsLibraryPanelProps {
  onMetricAdd?: (metric: Metric) => void;
}

const metrics: Metric[] = [
  {
    id: 'm1',
    name: 'Total Revenue',
    category: 'Financial',
    icon: DollarSign,
    description: 'Total revenue across all channels',
  },
  {
    id: 'm2',
    name: 'Active Users',
    category: 'Engagement',
    icon: Users,
    description: 'Monthly active users',
  },
  {
    id: 'm3',
    name: 'Conversion Rate',
    category: 'Sales',
    icon: TrendingUp,
    description: 'Overall conversion rate',
  },
  {
    id: 'm4',
    name: 'Order Volume',
    category: 'Operations',
    icon: ShoppingCart,
    description: 'Total number of orders',
  },
  {
    id: 'm5',
    name: 'Customer Satisfaction',
    category: 'Quality',
    icon: BarChart3,
    description: 'Average CSAT score',
  },
];

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
`;

const MetricButton = styled.button`
  width: 100%;
  padding: ${Theme.usage.space.small};
  border-radius: ${radius.lg};
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.small};
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 200ms;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: rgba(233, 235, 239, 0.6);
    border-color: rgba(0, 0, 0, 0.06);
  }
`;

const IconBox = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${radius.lg};
  background: linear-gradient(to bottom right, rgba(255, 58, 0, 0.2), rgba(168, 85, 247, 0.2));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const TextContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const MetricName = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.foreground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MetricCategory = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export function MetricsLibraryPanel({ onMetricAdd }: MetricsLibraryPanelProps) {
  return (
    <Container>
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <MetricButton
            key={metric.id}
            onClick={() => onMetricAdd?.(metric)}
          >
            <IconBox>
              <Icon style={{ width: '16px', height: '16px', color: colors.ddPrimary }} />
            </IconBox>
            <TextContent>
              <MetricName>{metric.name}</MetricName>
              <MetricCategory>{metric.category}</MetricCategory>
            </TextContent>
          </MetricButton>
        );
      })}
    </Container>
  );
}
