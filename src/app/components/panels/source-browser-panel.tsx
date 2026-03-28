import { useState } from 'react';
import styled from 'styled-components';
import { Zap, Layers, BarChart3, Database, Sparkles, ChevronRight, ChevronLeft, Search, Hash, Type, Calendar, Plus, type LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Theme } from '@doordash/prism-react';
import { colors, radius } from '@/styles/theme';
import type { WidgetConfig } from '@/types';

// Source types matching deepdive-bi
type SourceType = 'sql' | 'semantic' | 'metrics' | 'cache' | 'chat';

interface SourceTab {
  id: SourceType;
  label: string;
  icon: LucideIcon;
}

interface SourceItem {
  id: string;
  name: string;
  description?: string;
  type: SourceType;
}

interface SourceBrowserPanelProps {
  onSourceSelect?: (source: SourceItem) => void;
  onChartTypeSelect?: (type: WidgetConfig['type']) => void;
  activeTab?: SourceType;
  onTabChange?: (tab: SourceType) => void;
}

// Export tabs so the parent page can use them for collapsed icons
export const SOURCE_TABS = [
  { key: 'sql', label: 'SQL', icon: Zap },
  { key: 'semantic', label: 'Semantic', icon: Layers },
  { key: 'metrics', label: 'Metrics', icon: BarChart3 },
  { key: 'cache', label: 'Cache', icon: Database },
  { key: 'chat', label: 'AI-BI', icon: Sparkles },
] as const;

const TABS: SourceTab[] = [
  { id: 'sql', label: 'SQL', icon: Zap },
  { id: 'semantic', label: 'Semantic', icon: Layers },
  { id: 'metrics', label: 'Metrics', icon: BarChart3 },
  { id: 'cache', label: 'Cache', icon: Database },
  { id: 'chat', label: 'AI-BI', icon: Sparkles },
];

const MOCK_SOURCES: Record<SourceType, SourceItem[]> = {
  sql: [
    { id: 'sql-1', name: 'fact_deliveries', description: 'Core delivery events table', type: 'sql' },
    { id: 'sql-2', name: 'dim_merchants', description: 'Merchant dimension table', type: 'sql' },
    { id: 'sql-3', name: 'fact_orders', description: 'Order transactions', type: 'sql' },
    { id: 'sql-4', name: 'dim_consumers', description: 'Consumer profiles and attributes', type: 'sql' },
    { id: 'sql-5', name: 'fact_dasher_pay', description: 'Dasher payment events', type: 'sql' },
  ],
  semantic: [
    { id: 'sem-1', name: 'order_metrics', description: 'dbt semantic model — orders', type: 'semantic' },
    { id: 'sem-2', name: 'delivery_performance', description: 'dbt semantic — delivery SLA', type: 'semantic' },
    { id: 'sem-3', name: 'revenue_model', description: 'dbt semantic — revenue attribution', type: 'semantic' },
    { id: 'sem-4', name: 'cx_satisfaction', description: 'dbt semantic — customer satisfaction', type: 'semantic' },
  ],
  metrics: [
    { id: 'met-1', name: 'GOV (Gross Order Value)', description: 'Total order value including tips', type: 'metrics' },
    { id: 'met-2', name: 'Net Revenue', description: 'Revenue after refunds and credits', type: 'metrics' },
    { id: 'met-3', name: 'Active Dashers', description: 'Dashers with >= 1 delivery in period', type: 'metrics' },
    { id: 'met-4', name: 'P50 Delivery Time', description: 'Median delivery duration', type: 'metrics' },
    { id: 'met-5', name: 'DashPass Subscribers', description: 'Total paid DashPass subscribers', type: 'metrics' },
    { id: 'met-6', name: 'Consumer MAUs', description: 'Monthly active users (L28)', type: 'metrics' },
  ],
  cache: [
    { id: 'cache-1', name: 'wbr_company_dashboard', description: 'Weekly Business Review cache', type: 'cache' },
    { id: 'cache-2', name: 'ops_realtime_view', description: 'Real-time operations snapshot', type: 'cache' },
  ],
  chat: [
    { id: 'chat-1', name: 'AI-assisted query', description: 'Describe what you want to analyze in natural language', type: 'chat' },
  ],
};

// Field types for the field inspector (matching deepdive-bi)
interface FieldItem {
  id: string;
  name: string;
  role: 'measure' | 'dimension' | 'date';
  dataType: 'number' | 'string' | 'date';
}

