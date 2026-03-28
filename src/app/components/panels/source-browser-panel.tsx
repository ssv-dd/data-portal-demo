import { useState } from 'react';
import styled from 'styled-components';
import { Zap, Layers, BarChart3, Database, Sparkles, ChevronRight, type LucideIcon } from 'lucide-react';
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
}

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

const PlaceholderBox = styled.div`
  padding: ${Theme.usage.space.large} ${Theme.usage.space.medium};
  text-align: center;
  color: ${colors.mutedForeground};
  font-size: ${Theme.usage.fontSize.xSmall};
`;

export function SourceBrowserPanel({ onSourceSelect, onChartTypeSelect }: SourceBrowserPanelProps) {
  const [activeTab, setActiveTab] = useState<SourceType>('metrics');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const sources = MOCK_SOURCES[activeTab];

  const handleSelect = (source: SourceItem) => {
    setSelectedId(source.id);
    onSourceSelect?.(source);
    // For metrics, also trigger chart creation
    if (activeTab === 'metrics') {
      const chartTypes: WidgetConfig['type'][] = ['bar', 'line', 'area', 'kpi', 'pie'];
      onChartTypeSelect?.(chartTypes[Math.floor(Math.random() * chartTypes.length)]);
    }
  };

  return (
    <Container>
      <TabBar>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <Tab
              key={tab.id}
              $active={activeTab === tab.id}
              onClick={() => { setActiveTab(tab.id); setSelectedId(null); }}
            >
              <Icon />
              <TabLabel>{tab.label}</TabLabel>
            </Tab>
          );
        })}
      </TabBar>

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
