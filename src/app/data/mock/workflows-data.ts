import type { Workflow, WorkflowTemplate, WorkflowStatusConfig } from '@/types';
import {
  Play, Pause, CheckCircle, AlertCircle,
  Mail, Database, BarChart3, FileText, GitBranch, RefreshCw,
} from 'lucide-react';

export const mockWorkflows: Workflow[] = [
  { id: '1', title: 'Weekly Business Review Generator', description: 'Auto-generates WBR slides from key metrics every Monday at 8am', status: 'active', schedule: 'Every Monday 8:00 AM', lastRun: '3 days ago', nextRun: 'Tomorrow 8:00 AM', owner: 'Tony', shared: true, steps: 5, successRate: '98%' },
  { id: '2', title: 'DashPass Churn Alert', description: 'Monitors churn rate and alerts Slack when threshold exceeded', status: 'active', schedule: 'Every 6 hours', lastRun: '2 hours ago', nextRun: 'In 4 hours', owner: 'Tony', shared: false, steps: 3, successRate: '100%' },
  { id: '3', title: 'Merchant Onboarding Report', description: 'Daily report on new merchant signups, activation rates, and first-order metrics', status: 'paused', schedule: 'Daily 9:00 AM', lastRun: '5 days ago', owner: 'A. Patel', shared: true, steps: 4, successRate: '95%' },
  { id: '4', title: 'Data Quality Scorecard', description: 'Runs data quality checks across critical tables and publishes scorecard', status: 'active', schedule: 'Daily 6:00 AM', lastRun: '18 hours ago', nextRun: 'Tomorrow 6:00 AM', owner: 'M. Chen', shared: true, steps: 6, successRate: '92%' },
  { id: '5', title: 'Revenue Anomaly Detection', description: 'ML-based anomaly detection on hourly revenue streams', status: 'failed', schedule: 'Hourly', lastRun: '45 min ago', owner: 'Tony', shared: false, steps: 4, successRate: '87%' },
  { id: '6', title: 'Courier Supply Forecast', description: 'Generates 7-day courier supply forecast by zone', status: 'completed', schedule: 'Daily 5:00 AM', lastRun: '12 hours ago', nextRun: 'Tomorrow 5:00 AM', owner: 'S. Lee', shared: true, steps: 7, successRate: '96%' },
];

export const templates: WorkflowTemplate[] = [
  { id: 't1', name: 'Scheduled Report', description: 'Run a query on schedule and deliver results via email or Slack', icon: Mail, category: 'Reporting', steps: 3 },
  { id: 't2', name: 'Data Pipeline Monitor', description: 'Watch for pipeline failures and alert on-call with context', icon: Database, category: 'Monitoring', steps: 4 },
  { id: 't3', name: 'Metric Anomaly Alert', description: 'Detect anomalies in key metrics and trigger notifications', icon: BarChart3, category: 'Alerting', steps: 5 },
  { id: 't4', name: 'Notebook Automation', description: 'Run a notebook on schedule and publish results to a dashboard', icon: FileText, category: 'Automation', steps: 4 },
  { id: 't5', name: 'ETL Orchestration', description: 'Chain SQL transforms with dependency management', icon: GitBranch, category: 'Data Eng', steps: 6 },
  { id: 't6', name: 'Recurring Analysis', description: 'Re-run an AI analysis periodically and track changes over time', icon: RefreshCw, category: 'Analysis', steps: 5 },
];

export const statusConfig: Record<string, WorkflowStatusConfig> = {
  active: { icon: Play, label: 'Active', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  paused: { icon: Pause, label: 'Paused', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  completed: { icon: CheckCircle, label: 'Completed', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  failed: { icon: AlertCircle, label: 'Failed', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
};
