import styled from 'styled-components';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { colors, radius, Theme } from '@/styles/theme';
import type { ChartBuilderField, ChartType } from '@/types';

interface ChartPreviewProps {
  chartType: ChartType;
  data: any[];
  measures: ChartBuilderField[];
  dimensions: ChartBuilderField[];
  dateField: ChartBuilderField | null;
  kpiData?: { kpiValue: string; kpiChange: string; kpiTrend: 'up' | 'down' | 'flat' };
}

const COLORS = ['#FF3A00', '#4ade80', '#60a5fa', '#facc15', '#a78bfa'];

const PreviewContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${Theme.usage.space.xSmall};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${Theme.usage.space.xSmall};
  text-align: center;
  height: 100%;
  padding: ${Theme.usage.space.large};
`;

const EmptyIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${radius.lg};
  background: rgb(var(--app-muted-rgb) / 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyText = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
  max-width: 200px;
`;

const KpiContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${Theme.usage.space.xSmall};
  height: 100%;
  text-align: center;
`;

const KpiLabel = styled.span`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
  font-weight: 500;
`;

const KpiValue = styled.span`
  font-size: 48px;
  font-weight: 700;
  color: ${colors.foreground};
  line-height: 1;
`;

const KpiChange = styled.span<{ $trend: 'up' | 'down' | 'flat' }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: ${Theme.usage.fontSize.small};
  font-weight: 600;
  color: ${({ $trend }) =>
    $trend === 'up' ? '#4ade80' : $trend === 'down' ? '#f87171' : colors.mutedForeground};
`;

const TableWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${Theme.usage.fontSize.xSmall};
`;

const Thead = styled.thead`
  background: rgb(var(--app-muted-rgb) / 0.4);
  position: sticky;
  top: 0;
`;

const Th = styled.th`
  padding: 8px 12px;
  text-align: left;
  font-weight: 600;
  color: ${colors.mutedForeground};
  border-bottom: 1px solid ${colors.border};
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 6px 12px;
  color: ${colors.foreground};
  border-bottom: 1px solid ${colors.border};
  white-space: nowrap;
`;

const Tr = styled.tr`
  &:hover td {
    background: rgb(var(--app-muted-rgb) / 0.2);
  }
