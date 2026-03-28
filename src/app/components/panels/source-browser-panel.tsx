import { useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { Zap, Layers, BarChart3, Database, Sparkles, ChevronRight, ChevronLeft, Search, Hash, Type, Calendar, Plus, Download, CheckCircle2, BarChart2, TrendingUp, PieChart, Activity, AlertTriangle, Clock, Shield, type LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Theme } from '@doordash/prism-react';
import { colors, radius } from '@/styles/theme';
import type { WidgetConfig } from '@/types';
import { AIWidgetSidebar } from './ai-widget-sidebar';
import type { AIWidgetConfig } from '../AIWidgetCreator';

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
  onAIComplete?: (config: AIWidgetConfig) => void;
  activeTab?: SourceType;
  onTabChange?: (tab: SourceType) => void;
}

// Export tabs so the parent page can use them for collapsed icons
export const SOURCE_TABS = [
  { key: 'chat', label: 'AI-BI', icon: Sparkles },
  { key: 'sql', label: 'SQL', icon: Zap },
  { key: 'semantic', label: 'Semantic', icon: Layers },
  { key: 'metrics', label: 'Metrics', icon: BarChart3 },
  { key: 'cache', label: 'Cache', icon: Database },
] as const;

const TABS: SourceTab[] = [
  { id: 'chat', label: 'AI-BI', icon: Sparkles },
  { id: 'sql', label: 'SQL', icon: Zap },
  { id: 'semantic', label: 'Semantic', icon: Layers },
  { id: 'metrics', label: 'Metrics', icon: BarChart3 },
  { id: 'cache', label: 'Cache', icon: Database },
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

// Cacheable dashboard sources (in-house dashboards only)
interface CacheableDashboard {
  id: string;
  name: string;
  url: string;
  domain: string;
  tier: 'T0' | 'T1' | 'T2';
  widgetCount: number;
  lastUpdated: string;
  estimatedSizeMB: number;
}

interface CachedWidget {
  id: string;
  name: string;
  chartType: 'bar' | 'line' | 'area' | 'pie' | 'kpi';
  icon: LucideIcon;
}

type RefreshInterval = '4h' | '8h' | '12h' | '24h' | '48h' | '7d';
const REFRESH_OPTIONS: { value: RefreshInterval; label: string; cost: number }[] = [
  { value: '4h', label: 'Every 4 hours', cost: 4 },
  { value: '8h', label: 'Every 8 hours', cost: 2 },
  { value: '12h', label: 'Every 12 hours', cost: 1.5 },
  { value: '24h', label: 'Every 24 hours', cost: 1 },
  { value: '48h', label: 'Every 2 days', cost: 0.5 },
  { value: '7d', label: 'Weekly', cost: 0.2 },
];

// Cache quota — shared resource, measured in "cache units"
const CACHE_QUOTA = { total: 50, used: 18, unit: 'GB' };

const CACHEABLE_DASHBOARDS: CacheableDashboard[] = [
  { id: 'cd-1', name: 'Weekly Business Review', url: 'https://data.doordash.com/dashboards/wbr-2026', domain: 'Finance', tier: 'T0', widgetCount: 8, lastUpdated: '2h ago', estimatedSizeMB: 340 },
  { id: 'cd-2', name: 'Ops Realtime Monitor', url: 'https://data.doordash.com/dashboards/ops-realtime', domain: 'Logistics', tier: 'T0', widgetCount: 12, lastUpdated: '15m ago', estimatedSizeMB: 580 },
  { id: 'cd-3', name: 'CX Satisfaction Trends', url: 'https://data.doordash.com/dashboards/cx-trends', domain: 'CX', tier: 'T1', widgetCount: 6, lastUpdated: '1d ago', estimatedSizeMB: 210 },
  { id: 'cd-4', name: 'DashPass Growth Tracker', url: 'https://data.doordash.com/dashboards/dashpass-growth', domain: 'DashPass', tier: 'T1', widgetCount: 10, lastUpdated: '4h ago', estimatedSizeMB: 420 },
  { id: 'cd-5', name: 'Revenue by Region', url: 'https://data.doordash.com/dashboards/revenue-region', domain: 'Finance', tier: 'T1', widgetCount: 5, lastUpdated: '30m ago', estimatedSizeMB: 180 },
  { id: 'cd-6', name: 'Marketplace Supply/Demand', url: 'https://data.doordash.com/dashboards/marketplace-sd', domain: 'Marketplace', tier: 'T2', widgetCount: 9, lastUpdated: '1h ago', estimatedSizeMB: 390 },
];

// Mock widgets that get "cached" from a dashboard
const MOCK_CACHED_WIDGETS: Record<string, CachedWidget[]> = {
  'cd-1': [
    { id: 'cw-1', name: 'Weekly Revenue', chartType: 'area', icon: TrendingUp },
    { id: 'cw-2', name: 'Order Volume', chartType: 'bar', icon: BarChart2 },
    { id: 'cw-3', name: 'New Users', chartType: 'line', icon: Activity },
    { id: 'cw-4', name: 'GOV', chartType: 'kpi', icon: TrendingUp },
    { id: 'cw-5', name: 'Net Revenue', chartType: 'kpi', icon: TrendingUp },
    { id: 'cw-6', name: 'CSAT Score', chartType: 'kpi', icon: Activity },
    { id: 'cw-7', name: 'Revenue by Region', chartType: 'pie', icon: PieChart },
    { id: 'cw-8', name: 'Active Dashers', chartType: 'line', icon: Activity },
  ],
  'cd-2': [
    { id: 'cw-9', name: 'P50 Delivery Time', chartType: 'line', icon: Activity },
    { id: 'cw-10', name: 'Active Orders', chartType: 'kpi', icon: TrendingUp },
    { id: 'cw-11', name: 'Dasher Utilization', chartType: 'area', icon: TrendingUp },
    { id: 'cw-12', name: 'Late Delivery Rate', chartType: 'bar', icon: BarChart2 },
    { id: 'cw-13', name: 'Orders by Zone', chartType: 'pie', icon: PieChart },
    { id: 'cw-14', name: 'SLA Compliance', chartType: 'kpi', icon: Activity },
    { id: 'cw-15', name: 'Avg Wait Time', chartType: 'line', icon: Activity },
    { id: 'cw-16', name: 'Cancellation Rate', chartType: 'kpi', icon: TrendingUp },
    { id: 'cw-17', name: 'Delivery Heatmap', chartType: 'area', icon: TrendingUp },
    { id: 'cw-18', name: 'Peak Hour Volume', chartType: 'bar', icon: BarChart2 },
    { id: 'cw-19', name: 'Batch Rate', chartType: 'kpi', icon: Activity },
    { id: 'cw-20', name: 'Store Wait Distribution', chartType: 'bar', icon: BarChart2 },
  ],
  'cd-3': [
    { id: 'cw-21', name: 'CSAT Over Time', chartType: 'line', icon: Activity },
    { id: 'cw-22', name: 'NPS Score', chartType: 'kpi', icon: TrendingUp },
    { id: 'cw-23', name: 'Tickets by Category', chartType: 'pie', icon: PieChart },
    { id: 'cw-24', name: 'Resolution Time', chartType: 'bar', icon: BarChart2 },
    { id: 'cw-25', name: 'First Contact Resolution', chartType: 'kpi', icon: Activity },
    { id: 'cw-26', name: 'Satisfaction by Channel', chartType: 'bar', icon: BarChart2 },
  ],
  'cd-4': [
    { id: 'cw-27', name: 'Total Subscribers', chartType: 'kpi', icon: TrendingUp },
    { id: 'cw-28', name: 'Monthly Growth', chartType: 'area', icon: TrendingUp },
    { id: 'cw-29', name: 'Churn Rate', chartType: 'line', icon: Activity },
    { id: 'cw-30', name: 'Revenue per Sub', chartType: 'kpi', icon: TrendingUp },
    { id: 'cw-31', name: 'Retention Cohort', chartType: 'area', icon: TrendingUp },
    { id: 'cw-32', name: 'Conversion Funnel', chartType: 'bar', icon: BarChart2 },
    { id: 'cw-33', name: 'Subs by Plan', chartType: 'pie', icon: PieChart },
    { id: 'cw-34', name: 'Engagement Score', chartType: 'kpi', icon: Activity },
    { id: 'cw-35', name: 'Reactivations', chartType: 'line', icon: Activity },
    { id: 'cw-36', name: 'Trial Conversion', chartType: 'kpi', icon: TrendingUp },
  ],
  'cd-5': [
    { id: 'cw-37', name: 'Total Revenue', chartType: 'kpi', icon: TrendingUp },
    { id: 'cw-38', name: 'Revenue by Market', chartType: 'bar', icon: BarChart2 },
    { id: 'cw-39', name: 'Revenue Trend', chartType: 'area', icon: TrendingUp },
    { id: 'cw-40', name: 'Contribution Margin', chartType: 'line', icon: Activity },
    { id: 'cw-41', name: 'Take Rate', chartType: 'kpi', icon: TrendingUp },
  ],
  'cd-6': [
    { id: 'cw-42', name: 'Supply Score', chartType: 'kpi', icon: TrendingUp },
    { id: 'cw-43', name: 'Demand Forecast', chartType: 'area', icon: TrendingUp },
    { id: 'cw-44', name: 'Mx Activation Rate', chartType: 'line', icon: Activity },
    { id: 'cw-45', name: 'Orders by Vertical', chartType: 'pie', icon: PieChart },
    { id: 'cw-46', name: 'New Merchants', chartType: 'bar', icon: BarChart2 },
    { id: 'cw-47', name: 'Avg Basket Size', chartType: 'kpi', icon: TrendingUp },
    { id: 'cw-48', name: 'Dasher Supply', chartType: 'line', icon: Activity },
    { id: 'cw-49', name: 'Market Balance', chartType: 'area', icon: TrendingUp },
    { id: 'cw-50', name: 'Promo Efficiency', chartType: 'kpi', icon: Activity },
  ],
};

// Domain badge colors
const DOMAIN_COLORS: Record<string, string> = {
  Finance: '#8B5CF6',
  Logistics: '#3B82F6',
  CX: '#10B981',
  DashPass: '#F59E0B',
  Marketplace: '#EF4444',
};

// Tier badge config
const TIER_CONFIG: Record<string, { label: string; color: string }> = {
  T0: { label: 'T0', color: '#EF4444' },
  T1: { label: 'T1', color: '#F59E0B' },
  T2: { label: 'T2', color: '#6B7280' },
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

// Cache tab styles
const CacheContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.small};
`;

// Quota meter — prominent resource indicator
const QuotaMeter = styled.div`
  padding: ${Theme.usage.space.small};
  border-radius: ${radius.lg};
  background: linear-gradient(135deg, rgb(var(--app-amber-rgb, 245 158 11) / 0.06), rgb(var(--app-dd-primary-rgb) / 0.04));
  border: 1px solid rgb(var(--app-amber-rgb, 245 158 11) / 0.15);
`;

const QuotaHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
  margin-bottom: ${Theme.usage.space.xSmall};

  svg { width: 14px; height: 14px; }
`;

const QuotaTitle = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 600;
  color: ${colors.yellow600};
  flex: 1;
`;

const QuotaAmount = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 600;
  color: ${colors.foreground};
  font-variant-numeric: tabular-nums;
`;

const QuotaBarBg = styled.div`
  width: 100%;
  height: 6px;
  border-radius: 9999px;
  background: rgb(var(--app-overlay-rgb) / 0.08);
  overflow: hidden;
  margin-bottom: 4px;
`;

const QuotaBarFill = styled.div<{ $pct: number; $warn: boolean }>`
  height: 100%;
  border-radius: 9999px;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $warn }) => $warn
    ? 'linear-gradient(90deg, #F59E0B, #EF4444)'
    : 'linear-gradient(90deg, #10B981, #3B82F6)'};
  transition: width 400ms ease;
`;

const QuotaHint = styled.div`
  font-size: 10px;
  color: ${colors.mutedForeground};
  display: flex;
  align-items: center;
  gap: 4px;

  svg { width: 10px; height: 10px; }
`;

const CacheSectionLabel = styled.div`
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 600;
  color: ${colors.foreground};
  padding: 0 ${Theme.usage.space.xxSmall};
  margin-top: ${Theme.usage.space.xxSmall};
`;

const CacheSectionHint = styled.div`
  font-size: 10px;
  color: ${colors.mutedForeground};
  padding: 0 ${Theme.usage.space.xxSmall};
  margin-top: -4px;
`;

const PasteUrlRow = styled.div`
  display: flex;
  gap: ${Theme.usage.space.xxSmall};
`;

const UrlInput = styled.input`
  flex: 1;
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
  border-radius: ${radius.lg};
  font-size: ${Theme.usage.fontSize.xxSmall};
  background: rgb(var(--app-surface-rgb) / 0.5);
  border: 1px solid rgb(var(--app-overlay-rgb) / 0.04);
  color: ${colors.foreground};
  transition: all 200ms;
  min-width: 0;

  &::placeholder { color: ${colors.mutedForeground}; }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgb(var(--app-violet-rgb) / 0.1);
    border-color: rgb(var(--app-violet-rgb) / 0.4);
  }
`;

const LoadUrlButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
  border-radius: ${radius.lg};
  border: none;
  background: ${colors.violet600};
  color: ${colors.white};
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 600;
  cursor: pointer;
  transition: background 200ms;
  white-space: nowrap;

  &:hover { background: ${colors.violet700}; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.xxSmall} 0;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgb(var(--app-overlay-rgb) / 0.06);
  }
