import styled from 'styled-components';
import { GripVertical, MoreVertical, Trash2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Theme } from '@doordash/prism-react';
import { colors, glassPanel, radius } from '@/styles/theme';
import type { WidgetConfig } from '@/types';
import { COLORS } from '@/app/data/mock/dashboard-canvas-data';
import { useState, useRef, useEffect } from 'react';

interface ChartCardProps {
  widget: WidgetConfig;
  onRemove?: (widgetId: string) => void;
}

const CardContainer = styled.div`
  ${glassPanel}
  border: 1px solid ${colors.border};
  border-radius: ${radius['2xl']};
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${Theme.usage.space.medium} ${Theme.usage.space.medium} ${Theme.usage.space.xSmall};
`;

const TitleArea = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  min-width: 0;
`;

const GripHandle = styled.div`
  cursor: grab;
  color: rgb(var(--app-muted-fg-rgb) / 0.4);
  opacity: 0;
  transition: opacity 200ms;
  display: flex;
  align-items: center;

  ${CardContainer}:hover & {
    opacity: 1;
  }
`;

const TitleText = styled.div`
  min-width: 0;
`;

const Title = styled.h4`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.foreground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Subtitle = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MenuWrapper = styled.div`
  position: relative;
`;

const MenuButton = styled.button`
  color: rgb(var(--app-muted-fg-rgb) / 0.4);
  opacity: 0;
  transition: opacity 200ms;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: ${radius.sm};

  &:hover {
    color: ${colors.mutedForeground};
    background: rgb(var(--app-overlay-rgb) / 0.06);
  }

  ${CardContainer}:hover & {
    opacity: 1;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  z-index: 50;
  background: ${colors.background};
  border: 1px solid ${colors.border};
  border-radius: ${radius.lg};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 4px;
  min-width: 140px;
`;

const DropdownItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
  border: none;
  background: none;
  cursor: pointer;
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.foreground};
  border-radius: ${radius.sm};

  &:hover {
    background: rgb(var(--app-overlay-rgb) / 0.06);
  }
`;

const ChartArea = styled.div<{ $isKpi?: boolean }>`
  flex: 1;
  padding: ${({ $isKpi }) => $isKpi ? `0 ${Theme.usage.space.medium} ${Theme.usage.space.medium}` : `0 ${Theme.usage.space.xSmall} ${Theme.usage.space.small}`};
  min-height: 0;
`;

const KpiContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`;

const KpiValue = styled.div`
  font-size: ${Theme.usage.fontSize.xxxLarge};
  font-weight: 700;
  color: ${colors.foreground};
  margin-bottom: ${Theme.usage.space.xSmall};
`;

const KpiTrendRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
`;

const KpiChange = styled.span<{ $isFlat: boolean }>`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${({ $isFlat }) => $isFlat ? colors.mutedForeground : colors.green600};
`;

const KpiPeriod = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: rgb(var(--app-muted-fg-rgb) / 0.6);
`;

function renderChart(widget: WidgetConfig) {
  switch (widget.type) {
    case 'kpi':
      return (
        <KpiContainer>
          <KpiValue>{widget.kpiValue}</KpiValue>
          <KpiTrendRow>
            {widget.kpiTrend === 'up' && <TrendingUp style={{ width: 16, height: 16, color: colors.green600 }} />}
            {widget.kpiTrend === 'down' && <TrendingDown style={{ width: 16, height: 16, color: colors.green600 }} />}
            {widget.kpiTrend === 'flat' && <Minus style={{ width: 16, height: 16, color: 'rgb(var(--app-muted-fg-rgb) / 0.6)' }} />}
            <KpiChange $isFlat={widget.kpiTrend === 'flat'}>{widget.kpiChange}</KpiChange>
            <KpiPeriod>vs prev period</KpiPeriod>
          </KpiTrendRow>
        </KpiContainer>
      );
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={widget.data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--app-overlay-rgb) / 0.08)" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="rgb(var(--app-muted-fg-rgb) / 0.4)" />
            <YAxis tick={{ fontSize: 11 }} stroke="rgb(var(--app-muted-fg-rgb) / 0.4)" />
            <Tooltip contentStyle={{ borderRadius: '8px', border: `1px solid ${colors.border}`, fontSize: '12px', background: colors.background }} />
            <Bar dataKey="value" fill="var(--app-violet-500)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    case 'line':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={widget.data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--app-overlay-rgb) / 0.08)" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="rgb(var(--app-muted-fg-rgb) / 0.4)" />
            <YAxis tick={{ fontSize: 11 }} stroke="rgb(var(--app-muted-fg-rgb) / 0.4)" />
            <Tooltip contentStyle={{ borderRadius: '8px', border: `1px solid ${colors.border}`, fontSize: '12px', background: colors.background }} />
            <Line type="monotone" dataKey="value" stroke="var(--app-violet-500)" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      );
    case 'area':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={widget.data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--app-violet-500)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="var(--app-violet-500)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--app-overlay-rgb) / 0.08)" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="rgb(var(--app-muted-fg-rgb) / 0.4)" />
            <YAxis tick={{ fontSize: 11 }} stroke="rgb(var(--app-muted-fg-rgb) / 0.4)" />
            <Tooltip contentStyle={{ borderRadius: '8px', border: `1px solid ${colors.border}`, fontSize: '12px', background: colors.background }} />
            <Area type="monotone" dataKey="value" stroke="var(--app-violet-500)" strokeWidth={2} fill="url(#areaGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      );
    case 'pie':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={widget.data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={75}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
            >
              {widget.data!.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: '8px', border: `1px solid ${colors.border}`, fontSize: '12px', background: colors.background }} />
          </PieChart>
        </ResponsiveContainer>
      );
    default:
      return null;
  }
}

export function ChartCard({ widget, onRemove }: ChartCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  return (
    <CardContainer>
      <CardHeader>
        <TitleArea>
          <GripHandle className="drag-handle">
            <GripVertical style={{ width: 16, height: 16 }} />
          </GripHandle>
          <TitleText>
            <Title>{widget.title}</Title>
            <Subtitle>{widget.subtitle}</Subtitle>
          </TitleText>
        </TitleArea>
        <MenuWrapper ref={menuRef}>
          <MenuButton onClick={() => setMenuOpen(!menuOpen)}>
            <MoreVertical style={{ width: 16, height: 16 }} />
          </MenuButton>
          {menuOpen && (
            <Dropdown>
              <DropdownItem onClick={() => { onRemove?.(widget.id); setMenuOpen(false); }}>
                <Trash2 style={{ width: 14, height: 14 }} />
                Remove
              </DropdownItem>
            </Dropdown>
          )}
        </MenuWrapper>
      </CardHeader>
      <ChartArea $isKpi={widget.type === 'kpi'}>
        {renderChart(widget)}
      </ChartArea>
    </CardContainer>
  );
}
