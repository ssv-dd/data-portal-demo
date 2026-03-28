export interface Artifact {
  id: string;
  type: 'sql' | 'notebook' | 'dashboard';
  title: string;
  description: string;
  owner: string;
  created: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedDate?: string;
  source?: string;
  confidence?: 'high' | 'medium' | 'low';
  sql?: string;
  tags?: string[];
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  resultCards?: Artifact[];
}

export interface TelemetryEvent {
  id: string;
  time: string;
  artifact: string;
  owner: string;
  status: 'success' | 'pending' | 'failed';
  log: string;
}

export type UserRole = 'business-executive' | 'business-executive-pa' | 'so-analyst' | 'data-scientist' | 'data-engineer';

export interface SearchResult {
  id: string;
  name: string;
  type: 'dashboard' | 'table' | 'metric';
  description: string;
  lastUpdated?: string;
  owner?: string;
  tags?: string[];
  verified?: boolean;
  isPedregal?: boolean;
}

export interface GoldenDashboard {
  id: string;
  title: string;
  description: string;
  chartType: 'line' | 'area' | 'bar';
  data: Array<Record<string, unknown>>;
  dataKey: string;
  color: string;
  icon?: string;
  thumbnail?: string;
}

export interface GoldenDashboardCardProps {
  dashboard: GoldenDashboard;
  onClick?: () => void;
  compact?: boolean;
}

// SQL Studio types

export interface SavedQuery {
  id: string;
  title: string;
  description: string;
  lastEdited: string;
  owner: string;
  shared: boolean;
}

export interface QueryHistoryItem {
  id: string;
  title: string;
  timestamp: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  type: 'table' | 'folder';
  children?: CatalogItem[];
}

// Canvas types

export interface Canvas {
  id: string;
  title: string;
  description: string;
  domain: string;
  tier: 'T0' | 'T1' | 'T2';
  status: 'draft' | 'published';
  createdAt: string;
  lastEdited: string;
  owner: string;
  shared: boolean;
  layout: CanvasLayoutItem[];
  golden?: boolean;
  externalUrl?: string;
}

export interface CanvasLayoutItem {
  widgetId: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

// Notebook types

export interface Notebook {
  id: string;
  title: string;
  description: string;
  lastEdited: string;
  owner: string;
  shared: boolean;
  cells: number;
  language: string;
}

export interface NotebookTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  cells: number;
}

// Workflow types

export type WorkflowStatus = 'active' | 'paused' | 'completed' | 'failed';

export interface Workflow {
  id: string;
  title: string;
  description: string;
  status: WorkflowStatus;
  schedule: string;
  lastRun: string;
  nextRun?: string;
  owner: string;
  shared: boolean;
  steps: number;
  successRate: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: string;
  steps: number;
}

export interface WorkflowStatusConfig {
  icon: React.ElementType;
  label: string;
  color: string;
  bg: string;
  borderColor: string;
}

// Dashboard Canvas types

export interface ChartBuilderField {
  id: string;
  name: string;
  role: 'measure' | 'dimension' | 'date';
  dataType: 'number' | 'string' | 'date';
  description?: string;
  aggregation?: 'SUM' | 'COUNT' | 'AVG' | 'MIN' | 'MAX';
}

// New chart types for chart builder. Includes legacy 'pie' for backward compat until Task 8.
export type ChartType = 'column' | 'bar' | 'line' | 'area' | 'scatter' | 'donut' | 'pie' | 'kpi' | 'table';

// Alias for spec compliance
export type Field = ChartBuilderField;

export interface WidgetConfig {
  id: string;
  title: string;
  subtitle: string;
  type: ChartType;
  data?: any[];
  kpiValue?: string;
  kpiChange?: string;
  kpiTrend?: 'up' | 'down' | 'flat';
  description?: string;
  category?: string;
  metricId?: string;
  query?: {
    sourceId: string;
    sourceType: 'sql' | 'semantic' | 'metrics';
    measures: ChartBuilderField[];
    dimensions: ChartBuilderField[];
    dateField?: ChartBuilderField;
  };
}

// Telemetry KPIs

export interface TelemetryKPIs {
  lastIngest: string;
  retrainQueueLength: number;
  verifiedAssetsCount: number;
  hallucinations: number;
  lastVerifiedAsset: string;
  lastVerifiedBy: string;
}