`;

const DividerText = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const DashboardOption = styled.button<{ $selected?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
  padding: ${Theme.usage.space.small};
  border-radius: ${radius.lg};
  border: 1px solid ${({ $selected }) => $selected ? 'rgb(var(--app-violet-rgb) / 0.3)' : 'rgb(var(--app-overlay-rgb) / 0.04)'};
  background: ${({ $selected }) => $selected ? 'rgb(var(--app-violet-rgb) / 0.06)' : 'rgb(var(--app-surface-rgb) / 0.4)'};
  cursor: pointer;
  text-align: left;
  transition: all 200ms;

  &:hover {
    background: rgb(var(--app-violet-rgb) / 0.06);
    border-color: rgb(var(--app-overlay-rgb) / 0.08);
  }
`;

const DashboardOptionInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const DashboardOptionName = styled.div`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.foreground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DashboardOptionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  margin-top: 2px;
  flex-wrap: wrap;
`;

const DomainTag = styled.span<{ $color: string }>`
  display: inline-flex;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  background: ${({ $color }) => `${$color}18`};
  color: ${({ $color }) => $color};
`;

const TierTag = styled.span<{ $color: string }>`
  display: inline-flex;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.02em;
  background: ${({ $color }) => `${$color}14`};
  color: ${({ $color }) => $color};
`;