const MOCK_FIELDS: Record<string, { measures: FieldItem[]; dimensions: FieldItem[]; dateFields: FieldItem[] }> = {
  'sem-1': {
    measures: [
      { id: 'f1', name: 'total_orders', role: 'measure', dataType: 'number' },
      { id: 'f2', name: 'gross_order_value', role: 'measure', dataType: 'number' },
      { id: 'f3', name: 'avg_order_value', role: 'measure', dataType: 'number' },
      { id: 'f4', name: 'order_count_l28', role: 'measure', dataType: 'number' },
    ],
    dimensions: [
      { id: 'f5', name: 'market', role: 'dimension', dataType: 'string' },
      { id: 'f6', name: 'submarket', role: 'dimension', dataType: 'string' },
      { id: 'f7', name: 'store_type', role: 'dimension', dataType: 'string' },
      { id: 'f8', name: 'platform', role: 'dimension', dataType: 'string' },
    ],
    dateFields: [
      { id: 'f9', name: 'order_date', role: 'date', dataType: 'date' },
      { id: 'f10', name: 'delivery_date', role: 'date', dataType: 'date' },
    ],
  },
  'sem-2': {
    measures: [
      { id: 'f11', name: 'p50_delivery_time', role: 'measure', dataType: 'number' },
      { id: 'f12', name: 'p90_delivery_time', role: 'measure', dataType: 'number' },
      { id: 'f13', name: 'on_time_rate', role: 'measure', dataType: 'number' },
      { id: 'f14', name: 'asap_deliveries', role: 'measure', dataType: 'number' },
    ],
    dimensions: [
      { id: 'f15', name: 'city', role: 'dimension', dataType: 'string' },
      { id: 'f16', name: 'delivery_type', role: 'dimension', dataType: 'string' },
    ],
    dateFields: [
      { id: 'f17', name: 'delivery_date', role: 'date', dataType: 'date' },
    ],
  },
  'sem-3': {
    measures: [
      { id: 'f18', name: 'net_revenue', role: 'measure', dataType: 'number' },
      { id: 'f19', name: 'contribution_margin', role: 'measure', dataType: 'number' },
      { id: 'f20', name: 'take_rate', role: 'measure', dataType: 'number' },
    ],
    dimensions: [
      { id: 'f21', name: 'business_line', role: 'dimension', dataType: 'string' },
      { id: 'f22', name: 'region', role: 'dimension', dataType: 'string' },
    ],
    dateFields: [
      { id: 'f23', name: 'fiscal_date', role: 'date', dataType: 'date' },
    ],
  },
  'sem-4': {
    measures: [
      { id: 'f24', name: 'csat_score', role: 'measure', dataType: 'number' },
      { id: 'f25', name: 'nps', role: 'measure', dataType: 'number' },
      { id: 'f26', name: 'ticket_count', role: 'measure', dataType: 'number' },
    ],
    dimensions: [
      { id: 'f27', name: 'issue_type', role: 'dimension', dataType: 'string' },
      { id: 'f28', name: 'channel', role: 'dimension', dataType: 'string' },
    ],
    dateFields: [
      { id: 'f29', name: 'survey_date', role: 'date', dataType: 'date' },
    ],
  },
  // SQL sources get generic fields
  'sql-1': {
    measures: [
      { id: 'sf1', name: 'delivery_count', role: 'measure', dataType: 'number' },
      { id: 'sf2', name: 'total_subtotal', role: 'measure', dataType: 'number' },
    ],
    dimensions: [
      { id: 'sf3', name: 'store_id', role: 'dimension', dataType: 'string' },
      { id: 'sf4', name: 'dasher_id', role: 'dimension', dataType: 'string' },
    ],
    dateFields: [
      { id: 'sf5', name: 'created_at', role: 'date', dataType: 'date' },
    ],
  },
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
`;

const TabBar = styled.div`
  display: flex;
  gap: 2px;
  padding: 0 0 ${Theme.usage.space.xSmall};
  border-bottom: 1px solid rgb(var(--app-overlay-rgb) / 0.06);
  margin-bottom: ${Theme.usage.space.xSmall};
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: ${Theme.usage.space.xSmall} 2px;
  border-radius: ${radius.md};
  border: none;
  cursor: pointer;
  transition: all 150ms;
  background: ${({ $active }) => $active ? 'rgb(var(--app-violet-rgb) / 0.1)' : 'transparent'};
  color: ${({ $active }) => $active ? colors.violet600 : colors.mutedForeground};

  &:hover {
    background: ${({ $active }) => $active ? 'rgb(var(--app-violet-rgb) / 0.1)' : 'rgb(var(--app-overlay-rgb) / 0.04)'};
    color: ${({ $active }) => $active ? colors.violet600 : colors.foreground};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const TabLabel = styled.span`
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.02em;
`;

const SearchWrapper = styled.div`
  position: relative;
  margin-bottom: ${Theme.usage.space.xSmall};
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: ${Theme.usage.space.small};
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: ${colors.mutedForeground};
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small} ${Theme.usage.space.xSmall} ${Theme.usage.space.xxLarge};
  border-radius: ${radius.lg};
  font-size: ${Theme.usage.fontSize.xSmall};
  background: rgb(var(--app-surface-rgb) / 0.5);
  border: 1px solid rgb(var(--app-overlay-rgb) / 0.04);
  color: ${colors.foreground};
  transition: all 200ms;

  &::placeholder {
    color: ${colors.mutedForeground};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgb(var(--app-violet-rgb) / 0.1);
    border-color: rgb(var(--app-violet-rgb) / 0.4);
  }
`;

const BrowseHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${Theme.usage.space.xxSmall};
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

const BrowseCount = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  font-weight: 500;
`;

const SourceButton = styled(motion.button)<{ $selected?: boolean }>`
  width: 100%;
  padding: ${Theme.usage.space.small};
  border-radius: ${radius.lg};
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
  background: ${({ $selected }) => $selected ? 'rgb(var(--app-violet-rgb) / 0.08)' : 'rgb(var(--app-surface-rgb) / 0.4)'};
  border: 1px solid ${({ $selected }) => $selected ? 'rgb(var(--app-violet-rgb) / 0.2)' : 'rgb(var(--app-overlay-rgb) / 0.04)'};
  transition: all 200ms;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: rgb(var(--app-violet-rgb) / 0.06);
    border-color: rgb(var(--app-overlay-rgb) / 0.06);
  }
`;

const SourceIcon = styled.div<{ $type: SourceType }>`
  width: 32px;
  height: 32px;
  border-radius: ${radius.lg};
  background: ${({ $type }) => {
    switch ($type) {
      case 'sql': return 'linear-gradient(to bottom right, rgb(var(--app-violet-rgb) / 0.2), rgb(var(--app-blue-rgb) / 0.15))';
      case 'semantic': return 'linear-gradient(to bottom right, rgb(var(--app-emerald-rgb) / 0.2), rgb(var(--app-cyan-rgb) / 0.15))';
      case 'metrics': return 'linear-gradient(to bottom right, rgb(var(--app-dd-primary-rgb) / 0.2), rgb(var(--app-purple-rgb) / 0.15))';
      case 'cache': return 'linear-gradient(to bottom right, rgb(var(--app-blue-rgb) / 0.2), rgb(var(--app-violet-rgb) / 0.15))';
      case 'chat': return 'linear-gradient(to bottom right, rgb(var(--app-purple-rgb) / 0.2), rgb(var(--app-fuchsia-rgb) / 0.15))';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 16px;
    height: 16px;
    color: ${colors.violet600};
  }
`;

const SourceText = styled.div`
  flex: 1;
  min-width: 0;
`;

const SourceName = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.foreground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SourceDescription = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ArrowIcon = styled(ChevronRight)`
  width: 14px;
  height: 14px;
  color: ${colors.mutedForeground};
  opacity: 0;
  transition: opacity 150ms;
  flex-shrink: 0;

  ${SourceButton}:hover & {
    opacity: 1;
  }
`;

// Field Inspector styles
const InspectorHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  margin-bottom: ${Theme.usage.space.small};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${radius.md};
  border: none;
  background: none;
  cursor: pointer;
  color: ${colors.mutedForeground};
  transition: all 150ms;

  &:hover {
    background: rgb(var(--app-overlay-rgb) / 0.06);
    color: ${colors.foreground};
  }
`;

const InspectorTitle = styled.span`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 600;
  color: ${colors.foreground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FieldSection = styled.div<{ $borderColor: string }>`
  border-left: 3px solid ${({ $borderColor }) => $borderColor};
  padding-left: ${Theme.usage.space.small};
  margin-bottom: ${Theme.usage.space.small};
`;

const FieldSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

const FieldSectionTitle = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 600;
  color: ${colors.mutedForeground};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const FieldCount = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  background: rgb(var(--app-overlay-rgb) / 0.06);
  padding: 1px 6px;
  border-radius: 9999px;
`;

const FieldButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.xxSmall} ${Theme.usage.space.xSmall};
  border-radius: ${radius.md};
  border: none;
  background: none;
  cursor: pointer;
  transition: all 150ms;
  text-align: left;

  &:hover {
    background: rgb(var(--app-violet-rgb) / 0.06);
  }
`;

const FieldIcon = styled.span<{ $role: string }>`
  width: 20px;
  height: 20px;
  border-radius: ${radius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ $role }) => {
    switch ($role) {
      case 'measure': return 'rgb(var(--app-emerald-rgb, 16 185 129) / 0.1)';
      case 'dimension': return 'rgb(var(--app-blue-rgb) / 0.1)';
      case 'date': return 'rgb(var(--app-amber-rgb, 245 158 11) / 0.1)';
      default: return 'rgb(var(--app-overlay-rgb) / 0.06)';
    }
  }};
  color: ${({ $role }) => {
    switch ($role) {
      case 'measure': return colors.emerald500;
      case 'dimension': return colors.blue600;
      case 'date': return colors.yellow600;
      default: return colors.mutedForeground;
    }
  }};

  svg {
    width: 12px;
    height: 12px;
  }
