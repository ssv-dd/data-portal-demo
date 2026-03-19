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
  lastEdited: string;
  metrics: number;
  owner: string;
  shared: boolean;
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
}

// Dashboard Canvas types

export interface WidgetConfig {
  id: string;
  title: string;
  subtitle: string;
  type: 'bar' | 'line' | 'area' | 'pie' | 'kpi';
  data?: any[];
  kpiValue?: string;
  kpiChange?: string;
  kpiTrend?: 'up' | 'down' | 'flat';
  span?: 1 | 2;
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