`;

const tooltipStyle = {
  backgroundColor: 'var(--app-card)',
  border: '1px solid var(--app-border)',
  borderRadius: '8px',
  fontSize: '12px',
};

function getXAxisKey(data: any[], dimensions: ChartBuilderField[], dateField: ChartBuilderField | null): string {
  if (dimensions[0]?.name && data[0]?.[dimensions[0].name] !== undefined) {
    return dimensions[0].name;
  }
  if (dateField?.name && data[0]?.[dateField.name] !== undefined) {
    return dateField.name;
  }
  // fallback to first key
  return data[0] ? Object.keys(data[0])[0] : 'x';
}

function EmptyPlaceholder({ message = 'Select at least one measure to preview' }: { message?: string }) {
  return (
    <EmptyState>
      <EmptyIcon>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--app-muted-fg)' }}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      </EmptyIcon>
      <EmptyText>{message}</EmptyText>
    </EmptyState>
  );
}

export function ChartPreview({
  chartType,
  data,
  measures,
  dimensions,
  dateField,
  kpiData,
}: ChartPreviewProps) {
  const hasMeasures = measures.length > 0;
  const hasData = data.length > 0;

  if (chartType === 'kpi') {
    if (!hasMeasures) return <PreviewContainer><EmptyPlaceholder /></PreviewContainer>;
    const displayKpi = kpiData ?? { kpiValue: '—', kpiChange: '0%', kpiTrend: 'flat' as const };
    const TrendIcon =
      displayKpi.kpiTrend === 'up'
        ? TrendingUp
        : displayKpi.kpiTrend === 'down'
        ? TrendingDown
        : Minus;
    return (
      <PreviewContainer>
        <KpiContainer>
          <KpiLabel>{measures[0]?.name ?? 'KPI'}</KpiLabel>
          <KpiValue>{displayKpi.kpiValue}</KpiValue>
          <KpiChange $trend={displayKpi.kpiTrend}>
            <TrendIcon style={{ width: 16, height: 16 }} />
            {displayKpi.kpiChange} vs prior period
          </KpiChange>
        </KpiContainer>
      </PreviewContainer>
    );
  }

  if (chartType === 'table') {
    if (!hasMeasures || !hasData) return <PreviewContainer><EmptyPlaceholder /></PreviewContainer>;
    const allColumns = Object.keys(data[0]);
    return (
      <TableWrapper>
        <StyledTable>
          <Thead>
            <tr>
              {allColumns.map((col) => (
                <Th key={col}>{col}</Th>
              ))}
            </tr>
          </Thead>
          <tbody>
            {data.map((row, i) => (
              <Tr key={i}>
                {allColumns.map((col) => (
                  <Td key={col}>
                    {typeof row[col] === 'number'
                      ? Number(row[col]).toLocaleString()
                      : String(row[col] ?? '')}
                  </Td>
                ))}
              </Tr>
            ))}
          </tbody>
        </StyledTable>
      </TableWrapper>
    );
  }

  if (!hasMeasures || !hasData) {
    return <PreviewContainer><EmptyPlaceholder /></PreviewContainer>;
  }

  const xKey = getXAxisKey(data, dimensions, dateField);

  if (chartType === 'column') {
    return (
      <PreviewContainer>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--app-border)" />
            <XAxis dataKey={xKey} tick={{ fontSize: 10, fill: 'var(--app-muted-fg)' }} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--app-muted-fg)' }} />
            <Tooltip contentStyle={tooltipStyle} />
            {measures.map((m, i) => (
              <Bar key={m.id} dataKey={m.name} fill={COLORS[i % COLORS.length]} radius={[3, 3, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </PreviewContainer>
    );
  }

  if (chartType === 'bar') {
    return (
      <PreviewContainer>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={data} margin={{ top: 8, right: 8, bottom: 8, left: 48 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--app-border)" />
            <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--app-muted-fg)' }} />
            <YAxis dataKey={xKey} type="category" tick={{ fontSize: 10, fill: 'var(--app-muted-fg)' }} width={80} />
            <Tooltip contentStyle={tooltipStyle} />
            {measures.map((m, i) => (
              <Bar key={m.id} dataKey={m.name} fill={COLORS[i % COLORS.length]} radius={[0, 3, 3, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </PreviewContainer>
    );
  }

  if (chartType === 'line') {
    return (
      <PreviewContainer>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--app-border)" />
            <XAxis dataKey={xKey} tick={{ fontSize: 10, fill: 'var(--app-muted-fg)' }} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--app-muted-fg)' }} />
            <Tooltip contentStyle={tooltipStyle} />
            {measures.map((m, i) => (
              <Line
                key={m.id}
                type="monotone"
                dataKey={m.name}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </PreviewContainer>
    );
  }

  if (chartType === 'area') {
    return (
      <PreviewContainer>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <defs>
              {measures.map((m, i) => (
                <linearGradient key={m.id} id={`grad-${m.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--app-border)" />
            <XAxis dataKey={xKey} tick={{ fontSize: 10, fill: 'var(--app-muted-fg)' }} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--app-muted-fg)' }} />
            <Tooltip contentStyle={tooltipStyle} />
            {measures.map((m, i) => (
              <Area
                key={m.id}
                type="monotone"
                dataKey={m.name}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={2}
                fill={`url(#grad-${m.id})`}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </PreviewContainer>
    );
  }

  if (chartType === 'scatter') {
    const xMeasure = measures[0];
    const yMeasure = measures[1] ?? measures[0];
    const scatterData = data.map((row) => ({
      x: row[xMeasure.name] ?? 0,
      y: row[yMeasure.name] ?? 0,
    }));
    return (
      <PreviewContainer>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--app-border)" />
            <XAxis
              type="number"
              dataKey="x"
              name={xMeasure.name}
              tick={{ fontSize: 10, fill: 'var(--app-muted-fg)' }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name={yMeasure.name}
              tick={{ fontSize: 10, fill: 'var(--app-muted-fg)' }}
            />
            <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={scatterData} fill={COLORS[0]} />
          </ScatterChart>
        </ResponsiveContainer>
      </PreviewContainer>
    );
  }

  if (chartType === 'donut' || chartType === 'pie') {
    const firstMeasure = measures[0];
    const pieData = data.map((row) => ({
      name: row[xKey] ?? 'Unknown',
      value: Number(row[firstMeasure.name] ?? 0),
    }));
    return (
      <PreviewContainer>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip contentStyle={tooltipStyle} />
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={chartType === 'donut' ? 60 : 0}
              outerRadius={90}
              paddingAngle={2}
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </PreviewContainer>
    );
  }

  return <PreviewContainer><EmptyPlaceholder message="Unknown chart type" /></PreviewContainer>;
}
