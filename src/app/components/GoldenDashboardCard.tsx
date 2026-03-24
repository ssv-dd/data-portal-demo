import styled from 'styled-components';
import { Card } from './ui/card';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { Theme } from '@doordash/prism-react';
import { colors, radius, shadows } from '@/styles/theme';

export interface GoldenDashboard {
  id: string;
  title: string;
  description: string;
  chartType: 'line' | 'area' | 'bar';
  data: Array<Record<string, unknown>>;
  dataKey: string;
  color: string;
}

interface GoldenDashboardCardProps {
  dashboard: GoldenDashboard;
  onClick?: () => void;
  compact?: boolean;
}

const DashboardTitle = styled.h3<{ $compact: boolean }>`
  font-size: ${({ $compact }) => ($compact ? Theme.usage.fontSize.xSmall : Theme.usage.fontSize.small)};
  font-weight: ${({ $compact }) => ($compact ? '400' : '600')};
  margin-bottom: ${Theme.usage.space.xxSmall};
  transition: color 150ms;
`;

const Description = styled.p<{ $compact: boolean }>`
  font-size: ${({ $compact }) => ($compact ? Theme.usage.fontSize.xxSmall : Theme.usage.fontSize.xSmall)};
  color: ${colors.mutedForeground};
`;

const StyledCard = styled(Card)<{ $compact: boolean }>`
  padding: ${({ $compact }) => ($compact ? Theme.usage.space.medium : Theme.usage.space.large)};
  transition: all 200ms;
  cursor: pointer;
  border-width: ${({ $compact }) => ($compact ? '1px' : '2px')};

  &:hover {
    box-shadow: ${shadows.cardHover};
    border-color: ${({ $compact }) =>
      $compact ? 'rgb(var(--app-purple-rgb) / 0.3)' : 'rgb(var(--app-purple-rgb) / 0.5)'};
  }

  &:hover ${DashboardTitle} {
    color: ${colors.purple600};
  }
`;

const ContentWrapper = styled.div<{ $compact: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $compact }) => ($compact ? Theme.usage.space.xSmall : Theme.usage.space.medium)};
`;

const ChartThumbnail = styled.div<{ $compact: boolean }>`
  width: 100%;
  background: linear-gradient(to bottom right, ${colors.purple50}, var(--app-status-info-bg));
  border-radius: ${radius.lg};
  overflow: hidden;
  height: ${({ $compact }) => ($compact ? '100px' : '160px')};
`;

export function GoldenDashboardCard({ dashboard, onClick, compact = false }: GoldenDashboardCardProps) {
  const renderChart = () => {
    const chartProps = {
      data: dashboard.data,
      margin: { top: 5, right: 5, left: 5, bottom: 5 }
    };

    switch (dashboard.chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart {...chartProps}>
              <Line 
                type="monotone" 
                dataKey={dashboard.dataKey} 
                stroke={dashboard.color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart {...chartProps}>
              <Area 
                type="monotone" 
                dataKey={dashboard.dataKey} 
                fill={dashboard.color}
                fillOpacity={0.6}
                stroke={dashboard.color}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart {...chartProps}>
              <Bar dataKey={dashboard.dataKey} fill={dashboard.color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <StyledCard $compact={compact} onClick={onClick}>
      <ContentWrapper $compact={compact}>
        <div>
          <DashboardTitle $compact={compact}>
            {dashboard.title}
          </DashboardTitle>
          <Description $compact={compact}>{dashboard.description}</Description>
        </div>
        
        <ChartThumbnail $compact={compact}>
          {renderChart()}
        </ChartThumbnail>
      </ContentWrapper>
    </StyledCard>
  );
}
