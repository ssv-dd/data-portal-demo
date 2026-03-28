import styled from 'styled-components';
import { GripVertical, MoreVertical, Trash2, TrendingUp, TrendingDown, Minus, Filter, Database, Code2, X } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Theme } from '@doordash/prism-react';
import { colors, glassPanel, radius } from '@/styles/theme';
import type { WidgetConfig } from '@/types';
import { COLORS } from '@/app/data/mock/dashboard-canvas-data';
import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface ChartCardProps {
  widget: WidgetConfig;
  onRemove?: (widgetId: string) => void;
  onAddFilter?: (widgetId: string) => void;
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

const MenuSeparator = styled.div`
  height: 1px;
  background: ${colors.border};
  margin: 4px 0;
`;

const OverlayBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgb(0 0 0 / 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OverlayPanel = styled(motion.div)`
  background: ${colors.background};
  border: 1px solid ${colors.border};
  border-radius: ${radius['2xl']};
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.12);
  width: 520px;
  max-height: 80vh;
  overflow: auto;
`;

const OverlayHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${Theme.usage.space.medium} ${Theme.usage.space.large};
  border-bottom: 1px solid ${colors.border};
`;

const OverlayTitle = styled.h3`
  font-size: ${Theme.usage.fontSize.small};
  font-weight: 600;
  color: ${colors.foreground};
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const OverlayCloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${colors.mutedForeground};
  padding: 4px;
  border-radius: ${radius.sm};
  display: flex;
  align-items: center;

  &:hover {
    background: rgb(var(--app-overlay-rgb) / 0.06);
    color: ${colors.foreground};
  }
`;

const OverlayBody = styled.div`
  padding: ${Theme.usage.space.large};
`;

const SqlBlock = styled.pre`
  background: rgb(var(--app-overlay-rgb) / 0.04);
  border: 1px solid ${colors.border};
  border-radius: ${radius.lg};
  padding: ${Theme.usage.space.medium};
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  color: ${colors.foreground};
  overflow-x: auto;
  white-space: pre-wrap;
  line-height: 1.6;
`;

const SourceInfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.small};
`;

const SourceRow = styled.div`
  display: flex;
  gap: ${Theme.usage.space.small};
`;

const SourceLabel = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  color: ${colors.mutedForeground};
  min-width: 100px;
`;

const SourceValue = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.foreground};
`;

const SourceBadge = styled.span<{ $color?: string }>`
  display: inline-flex;
  align-items: center;
  padding: 1px 8px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 500;
  background: ${({ $color }) => $color ?? 'rgb(var(--app-overlay-rgb) / 0.06)'};
  color: ${colors.foreground};
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.small};
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const FilterSelect = styled.select`
  flex: 1;
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
  border: 1px solid ${colors.border};
  border-radius: ${radius.md};
  background: ${colors.background};
  color: ${colors.foreground};
  font-size: ${Theme.usage.fontSize.xxSmall};
  outline: none;
  appearance: none;
  cursor: pointer;

  &:focus {
    border-color: ${colors.violet500};
  }
`;

const FilterInput = styled.input`
  flex: 1;
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
  border: 1px solid ${colors.border};
  border-radius: ${radius.md};
  background: ${colors.background};
  color: ${colors.foreground};
  font-size: ${Theme.usage.fontSize.xxSmall};
  outline: none;

  &:focus {
    border-color: ${colors.violet500};
  }
`;

const FilterApplyBtn = styled.button`
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.medium};
  border: none;
  border-radius: ${radius.md};
  background: ${colors.violet600};
  color: white;
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  cursor: pointer;
  transition: opacity 150ms;

  &:hover {
    opacity: 0.9;
  }
`;

const ActiveFiltersBar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 ${Theme.usage.space.medium} ${Theme.usage.space.xSmall};
  flex-wrap: wrap;
`;

const FilterChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 500;
  background: rgb(var(--app-violet-rgb) / 0.08);
  color: ${colors.violet600};
`;

const FilterChipRemove = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  color: ${colors.violet600};
  opacity: 0.6;

  &:hover {
    opacity: 1;
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

function getMockSql(widget: WidgetConfig): string {
  const table = widget.category || 'fact_deliveries';
  const metric = widget.title.toLowerCase().replace(/\s+/g, '_');
  return `SELECT
  date_trunc('day', created_at) AS period,
  ${widget.type === 'kpi' ? `COUNT(DISTINCT ${metric}_id) AS total` : `SUM(${metric}) AS value`}
FROM analytics.${table}
WHERE created_at >= DATEADD('day', -30, CURRENT_DATE())
  AND region = 'US'
GROUP BY 1
ORDER BY 1;`;
}

function getMockSource(widget: WidgetConfig) {
  const sources = [
    { database: 'analytics', schema: 'core', table: 'fact_deliveries', warehouse: 'Snowflake', freshness: '15 min ago' },
    { database: 'analytics', schema: 'core', table: 'fact_orders', warehouse: 'Snowflake', freshness: '30 min ago' },
    { database: 'metrics', schema: 'semantic', table: 'order_metrics', warehouse: 'Databricks', freshness: '1 hr ago' },
  ];
  const idx = widget.title.length % sources.length;
  return sources[idx];
}

const FILTER_COLUMNS = ['region', 'country', 'date_range', 'store_type', 'channel', 'platform', 'tier'];
const FILTER_OPERATORS = ['equals', 'not equals', 'contains', 'greater than', 'less than', 'in'];

interface WidgetFilter {
  column: string;
  operator: string;
  value: string;
}

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

export function ChartCard({ widget, onRemove, onAddFilter: _onAddFilter }: ChartCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [overlay, setOverlay] = useState<'filter' | 'source' | 'sql' | null>(null);
  const [localFilters, setLocalFilters] = useState<WidgetFilter[]>([]);
  const [draftFilter, setDraftFilter] = useState<WidgetFilter>({ column: FILTER_COLUMNS[0], operator: FILTER_OPERATORS[0], value: '' });
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

  const handleAddLocalFilter = useCallback(() => {
    if (!draftFilter.value.trim()) return;
    setLocalFilters((prev) => [...prev, { ...draftFilter }]);
    setDraftFilter({ column: FILTER_COLUMNS[0], operator: FILTER_OPERATORS[0], value: '' });
  }, [draftFilter]);

  const handleRemoveLocalFilter = useCallback((idx: number) => {
    setLocalFilters((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const source = getMockSource(widget);

  return (
    <>
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
                <DropdownItem onClick={() => { setOverlay('filter'); setMenuOpen(false); }}>
                  <Filter style={{ width: 14, height: 14 }} />
                  Add Filter
                </DropdownItem>
                <DropdownItem onClick={() => { setOverlay('source'); setMenuOpen(false); }}>
                  <Database style={{ width: 14, height: 14 }} />
                  Show Source
                </DropdownItem>
                <DropdownItem onClick={() => { setOverlay('sql'); setMenuOpen(false); }}>
                  <Code2 style={{ width: 14, height: 14 }} />
                  Show SQL
                </DropdownItem>
                <MenuSeparator />
                <DropdownItem onClick={() => { onRemove?.(widget.id); setMenuOpen(false); }}>
                  <Trash2 style={{ width: 14, height: 14, color: '#ef4444' }} />
                  <span style={{ color: '#ef4444' }}>Remove</span>
                </DropdownItem>
              </Dropdown>
            )}
          </MenuWrapper>
        </CardHeader>
        {localFilters.length > 0 && (
          <ActiveFiltersBar>
            <Filter style={{ width: 12, height: 12, color: colors.violet600 }} />
            {localFilters.map((f, idx) => (
              <FilterChip key={idx}>
                {f.column} {f.operator} "{f.value}"
                <FilterChipRemove onClick={() => handleRemoveLocalFilter(idx)}>
                  <X style={{ width: 10, height: 10 }} />
                </FilterChipRemove>
              </FilterChip>
            ))}
          </ActiveFiltersBar>
        )}
        <ChartArea $isKpi={widget.type === 'kpi'}>
          {renderChart(widget)}
        </ChartArea>
      </CardContainer>

      {/* Overlay panels */}
      <AnimatePresence>
        {overlay === 'filter' && (
          <OverlayBackdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setOverlay(null)}
          >
            <OverlayPanel
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
            >
              <OverlayHeader>
                <OverlayTitle>
                  <Filter style={{ width: 16, height: 16, color: colors.violet600 }} />
                  Add Filter — {widget.title}
                </OverlayTitle>
                <OverlayCloseBtn onClick={() => setOverlay(null)}>
                  <X style={{ width: 16, height: 16 }} />
                </OverlayCloseBtn>
              </OverlayHeader>
              <OverlayBody>
                <FilterSection>
                  {localFilters.length > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: colors.mutedForeground, marginBottom: '8px' }}>Active filters</div>
                      {localFilters.map((f, idx) => (
                        <FilterChip key={idx} style={{ marginRight: '6px', marginBottom: '4px' }}>
                          {f.column} {f.operator} "{f.value}"
                          <FilterChipRemove onClick={() => handleRemoveLocalFilter(idx)}>
                            <X style={{ width: 10, height: 10 }} />
                          </FilterChipRemove>
                        </FilterChip>
                      ))}
                    </div>
                  )}
                  <div style={{ fontSize: '12px', fontWeight: 500, color: colors.mutedForeground, marginBottom: '4px' }}>New filter</div>
                  <FilterRow>
                    <FilterSelect
                      value={draftFilter.column}
                      onChange={(e) => setDraftFilter((prev) => ({ ...prev, column: e.target.value }))}
                    >
                      {FILTER_COLUMNS.map((col) => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </FilterSelect>
                    <FilterSelect
                      value={draftFilter.operator}
                      onChange={(e) => setDraftFilter((prev) => ({ ...prev, operator: e.target.value }))}
                    >
                      {FILTER_OPERATORS.map((op) => (
                        <option key={op} value={op}>{op}</option>
                      ))}
                    </FilterSelect>
                    <FilterInput
                      placeholder="Value…"
                      value={draftFilter.value}
                      onChange={(e) => setDraftFilter((prev) => ({ ...prev, value: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddLocalFilter(); }}
                    />
                  </FilterRow>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                    <FilterApplyBtn onClick={handleAddLocalFilter}>
                      Apply Filter
                    </FilterApplyBtn>
                  </div>
                </FilterSection>
              </OverlayBody>
            </OverlayPanel>
          </OverlayBackdrop>
        )}

        {overlay === 'source' && (
          <OverlayBackdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setOverlay(null)}
          >
            <OverlayPanel
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
            >
              <OverlayHeader>
                <OverlayTitle>
                  <Database style={{ width: 16, height: 16, color: colors.violet600 }} />
                  Data Source — {widget.title}
                </OverlayTitle>
                <OverlayCloseBtn onClick={() => setOverlay(null)}>
                  <X style={{ width: 16, height: 16 }} />
                </OverlayCloseBtn>
              </OverlayHeader>
              <OverlayBody>
                <SourceInfoGrid>
                  <SourceRow>
                    <SourceLabel>Warehouse</SourceLabel>
                    <SourceValue>
                      <SourceBadge $color="rgb(var(--app-violet-rgb) / 0.08)">{source.warehouse}</SourceBadge>
                    </SourceValue>
                  </SourceRow>
                  <SourceRow>
                    <SourceLabel>Database</SourceLabel>
                    <SourceValue>{source.database}</SourceValue>
                  </SourceRow>
                  <SourceRow>
                    <SourceLabel>Schema</SourceLabel>
                    <SourceValue>{source.schema}</SourceValue>
                  </SourceRow>
                  <SourceRow>
                    <SourceLabel>Table</SourceLabel>
                    <SourceValue style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', fontSize: '12px' }}>
                      {source.table}
                    </SourceValue>
                  </SourceRow>
                  <SourceRow>
                    <SourceLabel>Last refreshed</SourceLabel>
                    <SourceValue>
                      <SourceBadge $color="rgb(var(--app-emerald-rgb, 16 185 129) / 0.08)">{source.freshness}</SourceBadge>
                    </SourceValue>
                  </SourceRow>
                  <SourceRow>
                    <SourceLabel>Chart type</SourceLabel>
                    <SourceValue style={{ textTransform: 'capitalize' }}>{widget.type}</SourceValue>
                  </SourceRow>
                  {widget.metricId && (
                    <SourceRow>
                      <SourceLabel>Metric ID</SourceLabel>
                      <SourceValue style={{ fontFamily: 'monospace', fontSize: '12px' }}>{widget.metricId}</SourceValue>
                    </SourceRow>
                  )}
                </SourceInfoGrid>
              </OverlayBody>
            </OverlayPanel>
          </OverlayBackdrop>
        )}

        {overlay === 'sql' && (
          <OverlayBackdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setOverlay(null)}
          >
            <OverlayPanel
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
            >
              <OverlayHeader>
                <OverlayTitle>
                  <Code2 style={{ width: 16, height: 16, color: colors.violet600 }} />
                  SQL Query — {widget.title}
                </OverlayTitle>
                <OverlayCloseBtn onClick={() => setOverlay(null)}>
                  <X style={{ width: 16, height: 16 }} />
                </OverlayCloseBtn>
              </OverlayHeader>
              <OverlayBody>
                <SqlBlock>{getMockSql(widget)}</SqlBlock>
                <div style={{ marginTop: '12px', fontSize: '11px', color: colors.mutedForeground }}>
                  Generated from {source.warehouse} · {source.database}.{source.schema}.{source.table}
                </div>
              </OverlayBody>
            </OverlayPanel>
          </OverlayBackdrop>
        )}
      </AnimatePresence>
    </>
  );
}
