export type MetricStatus = 'healthy' | 'warning' | 'critical' | 'excellent';

export interface AIInsight {
  summary: string;
  confidence: number;
  details?: string;
}

export interface Metric {
  id: string;
  category: string;
  name: string;
  description: string;
  current: string;
  prior: string;
  change: number;
  changeLabel: string;
  vsPlan?: string;
  vsPlanValue?: number;
  trend: number[]; // 7-day values for sparkline
  status: MetricStatus;
  aiInsight: AIInsight;
}

export interface ProductArea {
  id: string;
  name: string;
  metrics: Metric[];
  overallStatus: MetricStatus;
  quickView?: {
    metric1: string;
    metric2: string;
  };
}

export interface ExecutiveScorecardProps {
  productAreas: ProductArea[];
  aiSummaries: Record<string, AIExecutiveSummary>;
  sourceDashboards?: SourceDashboard[];
  onTimeRangeChange?: (range: string) => void;
  onOpenChat?: (query: string, context: string) => void;
  userRole?: string;
}

export interface MetricOption {
  id: string;
  name: string;
  category: string;
  description: string;
  popular?: boolean;
  owner?: string;
  lastUpdated?: string;
  definition?: string;
  source?: string;
}

export interface ProductAreaConfig {
  id: string;
  name: string;
  enabled: boolean;
  selectedMetrics: string[];
}

export interface ScorecardCustomizationProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: string;
  currentConfig: ProductAreaConfig[];
  availableMetrics: Record<string, MetricOption[]>;
  onSave: (config: ProductAreaConfig[]) => void;
  onChange?: (config: ProductAreaConfig[]) => void;
}

export interface MetricDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metric: Metric;
}

// AI Executive Summary types (used in scorecard)

export interface AISource {
  id: number;
  name: string;
  type: string;
  url: string;
  lastRefreshed: string;
}

export interface AIHighlight {
  title: string;
  metric: string;
  insight: string;
  sources?: number[];
  crossProduct?: string;
  action?: string;
  caution?: string;
}

export interface AIConcern {
  title: string;
  metric: string;
  insight: string;
  sources?: number[];
  actions?: string[];
}

export interface AIExecutiveSummary {
  timestamp: string;
  confidence: number;
  overallHealth: string;
  trend: string;
  summary: string;
  highlights: AIHighlight[];
  concerns: AIConcern[];
  emergingPatterns: string[];
  sources?: AISource[];
}

export interface SourceDashboard {
  id: number;
  name: string;
  url: string;
  type: string;
  lastRefreshed: string;
}
