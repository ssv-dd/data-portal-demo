import React from 'react';
import styled from 'styled-components';
import {
  BarChart3,
  TrendingUp,
  Circle,
  PieChart,
  Hash,
  Table2,
} from 'lucide-react';
import { colors, radius, Theme } from '@/styles/theme';
import type { ChartType } from '@/types';

interface ChartTypeLibraryProps {
  activeType: ChartType;
  onTypeSelect: (type: ChartType) => void;
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  padding: ${Theme.usage.space.xSmall};
`;

const TypeButton = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 4px;
  border-radius: ${radius.sm};
  border: ${({ $active }) => ($active ? '2px solid #FF3A00' : '2px solid transparent')};
  background: ${({ $active }) =>
    $active ? 'rgba(255, 58, 0, 0.06)' : 'rgb(var(--app-muted-rgb) / 0.3)'};
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;

  &:hover {
    border-color: ${({ $active }) => ($active ? '#FF3A00' : colors.border)};
    background: ${({ $active }) =>
      $active ? 'rgba(255, 58, 0, 0.08)' : 'rgb(var(--app-muted-rgb) / 0.5)'};
  }
`;

const TypeLabel = styled.span<{ $active: boolean }>`
  font-size: 9px;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  color: ${({ $active }) => ($active ? '#FF3A00' : colors.mutedForeground)};
  text-align: center;
  line-height: 1.2;
`;

// BarChart2 horizontal — inline SVG fallback since lucide doesn't export BarChartHorizontal directly
function BarChartHorizontalIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="6" x2="3" y2="18" />
      <rect x="3" y="5" width="12" height="4" rx="1" />
      <rect x="3" y="10" width="18" height="4" rx="1" />
      <rect x="3" y="15" width="8" height="4" rx="1" />
    </svg>
  );
}

function AreaChartIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M3 15l4-5 4 3 4-6 4 4" />
      <path d="M3 15l4-5 4 3 4-6 4 4V21H3z" fill="currentColor" opacity="0.15" stroke="none" />
    </svg>
  );
}

const CHART_TYPES: { type: ChartType; label: string; Icon: React.ElementType }[] = [
  { type: 'column', label: 'Column', Icon: BarChart3 },
  { type: 'bar', label: 'Bar', Icon: BarChartHorizontalIcon },
  { type: 'line', label: 'Line', Icon: TrendingUp },
  { type: 'area', label: 'Area', Icon: AreaChartIcon },
  { type: 'scatter', label: 'Scatter', Icon: Circle },
  { type: 'donut', label: 'Donut', Icon: PieChart },
  { type: 'kpi', label: 'KPI', Icon: Hash },
  { type: 'table', label: 'Table', Icon: Table2 },
];

export function ChartTypeLibrary({ activeType, onTypeSelect }: ChartTypeLibraryProps) {
  return (
    <Grid>
      {CHART_TYPES.map(({ type, label, Icon }) => {
        const isActive = activeType === type;
        return (
          <TypeButton key={type} $active={isActive} onClick={() => onTypeSelect(type)} title={label}>
            <Icon
              size={16}
              style={{
                color: isActive ? '#FF3A00' : colors.mutedForeground,
              }}
            />
            <TypeLabel $active={isActive}>{label}</TypeLabel>
          </TypeButton>
        );
      })}
    </Grid>
  );
}