const SizeTag = styled.span`
  font-size: 10px;
  color: ${colors.mutedForeground};
  font-variant-numeric: tabular-nums;
`;

// Refresh interval selector
const RefreshSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xxSmall};
  margin-top: ${Theme.usage.space.xxSmall};
`;

const RefreshLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  color: ${colors.foreground};

  svg { width: 12px; height: 12px; color: ${colors.mutedForeground}; }
`;

const RefreshGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
`;

const RefreshChip = styled.button<{ $active: boolean; $costLevel: 'low' | 'med' | 'high' }>`
  padding: 5px 4px;
  border-radius: ${radius.md};
  border: 1px solid ${({ $active }) => $active ? 'rgb(var(--app-violet-rgb) / 0.4)' : 'rgb(var(--app-overlay-rgb) / 0.04)'};
  background: ${({ $active }) => $active ? 'rgb(var(--app-violet-rgb) / 0.08)' : 'transparent'};
  cursor: pointer;
  font-size: 10px;
  font-weight: 500;
  color: ${({ $active }) => $active ? colors.violet600 : colors.mutedForeground};
  transition: all 150ms;
  text-align: center;
  line-height: 1.3;

  &:hover {
    border-color: rgb(var(--app-violet-rgb) / 0.2);
    color: ${colors.foreground};
  }