`;

const FieldName = styled.span`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.foreground};
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const AddFieldIcon = styled(Plus)`
  width: 12px;
  height: 12px;
  color: ${colors.violet600};
  opacity: 0;
  transition: opacity 150ms;
  flex-shrink: 0;
  margin-left: auto;

  ${FieldButton}:hover & {
    opacity: 1;
  }
`;

const PlaceholderBox = styled.div`
  padding: ${Theme.usage.space.large} ${Theme.usage.space.medium};
  text-align: center;
  color: ${colors.mutedForeground};
  font-size: ${Theme.usage.fontSize.xSmall};
`;

export function SourceBrowserPanel({ onSourceSelect, onChartTypeSelect, activeTab: controlledTab, onTabChange }: SourceBrowserPanelProps) {
  const [internalTab, setInternalTab] = useState<SourceType>('metrics');
  const activeTab = controlledTab ?? internalTab;
  const setActiveTab = (tab: SourceType) => { onTabChange?.(tab); setInternalTab(tab); };
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const allSources = MOCK_SOURCES[activeTab];
  const sources = search.trim()
    ? allSources.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.description?.toLowerCase().includes(search.toLowerCase()))
    : allSources;

  const [inspectingSource, setInspectingSource] = useState<SourceItem | null>(null);

  const handleSelect = (source: SourceItem) => {
    setSelectedId(source.id);
    onSourceSelect?.(source);

    // For semantic and sql sources, open field inspector
    if (activeTab === 'semantic' || activeTab === 'sql') {
      if (MOCK_FIELDS[source.id]) {
        setInspectingSource(source);
      }
      return;
    }

    // For metrics, trigger chart creation directly
    if (activeTab === 'metrics') {
      const chartTypes: WidgetConfig['type'][] = ['bar', 'line', 'area', 'kpi', 'pie'];
      onChartTypeSelect?.(chartTypes[Math.floor(Math.random() * chartTypes.length)]);
    }
  };

  const handleFieldClick = (field: FieldItem) => {
    // Create a chart based on field role
    if (field.role === 'measure') {
      const types: WidgetConfig['type'][] = ['bar', 'line', 'area', 'kpi'];
      onChartTypeSelect?.(types[Math.floor(Math.random() * types.length)]);
    } else if (field.role === 'dimension') {
      onChartTypeSelect?.('pie');
    } else {
      onChartTypeSelect?.('line');
    }
  };

  const handleBackToList = () => {
    setInspectingSource(null);
    setSelectedId(null);
  };

  // Field inspector view
  if (inspectingSource && MOCK_FIELDS[inspectingSource.id]) {
    const fields = MOCK_FIELDS[inspectingSource.id];
    return (
      <Container>
        <InspectorHeader>
          <BackButton onClick={handleBackToList}>
            <ChevronLeft style={{ width: 16, height: 16 }} />
          </BackButton>
          <InspectorTitle>{inspectingSource.name}</InspectorTitle>
        </InspectorHeader>

        <SearchWrapper>
          <SearchIcon />
          <SearchInput
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Find columns..."
          />
        </SearchWrapper>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
          {fields.measures.length > 0 && (
            <FieldSection $borderColor={colors.emerald500}>
              <FieldSectionHeader>
                <FieldSectionTitle>Measures</FieldSectionTitle>
                <FieldCount>{fields.measures.length}</FieldCount>
              </FieldSectionHeader>
              {fields.measures
                .filter((f) => !search.trim() || f.name.toLowerCase().includes(search.toLowerCase()))
                .map((field) => (
                <FieldButton key={field.id} onClick={() => handleFieldClick(field)}>
                  <FieldIcon $role="measure"><Hash /></FieldIcon>
                  <FieldName>{field.name}</FieldName>
                  <AddFieldIcon />
                </FieldButton>
              ))}
            </FieldSection>
          )}

          {fields.dimensions.length > 0 && (
            <FieldSection $borderColor={colors.blue600}>
              <FieldSectionHeader>
                <FieldSectionTitle>Dimensions</FieldSectionTitle>
                <FieldCount>{fields.dimensions.length}</FieldCount>
              </FieldSectionHeader>
              {fields.dimensions
                .filter((f) => !search.trim() || f.name.toLowerCase().includes(search.toLowerCase()))
                .map((field) => (
                <FieldButton key={field.id} onClick={() => handleFieldClick(field)}>
                  <FieldIcon $role="dimension"><Type /></FieldIcon>
                  <FieldName>{field.name}</FieldName>
                  <AddFieldIcon />
                </FieldButton>
              ))}
            </FieldSection>
          )}

          {fields.dateFields.length > 0 && (
            <FieldSection $borderColor={colors.yellow600}>
              <FieldSectionHeader>
                <FieldSectionTitle>Date Fields</FieldSectionTitle>
                <FieldCount>{fields.dateFields.length}</FieldCount>
              </FieldSectionHeader>
              {fields.dateFields
                .filter((f) => !search.trim() || f.name.toLowerCase().includes(search.toLowerCase()))
                .map((field) => (
                <FieldButton key={field.id} onClick={() => handleFieldClick(field)}>
                  <FieldIcon $role="date"><Calendar /></FieldIcon>
                  <FieldName>{field.name}</FieldName>
                  <AddFieldIcon />
                </FieldButton>
              ))}
            </FieldSection>
          )}
        </motion.div>
      </Container>
    );
  }

  // Source list view
  return (
    <Container>
      <TabBar>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <Tab
              key={tab.id}
              $active={activeTab === tab.id}
              onClick={() => { setActiveTab(tab.id); setSelectedId(null); setInspectingSource(null); setSearch(''); }}
            >
              <Icon />
              <TabLabel>{tab.label}</TabLabel>
            </Tab>
          );
        })}
      </TabBar>

      <SearchWrapper>
        <SearchIcon />
        <SearchInput
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${TABS.find((t) => t.id === activeTab)?.label.toLowerCase() || 'sources'}...`}
        />
      </SearchWrapper>

      <BrowseHeader>
        <BrowseCount>{sources.length} source{sources.length !== 1 ? 's' : ''}</BrowseCount>
      </BrowseHeader>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          style={{ display: 'flex', flexDirection: 'column', gap: Theme.usage.space.xxSmall }}
        >
          {activeTab === 'cache' || activeTab === 'chat' ? (
            <PlaceholderBox>
              {activeTab === 'chat'
                ? 'Use the AI assistant on the right to query data with natural language.'
                : `${sources.length} cached ${sources.length === 1 ? 'source' : 'sources'} available`}
            </PlaceholderBox>
          ) : null}

          {sources.map((source) => {
            const TabIcon = TABS.find((t) => t.id === source.type)?.icon ?? Database;
            return (
              <SourceButton
                key={source.id}
                $selected={selectedId === source.id}
                onClick={() => handleSelect(source)}
                whileTap={{ scale: 0.98 }}
              >
                <SourceIcon $type={source.type}>
                  <TabIcon />
                </SourceIcon>
                <SourceText>
                  <SourceName>{source.name}</SourceName>
                  {source.description && <SourceDescription>{source.description}</SourceDescription>}
                </SourceText>
                <ArrowIcon />
              </SourceButton>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </Container>
  );
}
