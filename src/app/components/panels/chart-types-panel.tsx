import styled from 'styled-components';
import { BarChart3, TrendingUp, PieChart, Activity, AreaChart } from 'lucide-react';
import { Theme } from '@doordash/prism-react';
import { colors, radius } from '@/styles/theme';
import type { LucideIcon } from 'lucide-react';
import type { WidgetConfig } from '@/types';

interface ChartType {
  type: WidgetConfig['type'];
  name: string;
  description: string;
  icon: LucideIcon;
}

interface ChartTypesPanelProps {
  onChartTypeSelect: (type: WidgetConfig['type']) => void;
}

const chartTypes: ChartType[] = [
  { type: 'bar', name: 'Bar Chart', description: 'Compare values across categories', icon: BarChart3 },
  { type: 'line', name: 'Line Chart', description: 'Track trends over time', icon: TrendingUp },
  { type: 'area', name: 'Area Chart', description: 'Show volume and magnitude', icon: AreaChart },
  { type: 'pie', name: 'Pie Chart', description: 'Show composition and proportions', icon: PieChart },
  { type: 'kpi', name: 'KPI Card', description: 'Display a single key metric', icon: Activity },
];

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
`;

const ChartButton = styled.button`
  width: 100%;
  padding: ${Theme.usage.space.small};
  border-radius: ${radius.lg};
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.small};
  background: rgb(var(--app-surface-rgb) / 0.4);
  border: 1px solid rgb(var(--app-overlay-rgb) / 0.04);
  transition: all 200ms;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: rgb(var(--app-accent-rgb) / 0.6);
    border-color: rgb(var(--app-overlay-rgb) / 0.06);
  }
`;

const IconBox = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${radius.lg};
  background: linear-gradient(to bottom right, rgb(var(--app-dd-primary-rgb) / 0.2), rgb(var(--app-purple-rgb) / 0.2));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const TextContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ChartName = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.foreground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ChartDescription = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export function ChartTypesPanel({ onChartTypeSelect }: ChartTypesPanelProps) {
  return (
    <Container>
      {chartTypes.map((chart) => {
        const Icon = chart.icon;
        return (
          <ChartButton
            key={chart.type}
            onClick={() => onChartTypeSelect(chart.type)}
          >
            <IconBox>
              <Icon style={{ width: '16px', height: '16px', color: colors.ddPrimary }} />
            </IconBox>
            <TextContent>
              <ChartName>{chart.name}</ChartName>
              <ChartDescription>{chart.description}</ChartDescription>
            </TextContent>
          </ChartButton>
        );
      })}
    </Container>
  );
}