`;

const CostDot = styled.span<{ $level: 'low' | 'med' | 'high' }>`
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  margin-left: 3px;
  vertical-align: middle;
  background: ${({ $level }) => {
    switch ($level) {
      case 'low': return '#10B981';
      case 'med': return '#F59E0B';
      case 'high': return '#EF4444';
    }
  }};
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const LoadCacheButton = styled.button<{ $loading?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
  border-radius: ${radius.lg};
  border: none;
  background: linear-gradient(135deg, ${colors.violet600}, ${colors.violet700});
  color: ${colors.white};
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms;
  box-shadow: 0 2px 8px rgb(var(--app-violet-rgb) / 0.25);

  &:hover {
    box-shadow: 0 4px 12px rgb(var(--app-violet-rgb) / 0.35);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  svg {
    width: 16px;
    height: 16px;
    ${({ $loading }) => $loading && `animation: ${spin} 1s linear infinite;`}
  }
`;

const CacheCostSummary = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${Theme.usage.space.xxSmall} ${Theme.usage.space.xSmall};
  border-radius: ${radius.md};
  background: rgb(var(--app-overlay-rgb) / 0.03);
  font-size: 10px;
  color: ${colors.mutedForeground};
  margin-top: -4px;
`;

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
`;

const ProgressBarBg = styled.div`
  width: 100%;
  height: 4px;
  border-radius: 9999px;
  background: rgb(var(--app-overlay-rgb) / 0.08);
  overflow: hidden;
`;

const ProgressBarFill = styled(motion.div)`
  height: 100%;
  border-radius: 9999px;
  background: linear-gradient(90deg, ${colors.violet600}, ${colors.violet500});
`;

const ProgressLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const CachedWidgetsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xxSmall};
`;

const CachedWidgetRow = styled(motion.button)`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
  border-radius: ${radius.md};
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  transition: all 150ms;

  &:hover { background: rgb(var(--app-violet-rgb) / 0.06); }
`;

const CachedWidgetIcon = styled.span<{ $type: string }>`
  width: 24px;
  height: 24px;
  border-radius: ${radius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ $type }) => {
    switch ($type) {
      case 'kpi': return 'rgb(var(--app-emerald-rgb, 16 185 129) / 0.1)';
      case 'bar': return 'rgb(var(--app-blue-rgb) / 0.1)';
      case 'line': return 'rgb(var(--app-violet-rgb) / 0.1)';
      case 'area': return 'rgb(var(--app-purple-rgb) / 0.1)';
      case 'pie': return 'rgb(var(--app-amber-rgb, 245 158 11) / 0.1)';
      default: return 'rgb(var(--app-overlay-rgb) / 0.06)';
    }
  }};
  color: ${({ $type }) => {
    switch ($type) {
      case 'kpi': return colors.emerald500;
      case 'bar': return colors.blue600;
      case 'line': return colors.violet600;
      case 'area': return colors.violet500;
      case 'pie': return colors.yellow600;
      default: return colors.mutedForeground;
    }
  }};

  svg { width: 14px; height: 14px; }
`;

const CachedWidgetName = styled.span`
  flex: 1;
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.foreground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CachedWidgetType = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  flex-shrink: 0;
`;

const CachedAddIcon = styled(Plus)`
  width: 12px;
  height: 12px;
  color: ${colors.violet600};
  opacity: 0;
  transition: opacity 150ms;
  flex-shrink: 0;

  ${CachedWidgetRow}:hover & { opacity: 1; }
`;

const SuccessBanner = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
  border-radius: ${radius.lg};
  background: rgb(var(--app-emerald-rgb, 16 185 129) / 0.08);
  border: 1px solid rgb(var(--app-emerald-rgb, 16 185 129) / 0.15);
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.emerald500};
  font-weight: 500;

  svg { width: 14px; height: 14px; flex-shrink: 0; }
`;

const ResetButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
  padding: ${Theme.usage.space.xxSmall} ${Theme.usage.space.xSmall};
  border-radius: ${radius.md};
  border: none;
  background: none;
  cursor: pointer;
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  transition: all 150ms;
  margin-left: auto;

  &:hover {
    color: ${colors.foreground};
    background: rgb(var(--app-overlay-rgb) / 0.06);
  }
`;

export function SourceBrowserPanel({ onSourceSelect, onChartTypeSelect, onAIComplete, activeTab: controlledTab, onTabChange }: SourceBrowserPanelProps) {
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

  // Cache tab state
  const [cacheUrl, setCacheUrl] = useState('');
  const [selectedDashboard, setSelectedDashboard] = useState<CacheableDashboard | null>(null);
  const [cacheLoading, setCacheLoading] = useState(false);
  const [cacheProgress, setCacheProgress] = useState(0);
  const [cachedWidgets, setCachedWidgets] = useState<CachedWidget[]>([]);
  const [cacheComplete, setCacheComplete] = useState(false);
  const [cacheSearch, setCacheSearch] = useState('');
  const [refreshInterval, setRefreshInterval] = useState<RefreshInterval>('24h');

  const filteredDashboards = cacheSearch.trim()
    ? CACHEABLE_DASHBOARDS.filter((d) => d.name.toLowerCase().includes(cacheSearch.toLowerCase()) || d.domain.toLowerCase().includes(cacheSearch.toLowerCase()))
    : CACHEABLE_DASHBOARDS;

  const selectedRefresh = REFRESH_OPTIONS.find((r) => r.value === refreshInterval)!;
  const quotaPct = Math.round((CACHE_QUOTA.used / CACHE_QUOTA.total) * 100);
  const quotaWarn = quotaPct > 70;

  const getCostLevel = (cost: number): 'low' | 'med' | 'high' => {
    if (cost <= 0.5) return 'low';
    if (cost <= 2) return 'med';
    return 'high';
  };

  const handleLoadCache = useCallback((dashboard: CacheableDashboard) => {
    setSelectedDashboard(dashboard);
    setCacheLoading(true);
    setCacheProgress(0);
    setCachedWidgets([]);
    setCacheComplete(false);

    const widgets = MOCK_CACHED_WIDGETS[dashboard.id] || [];
    const totalSteps = widgets.length;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      setCacheProgress((step / totalSteps) * 100);
      if (step >= totalSteps) {
        clearInterval(interval);
        setCacheLoading(false);
        setCachedWidgets(widgets);
        setCacheComplete(true);
      }
    }, 200);
  }, []);

  const handleUrlLoad = useCallback(() => {
    if (!cacheUrl.trim()) return;
    const match = CACHEABLE_DASHBOARDS.find((d) => cacheUrl.includes(d.url) || d.url.includes(cacheUrl.trim()));
    if (match) {
      handleLoadCache(match);
    } else {
      // Simulate loading from an unknown in-house dashboard URL
      const mockDashboard: CacheableDashboard = {
        id: 'cd-custom',
        name: cacheUrl.split('/').pop()?.replace(/-/g, ' ') || 'Custom Dashboard',
        url: cacheUrl,
        domain: 'Custom',
        tier: 'T2',
        widgetCount: 6,
        lastUpdated: 'just now',
        estimatedSizeMB: 250,
      };
      setSelectedDashboard(mockDashboard);
      setCacheLoading(true);
      setCacheProgress(0);
      setCachedWidgets([]);
      setCacheComplete(false);

      const widgets = MOCK_CACHED_WIDGETS['cd-3'] || [];
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setCacheProgress((step / widgets.length) * 100);
        if (step >= widgets.length) {
          clearInterval(interval);
          setCacheLoading(false);
          setCachedWidgets(widgets);
          setCacheComplete(true);
        }
      }, 200);
    }
  }, [cacheUrl, handleLoadCache]);

  const handleCacheReset = useCallback(() => {
    setSelectedDashboard(null);
    setCacheLoading(false);
    setCacheProgress(0);
    setCachedWidgets([]);
    setCacheComplete(false);
    setCacheUrl('');
  }, []);

  const handleCachedWidgetClick = useCallback((widget: CachedWidget) => {
    onChartTypeSelect?.(widget.chartType);
  }, [onChartTypeSelect]);

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

      {activeTab === 'chat' && onAIComplete ? (
        <AIWidgetSidebar onAIComplete={onAIComplete} />
      ) : activeTab === 'cache' ? (
        <AnimatePresence>
          <motion.div
            key="cache"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            <CacheContainer>
              {/* Quota meter — always visible */}
              <QuotaMeter>
                <QuotaHeader>
                  <Shield style={{ color: quotaWarn ? colors.yellow600 : colors.emerald500 }} />
                  <QuotaTitle>Cache Quota</QuotaTitle>
                  <QuotaAmount>{CACHE_QUOTA.used} / {CACHE_QUOTA.total} {CACHE_QUOTA.unit}</QuotaAmount>
                </QuotaHeader>
                <QuotaBarBg>
                  <QuotaBarFill $pct={quotaPct} $warn={quotaWarn} />
                </QuotaBarBg>
                <QuotaHint>
                  <AlertTriangle />
                  Shared team resource — cache only what you need
                </QuotaHint>
              </QuotaMeter>

              {/* If cache is complete, show the cached widgets */}
              {cacheComplete && selectedDashboard ? (
                <>
                  <SuccessBanner
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <CheckCircle2 />
                    <span>Cached {cachedWidgets.length} widgets · refreshing {selectedRefresh.label.toLowerCase()}</span>
                    <ResetButton onClick={handleCacheReset}>
                      <ChevronLeft style={{ width: 12, height: 12 }} />
                      Back
                    </ResetButton>
                  </SuccessBanner>

                  <SearchWrapper>
                    <SearchIcon />
                    <SearchInput
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search cached widgets..."
                    />
                  </SearchWrapper>

                  <BrowseHeader>
                    <BrowseCount>
                      {cachedWidgets.filter((w) => !search.trim() || w.name.toLowerCase().includes(search.toLowerCase())).length} widget{cachedWidgets.length !== 1 ? 's' : ''}
                    </BrowseCount>
                  </BrowseHeader>

                  <CachedWidgetsList>
                    {cachedWidgets
                      .filter((w) => !search.trim() || w.name.toLowerCase().includes(search.toLowerCase()))
                      .map((widget, i) => {
                        const Icon = widget.icon;
                        return (
                          <CachedWidgetRow
                            key={widget.id}
                            onClick={() => handleCachedWidgetClick(widget)}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                          >
                            <CachedWidgetIcon $type={widget.chartType}>
                              <Icon />
                            </CachedWidgetIcon>
                            <CachedWidgetName>{widget.name}</CachedWidgetName>
                            <CachedWidgetType>{widget.chartType}</CachedWidgetType>
                            <CachedAddIcon />
                          </CachedWidgetRow>
                        );
                      })}
                  </CachedWidgetsList>
                </>
              ) : cacheLoading && selectedDashboard ? (
                /* Loading progress */
                <ProgressContainer>
                  <div style={{ display: 'flex', alignItems: 'center', gap: Theme.usage.space.xSmall, marginBottom: Theme.usage.space.xxSmall }}>
                    <Database style={{ width: 16, height: 16, color: colors.violet600 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: Theme.usage.fontSize.xSmall, fontWeight: 500, color: colors.foreground }}>{selectedDashboard.name}</div>
                      <div style={{ fontSize: Theme.usage.fontSize.xxSmall, color: colors.mutedForeground }}>Caching {selectedDashboard.widgetCount} widgets...</div>
                    </div>
                  </div>
                  <ProgressBarBg>
                    <ProgressBarFill
                      initial={{ width: '0%' }}
                      animate={{ width: `${cacheProgress}%` }}
                      transition={{ duration: 0.15 }}
                    />
                  </ProgressBarBg>
                  <ProgressLabel>
                    <span>Snapshotting widget data</span>
                    <span>{Math.round(cacheProgress)}%</span>
                  </ProgressLabel>
                </ProgressContainer>
              ) : (
                /* Default: cache configuration UI */
                <>
                  <CacheSectionLabel>Add Dashboard Cache</CacheSectionLabel>
                  <CacheSectionHint>Pre-compute widget data for instant loading</CacheSectionHint>

                  {/* Dashboard link input */}
                  <PasteUrlRow>
                    <UrlInput
                      type="text"
                      value={cacheUrl}
                      onChange={(e) => setCacheUrl(e.target.value)}
                      placeholder="Paste dashboard link..."
                      onKeyDown={(e) => { if (e.key === 'Enter') handleUrlLoad(); }}
                    />
                    <LoadUrlButton onClick={handleUrlLoad} disabled={!cacheUrl.trim()}>
                      <Download style={{ width: 12, height: 12, marginRight: 4 }} />
                      Load
                    </LoadUrlButton>
                  </PasteUrlRow>

                  <Divider>
                    <DividerText>or pick a dashboard</DividerText>
                  </Divider>

                  <SearchWrapper>
                    <SearchIcon />
                    <SearchInput
                      type="text"
                      value={cacheSearch}
                      onChange={(e) => setCacheSearch(e.target.value)}
                      placeholder="Search in-house dashboards..."
                    />
                  </SearchWrapper>

                  <BrowseHeader>
                    <BrowseCount>{filteredDashboards.length} dashboard{filteredDashboards.length !== 1 ? 's' : ''}</BrowseCount>
                  </BrowseHeader>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: Theme.usage.space.xxSmall }}>
                    {filteredDashboards.map((dashboard) => {
                      const domainColor = DOMAIN_COLORS[dashboard.domain] || '#6B7280';
                      const tierCfg = TIER_CONFIG[dashboard.tier];
                      return (
                        <DashboardOption
                          key={dashboard.id}
                          $selected={selectedDashboard?.id === dashboard.id}
                          onClick={() => setSelectedDashboard(dashboard)}
                        >
                          <SourceIcon $type="cache">
                            <Database />
                          </SourceIcon>
                          <DashboardOptionInfo>
                            <DashboardOptionName>{dashboard.name}</DashboardOptionName>
                            <DashboardOptionMeta>
                              <DomainTag $color={domainColor}>{dashboard.domain}</DomainTag>
                              <TierTag $color={tierCfg.color}>{tierCfg.label}</TierTag>
                              <span>{dashboard.widgetCount} widgets</span>
                              <SizeTag>{(dashboard.estimatedSizeMB / 1000).toFixed(1)} GB</SizeTag>
                            </DashboardOptionMeta>
                          </DashboardOptionInfo>
                        </DashboardOption>
                      );
                    })}
                  </div>

                  {/* Refresh interval + cache button — shown when a dashboard is selected */}
                  {selectedDashboard && !cacheLoading && !cacheComplete && (
                    <>
                      <RefreshSelector>
                        <RefreshLabel>
                          <Clock />
                          Cache refresh interval
                        </RefreshLabel>
                        <RefreshGrid>
                          {REFRESH_OPTIONS.map((opt) => {
                            const level = getCostLevel(opt.cost);
                            return (
                              <RefreshChip
                                key={opt.value}
                                $active={refreshInterval === opt.value}
                                $costLevel={level}
                                onClick={() => setRefreshInterval(opt.value)}
                              >
                                {opt.label.replace('Every ', '')}
                                <CostDot $level={level} />
                              </RefreshChip>
                            );
                          })}
                        </RefreshGrid>
                      </RefreshSelector>

                      <CacheCostSummary>
                        <span>{selectedDashboard.widgetCount} widgets · ~{(selectedDashboard.estimatedSizeMB / 1000).toFixed(1)} GB</span>
                        <span style={{ fontWeight: 600, color: getCostLevel(selectedRefresh.cost) === 'high' ? '#EF4444' : colors.foreground }}>
                          {getCostLevel(selectedRefresh.cost) === 'high' ? 'High cost' : getCostLevel(selectedRefresh.cost) === 'med' ? 'Moderate' : 'Low cost'}
                        </span>
                      </CacheCostSummary>

                      <LoadCacheButton onClick={() => handleLoadCache(selectedDashboard)}>
                        <Download />
                        Cache {selectedDashboard.name}
                      </LoadCacheButton>
                    </>
                  )}
                </>
              )}
            </CacheContainer>
          </motion.div>
        </AnimatePresence>
      ) : (
      <>
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

      <AnimatePresence>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          style={{ display: 'flex', flexDirection: 'column', gap: Theme.usage.space.xxSmall }}
        >
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
      </>
      )}
    </Container>
  );
}
